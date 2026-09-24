import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBrain, FaGithub, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { checkHealth } from "../services/api";

const Navbar = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const verifyStatus = async () => {
      try {
        const res = await checkHealth();
        if (res && res.status === "healthy") {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch (err) {
        setBackendStatus("offline");
      }
    };
    verifyStatus();
    const interval = setInterval(verifyStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-panel" style={{
      position: "sticky",
      top: "1rem",
      zIndex: 50,
      margin: "1rem 1.5rem 0",
      padding: "0.85rem 1.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "var(--radius-xl)"
    }}>
      <Link to="/" style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        textDecoration: "none",
        color: "inherit"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
          color: "white",
          fontSize: "1.25rem"
        }}>
          <FaBrain />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
            RepoMind <span style={{ color: "var(--accent-cyan)" }}>AI</span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "-2px" }}>
            GitHub Repository Intelligence
          </div>
        </div>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: location.pathname === "/" ? "var(--accent-cyan)" : "var(--text-muted)",
            transition: "var(--transition)"
          }}
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: location.pathname === "/dashboard" ? "var(--accent-cyan)" : "var(--text-muted)",
            transition: "var(--transition)"
          }}
        >
          Analyzer
        </Link>
        <Link
          to="/about"
          style={{
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: location.pathname === "/about" ? "var(--accent-cyan)" : "var(--text-muted)",
            transition: "var(--transition)"
          }}
        >
          About
        </Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Backend Status indicator */}
        <div
          title={backendStatus === "online" ? "Backend connected" : "Backend offline or starting"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "9999px",
            background: backendStatus === "online" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
            border: `1px solid ${backendStatus === "online" ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
            color: backendStatus === "online" ? "#6ee7b7" : "#fda4af"
          }}
        >
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: backendStatus === "online" ? "#10b981" : "#f43f5e",
            boxShadow: backendStatus === "online" ? "0 0 8px #10b981" : "none"
          }} />
          {backendStatus === "online" ? "API Live" : "API Offline"}
        </div>

        <a
          href="https://github.com/swastika3125/RepoMind-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
        >
          <FaGithub /> GitHub
        </a>
      </div>
    </header>
  );
};

export default Navbar;
