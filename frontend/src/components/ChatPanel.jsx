import React, { useState } from "react";
import styles from "./ChatPanel.module.css";
import { Send, FilePlus, Loader2 } from "lucide-react";

const ChatPanel = ({ session, updateSession }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!session) return <div className={styles.chatPanel}>No session selected</div>;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const filename = data.filename || file.name;

      updateSession({ ...session, document: filename, messages: [{ sender: "bot", text: "✅ File uploaded successfully!" }] });
    } catch {
      updateSession({ ...session, messages: [{ sender: "bot", text: "⚠️ Error uploading file." }] });
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    const updatedMessages = [...session.messages, userMsg];
    updateSession({ ...session, messages: updatedMessages });
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", input);
      const response = await fetch("http://127.0.0.1:8000/ask/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const botMsg = { sender: "bot", text: data.answer || "No response." };
      updateSession({ ...session, messages: [...updatedMessages, botMsg] });
    } catch {
      updateSession({ ...session, messages: [...updatedMessages, { sender: "bot", text: "⚠️ Server error." }] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatPanel}>
      {!session.document ? (
        <div className={styles.uploadSection}>
          <FilePlus size={40} />
          <h2>Upload a document to start chatting</h2>
          <input type="file" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? <Loader2 className={styles.spin} size={18} /> : "Upload"}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.chatHeader}>📂 {session.document}</div>
          <div className={styles.chatWindow}>
            {session.messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.bot}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className={styles.botTyping}>🤖 Bot is thinking...</div>}
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              placeholder="Ask about your document..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}><Send size={18} /></button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;


