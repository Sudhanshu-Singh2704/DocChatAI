import React from "react";
import styles from "./Sidebar.module.css";
import { MessageSquare, Trash2 } from "lucide-react";

const Sidebar = ({ history, loadSession, startNewChat, deleteSession }) => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>📄 DocChat AI</h2>

      <div className={styles.section}>
        <h3>Chat History</h3>
        {history.length === 0 && <p className={styles.empty}>No sessions yet</p>}
        {history.map((h) => (
          <div key={h.id} className={styles.historyItem}>
            <div onClick={() => loadSession(h.id)} className={styles.historyText}>
              <MessageSquare size={16} />
              <span>{h.name}{h.document ? ` - ${h.document}` : ""}</span>
            </div>
            <Trash2
              size={16}
              className={styles.deleteIcon}
              onClick={() => deleteSession(h.id)}
            />
          </div>
        ))}
      </div>

      <button className={styles.newChatBtn} onClick={startNewChat}>
        + New Chat
      </button>
    </div>
  );
};

export default Sidebar;



