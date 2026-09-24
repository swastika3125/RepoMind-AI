import React, { useState } from "react";
import { FaComments, FaPaperPlane, FaBrain, FaFileCode } from "react-icons/fa";

const PRESET_QUESTIONS = [
  "How does the application flow work?",
  "Where are the API routes defined?",
  "Explain the project structure and key files.",
  "How is error handling and validation implemented?",
  "Where would I modify authentication or database logic?"
];

const ChatTab = ({ chatMessages, onSendMessage, chatLoading }) => {
  const [inputQuery, setInputQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || chatLoading) return;
    onSendMessage(inputQuery.trim());
    setInputQuery("");
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      display: "flex",
      flexDirection: "column",
      height: "650px",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}>
            <FaComments />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Repository AI Chat</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              Grounded in indexed files via ChromaDB vector store
            </div>
          </div>
        </div>
      </div>

      {/* Preset Questions */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 1.5rem",
        background: "rgba(10, 13, 20, 0.4)",
        overflowX: "auto",
        borderBottom: "1px solid var(--border-color)"
      }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>Quick Ask:</span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(q)}
            disabled={chatLoading}
            className="badge"
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-color)",
              transition: "var(--transition)"
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: "1.5rem",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div style={{
              maxWidth: "80%",
              padding: "0.9rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: msg.sender === "user"
                ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                : "rgba(22, 31, 54, 0.8)",
              border: `1px solid ${msg.sender === "user" ? "transparent" : "var(--border-color)"}`,
              color: "var(--text-main)",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div style={{
                  marginTop: "0.75rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  alignItems: "center"
                }}>
                  <span>Referenced Sources:</span>
                  {msg.sources.map((src, i) => (
                    <span key={i} className="badge badge-indigo" style={{ fontSize: "0.7rem" }}>
                      <FaFileCode /> {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "0.8rem 1.2rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(22, 31, 54, 0.8)",
              border: "1px solid var(--border-color)",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <FaBrain className="animate-spin" style={{ color: "var(--accent-cyan)" }} />
              Searching vector repository chunks and formulating response...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          gap: "0.75rem",
          background: "rgba(15, 21, 35, 0.6)"
        }}
      >
        <input
          type="text"
          placeholder="Ask anything about the codebase (e.g., 'How does authentication work?')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={chatLoading}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(10, 13, 20, 0.7)",
            border: "1px solid var(--border-color)",
            color: "var(--text-main)",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
        <button
          type="submit"
          disabled={chatLoading || !inputQuery.trim()}
          className="btn btn-primary"
          style={{ padding: "0.75rem 1.25rem" }}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatTab;
