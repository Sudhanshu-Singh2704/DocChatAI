from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from src.config import UPLOAD_FOLDER
from src.processing import extract_text
from src.chat import load_text_into_db, chatbot

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to DocChat AI Backend"}

# ✅ File upload and processing
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        print(f"📂 Saving file to: {file_path}")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        extracted_text = extract_text(file_path)
        print("📄 Extracted text length:", len(extracted_text))

        # Load into chatbot DB
        load_text_into_db(extracted_text)
        print("✅ Loaded extracted text into chatbot database.")

        return {"filename": file.filename, "status": "success"}

    except Exception as e:
        print("⚠️ Upload error:", str(e))
        return {"status": "failed", "error": str(e)}

# ✅ Chat endpoint
@app.post("/ask/")
async def ask_question_endpoint(query: str = Form(...)):
    try:
        print(f"🤖 Received query: {query}")
        answer = chatbot.chat(query)
        print(f"🤖 Chatbot response: {answer}")

        if not answer or answer.strip() == "":
            return {"answer": "I couldn't find anything related to your question in the PDF."}

        return {"answer": answer}

    except Exception as e:
        print("⚠️ Error in /ask/:", str(e))
        return {"answer": f"⚠️ Server error: {str(e)}"}



