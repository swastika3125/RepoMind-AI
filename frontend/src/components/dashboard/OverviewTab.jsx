import React from "react";
import { FaFileCode } from "react-icons/fa";

const OverviewTab = ({ summary }) => {
  if (!summary) {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        No AI summary generated. Provide an OPENAI_API_KEY in backend/.env to view intelligent project summaries.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--accent-cyan)" }}>
          Project Overview
        </h3>
        <p style={{ color: "var(--text-main)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          {summary.overview}
        </p>

        <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-muted)" }}>
          Main Purpose
        </h4>
        <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.6 }}>
          {summary.main_purpose}
        </p>
      </div>

      {summary.major_features && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            Major Features
          </h3>
          <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {summary.major_features.map((feat, idx) => (
              <li key={idx} style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.tech_stack && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Detected Technology Stack
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {Object.entries(summary.tech_stack).map(([cat, items]) => (
              <div key={cat} className="glass-card">
                <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {cat.replace("_", " ")}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {Array.isArray(items) && items.map((item, idx) => (
                    <span key={idx} className="badge badge-indigo">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.important_components && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            Core Architecture Components
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {summary.important_components.map((comp, idx) => (
              <div key={idx} style={{
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem"
              }}>
                <FaFileCode style={{ color: "var(--accent-primary)", marginTop: "0.25rem" }} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {comp.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
