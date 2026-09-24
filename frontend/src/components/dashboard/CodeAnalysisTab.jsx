import React from "react";

const CodeAnalysisTab = ({ codeInsights }) => {
  if (!codeInsights) {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        No code insights available. Provide OPENAI_API_KEY in backend/.env to view codebase analysis.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="animate-fade-in">
      {Object.entries(codeInsights).map(([key, value]) => (
        <div key={key} className="glass-panel" style={{ padding: "1.75rem" }}>
          <h4 style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            textTransform: "capitalize",
            color: "var(--accent-cyan)",
            marginBottom: "1rem"
          }}>
            {key.replace(/_/g, " ")}
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6ee7b7", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                ✓ What Was Found
              </div>
              <p style={{ color: "var(--text-main)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                {value.found || "No explicit patterns identified."}
              </p>
            </div>

            <div style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(99, 102, 241, 0.06)",
              border: "1px solid rgba(99, 102, 241, 0.2)"
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                💡 Suggested Improvements
              </div>
              <p style={{ color: "var(--text-main)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                {value.suggestions || "No specific improvements suggested."}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodeAnalysisTab;
