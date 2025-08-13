import os
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from src.config import GROQ_API_KEY, VECTOR_DB_PATH

# ✅ Load text into FAISS vector database
def load_text_into_db(text):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    text_splitter = CharacterTextSplitter(
        separator="\n\n",  
        chunk_size=500,
        chunk_overlap=100
    )
    
    documents = text_splitter.create_documents([text])
    
    # Create or update FAISS vector store
    vectorstore = FAISS.from_documents(documents, embeddings)
    vectorstore.save_local(VECTOR_DB_PATH)


# ✅ Chat-based question answering with dynamic response control
class ChatBot:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.vectorstore = FAISS.load_local(VECTOR_DB_PATH, self.embeddings, allow_dangerous_deserialization=True)
        self.retriever = self.vectorstore.as_retriever()
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        self.llm = ChatGroq(api_key=GROQ_API_KEY, model="llama-3.3-70b-versatile")

    def generate_prompt(self, query):
        """
        Dynamically modifies the prompt based on user instructions.
        """
        # Default instruction
        response_style = "Provide a detailed but concise answer."

        # ✅ Modify response based on user input
        if "one line" in query.lower():
            response_style = "Provide the answer in a single line."
        elif "bullet points" in query.lower():
            response_style = "Provide the answer in bullet points."
        elif "detailed" in query.lower():
            response_style = "Provide a very detailed explanation."

        # ✅ Construct the custom prompt dynamically
        custom_prompt = PromptTemplate(
            input_variables=["context", "question", "chat_history"],
            template=f"""
            You are an AI assistant that answers questions based only on the provided document. 
            Do not make up information. If the answer is not in the document, say "I couldn't find that information in the document."

            Chat History:
            {{chat_history}}

            Document Context:
            {{context}}

            Question: {{question}}
            Instruction: {response_style}
            Answer:
            """
        )
        return custom_prompt

    def chat(self, query):  
        # ✅ Get a dynamically modified prompt based on user query
        custom_prompt = self.generate_prompt(query)

        # ✅ Create a new ConversationalRetrievalChain using the updated prompt
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.retriever,
            memory=self.memory,
            combine_docs_chain_kwargs={"prompt": custom_prompt}
        )
        
        return qa_chain.run(query)


chatbot = ChatBot()  # ✅ Create instance at the end of file



     


