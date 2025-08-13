import os
from dotenv import load_dotenv

load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Load API key securely
VECTOR_DB_PATH = "vector_db"
UPLOAD_FOLDER = "uploaded_files"
