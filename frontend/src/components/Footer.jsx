import React from "react";
import { FaHeart, FaGithub, FaBrain } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-color)",
      marginTop: "4rem",
      padding: "2.5rem 1.5rem",
      background: "rgba(10, 13, 20, 0.8)",
      backdropFilter: "blur(12px)",
      color: "var(--text-muted)",
      fontSize: "0.9rem"
    }}>
      <div style={{
        maxWidth: "1300px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FaBrain style={{ color: "var(--accent-primary)", fontSize: "1.2rem" }} />
          <div>
            <span style={{ fontWeight: 700, color: "var(--text-main)" }}>RepoMind AI</span>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "2px" }}>
              Next-generation GitHub repository analyzer powered by RAG & GenAI.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a
            href="https://github.com/swastika3125/RepoMind-AI"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <FaGithub /> swastika3125/RepoMind-AI
          </a>
          <span>•</span>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
