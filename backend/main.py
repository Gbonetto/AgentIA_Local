# backend/main.py
import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from langchain_community.document_loaders import (
    PyPDFLoader, TextLoader, Docx2txtLoader, UnstructuredWordDocumentLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA

# ── CONFIG ────────────────────────────────────────────────────────────────────
MODEL_NAME    = "dolphin-mistral"
UPLOADS_DIR   = "uploads"    # dossier où l’UI place les fichiers
DB_DIR        = "chroma_db"  # base Chroma persistée
CHUNK_SIZE    = 500
CHUNK_OVERLAP = 50

# ── FASTAPI ───────────────────────────────────────────────────────────────────
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── EMBEDDINGS & VECTORSTORE ──────────────────────────────────────────────────
emb = OllamaEmbeddings(model=MODEL_NAME)
db = Chroma(persist_directory=DB_DIR, embedding_function=emb)
retriever = db.as_retriever()

# ── LLM + QA ──────────────────────────────────────────────────────────────────
llm      = Ollama(model=MODEL_NAME)
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# ── REQUÊTES ───────────────────────────────────────────────────────────────────
class AskRequest(BaseModel):
    question: str
    files: Optional[List[str]] = None

@app.post("/ask")
async def ask(req: AskRequest):
    # récupère tous les chunks encodés
    docs = retriever.get_relevant_documents(req.question)
    # si on a une liste de fichiers, on filtre par filename
    if req.files:
        docs = [
            d for d in docs
            if os.path.basename(d.metadata.get("source", "")) in req.files
        ]
    answer = qa_chain.run(req.question)
    return {"answer": answer}

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    # sauvegarde
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    dest = os.path.join(UPLOADS_DIR, file.filename)
    with open(dest, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    # loader selon extension
    if file.filename.endswith(".pdf"):
        loader = PyPDFLoader(dest)
    elif file.filename.endswith(".txt"):
        loader = TextLoader(dest)
    elif file.filename.endswith(".docx"):
        loader = Docx2txtLoader(dest)
    elif file.filename.endswith(".doc"):
        loader = UnstructuredWordDocumentLoader(dest)
    else:
        return {"filename": file.filename, "error": "Format non pris en charge"}

    # split + embed + add to DB
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
    )
    chunks = splitter.split_documents(docs)
    db.add_documents(chunks)
    db.persist()

    return {"filename": file.filename}
