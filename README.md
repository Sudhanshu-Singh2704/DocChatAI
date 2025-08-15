# 📄 DocChat AI  

DocChat AI is an **AI-powered document interaction platform** that allows users to **chat directly with their documents** (PDFs, PPTs, and more) to extract insights, summaries, and answers in real time. Instead of manually reading through long files, users can ask natural language questions, and the system will respond with accurate, context-aware answers.

---

## 🚀 Features  
- **Interactive Document Chat** – Ask questions and get instant answers from your uploaded documents.  
- **Multi-Format Support** – Supports PDFs, PPTs.  
- **Semantic Search** – Retrieves the most relevant content, not just keyword matches.  
- **Real-Time Processing** – Instant document parsing and AI-driven responses.  
- **Secure File Handling** – Processes documents without storing sensitive data permanently.  
- **Multi-Document Querying** – Cross-reference multiple documents in a single chat session.  

---

## 🛠️ Tech Stack  
**Backend**  
- Python, FastAPI    
- Vector Database (for embeddings)  
- LangChain / NLP Processing  

**Frontend**  
- React + Vite  


---
## ⚙️ Backend Setup (Python + FastAPI)  

### 1️⃣ Create & Activate Virtual Environment  

## Create venv
python -m venv .venv

## Activate venv
** On Windows
.venv\Scripts\activate
## On macOS/Linux
source .venv/bin/activate

## Run Backend Server
cd backend
uvicorn app.main:app --reload

## For Frontend
cd frontend
npm install

## Run Frontend
npm run dev


