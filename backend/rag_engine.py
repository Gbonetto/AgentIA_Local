# backend/rag_engine.py
import os
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import (
    TextLoader, Docx2txtLoader, PyPDFLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

DATA_FOLDER = "backend/uploads"
DB_FOLDER = "chroma_db"
MODEL_NAME = "openhermes"

def load_documents():
    documents = []
    for filename in os.listdir(DATA_FOLDER):
        path = os.path.join(DATA_FOLDER, filename)
        try:
            if filename.endswith(".txt"):
                loader = TextLoader(path, autodetect_encoding=True)
            elif filename.endswith(".docx"):
                loader = Docx2txtLoader(path)
            elif filename.endswith(".pdf"):
                loader = PyPDFLoader(path)
            else:
                continue
            documents.extend(loader.load())
        except Exception as e:
            print(f"Erreur {filename} : {e}")
    return documents

def build_chain():
    docs = load_documents()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = splitter.split_documents(docs)
    embeddings = OllamaEmbeddings(model=MODEL_NAME)
    db = Chroma.from_documents(texts, embedding=embeddings, persist_directory=DB_FOLDER)
    db.persist()
    llm = Ollama(model=MODEL_NAME)
    return RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever())
