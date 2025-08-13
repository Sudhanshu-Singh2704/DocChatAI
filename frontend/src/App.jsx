import React, { useState } from "react";
import styles from "./App.module.css";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";

function App() {
  const [sessions, setSessions] = useState([
    { id: 1, name: "Session 1", document: null, messages: [] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const startNewChat = () => {
    const newId = Date.now();
    setSessions([
      ...sessions,
      { id: newId, name: `Session ${sessions.length + 1}`, document: null, messages: [] }
    ]);
    setActiveSessionId(newId);
  };

  const updateSession = (updatedSession) => {
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
  };

  const loadSession = (id) => setActiveSessionId(id);

  // ✅ Delete session by ID
  const deleteSession = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    // If deleted session was active, switch to last session or create new
    if (id === activeSessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[updated.length - 1].id);
      } else {
        const newId = Date.now();
        setSessions([{ id: newId, name: "Session 1", document: null, messages: [] }]);
        setActiveSessionId(newId);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar
        history={sessions}
        loadSession={loadSession}
        startNewChat={startNewChat}
        deleteSession={deleteSession}
      />
      <ChatPanel session={activeSession} updateSession={updateSession} />
    </div>
  );
}

export default App;





