import os
import subprocess
from tqdm import tqdm
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import (
    TextLoader, Docx2txtLoader, PyPDFLoader, UnstructuredWordDocumentLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

MODEL_NAME = "dolphin-mistral"
DATA_FOLDER = "docs"
DB_FOLDER = "chroma_db"

# === Vérifie si Ollama tourne ===
def check_ollama_running():
    try:
        subprocess.run(["ollama", "list"], capture_output=True, check=True)
    except:
        print("❌ Ollama ne semble pas lancé. Lance-le avec : `ollama serve`")
        exit()

check_ollama_running()

# === Chargement des documents ===
def load_documents(folder_path):
    docs = []
    valid_files = []
    print("🔍 Fichiers détectés :")

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if filename.lower().endswith(".txt"):
            try:
                loader = TextLoader(file_path, autodetect_encoding=True)
                docs.extend(loader.load())
                valid_files.append(filename)
                print(f"✅ {filename}")
            except Exception as e:
                print(f"❌ {filename} (erreur de lecture : {e})")

        elif filename.lower().endswith(".docx") or filename.lower().endswith(".doc"):
            try:
                loader = UnstructuredWordDocumentLoader(file_path)
                docs.extend(loader.load())
                valid_files.append(filename)
                print(f"✅ {filename}")
            except Exception as e:
                print(f"❌ {filename} (erreur de lecture : {e})")

        elif filename.lower().endswith(".pdf"):
            try:
                loader = PyPDFLoader(file_path)
                docs.extend(loader.load())
                valid_files.append(filename)
                print(f"✅ {filename}")
            except Exception as e:
                print(f"❌ {filename} (erreur de lecture : {e})")

        else:
            print(f"⚠️ Format non pris en charge : {filename}")

    return docs, valid_files

print("\n🔍 Chargement des documents...")
documents, file_list = load_documents(DATA_FOLDER)

if not documents:
    print("⚠️ Aucun document chargé. Ajoute des .txt, .doc(x) ou .pdf dans le dossier `docs/`.")
    exit()

# === Split en chunks ===
splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=30)
texts = splitter.split_documents(documents)

# === Embedding + Vectorisation ===
print("\n🔧 Vectorisation des documents...")

embedding = OllamaEmbeddings(model=MODEL_NAME)

# Vectorisation avec barre de progression
vector_chunks = []
for chunk in tqdm(texts, desc="📦 Vectorisation en cours"):
    vector_chunks.append(chunk)

# Base Chroma
if os.path.exists(DB_FOLDER):
    db = Chroma(persist_directory=DB_FOLDER, embedding_function=embedding)
else:
    db = Chroma.from_documents(vector_chunks, embedding, persist_directory=DB_FOLDER)
    db.persist()

# === LLM + RAG ===
llm = Ollama(model=MODEL_NAME)
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever())

print("\n🤖 Agent RAG prêt. Pose ta question ou tape 'exit' pour quitter.")

# === Interface utilisateur ===
while True:
    query = input("🧠 > ")
    if query.strip().lower() in ["exit", "quit"]:
        print("👋 À bientôt, Grégory.")
        break
    answer = qa_chain.run(query)
    print(f"📚 Réponse : {answer}")
