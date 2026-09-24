import React from "react";
import { FaBrain, FaGithub, FaShieldAlt, FaDatabase, FaLayerGroup, FaBolt } from "react-icons/fa";

const About = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "900px", margin: "0 auto" }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "1.5rem"
          }}>
            <FaBrain />
          </div>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>About RepoMind AI</h1>
            <p style={{ color: "var(--accent-cyan)", fontSize: "0.9rem" }}>
              AI-Powered GitHub Repository Analyzer & RAG Assistant
            </p>
          </div>
        </div>

        <p style={{ color: "var(--text-main)", fontSize: "1.05rem", lineHeight: 1.7, marginTop: "1rem" }}>
          RepoMind AI is a full-stack Generative AI application built to help developers, engineering leads,
          and students immediately understand any public GitHub repository. By combining the official GitHub REST API,
          intelligent file filtering, ChromaDB vector indexing (RAG), and Large Language Models, RepoMind AI converts
          complex codebases into clear architecture diagrams, actionable code reviews, and an interactive chat assistant.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-card">
          <FaLayerGroup style={{ color: "var(--accent-primary)", fontSize: "1.5rem", marginBottom: "0.75rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Modular Full-Stack</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Decoupled architecture featuring a Flask REST backend and a high-performance React + Vite glassmorphic dashboard.
          </p>
        </div>

        <div className="glass-card">
          <FaDatabase style={{ color: "var(--accent-cyan)", fontSize: "1.5rem", marginBottom: "0.75rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>ChromaDB Vector RAG</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Semantic chunking and embedding storage of key repository source files ensures accurate, hallucination-free answers.
          </p>
        </div>

        <div className="glass-card">
          <FaShieldAlt style={{ color: "var(--accent-emerald)", fontSize: "1.5rem", marginBottom: "0.75rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Secure by Design</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Zero code execution on downloaded files. API tokens and secrets remain strictly in backend environment variables.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
          End-to-End Processing Architecture
        </h3>
        <pre style={{ margin: 0, padding: "1.5rem", fontSize: "0.85rem", overflowX: "auto" }}>
          <code>{`React Frontend (Vite)
       ↓  REST API Requests
Flask REST Backend (Python 3)
       ↓
GitHub REST API (/repos/{owner}/{repo} & /git/trees/{tree_sha})
       ↓
File Filtering & Prioritization (Config, Entrypoints, Source Code)
       ↓
Semantic Chunking & ChromaDB Vector Store
       ↓
Context Retrieval (RAG) + OpenAI LLM
       ↓
Rich Interactive Dashboard, Analysis & Chatbot`}</code>
        </pre>
      </div>
    </div>
  );
};

export default About;
