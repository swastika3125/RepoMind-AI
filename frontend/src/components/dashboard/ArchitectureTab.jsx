import React from "react";

const ArchitectureTab = ({ architecture }) => {
  if (!architecture) {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        Architecture analysis not available. Configure OPENAI_API_KEY in backend/.env to generate architecture breakdown.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--accent-cyan)" }}>
          End-to-End Data Flow
        </h3>
        <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-main)" }}>
          {architecture.data_flow}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        <div className="glass-card">
          <h4 style={{ color: "var(--accent-primary)", marginBottom: "0.5rem" }}>Frontend Architecture</h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {architecture.frontend || "None found or not applicable."}
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ color: "var(--accent-secondary)", marginBottom: "0.5rem" }}>Backend Architecture</h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {architecture.backend || "None found or not applicable."}
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>Database & Storage</h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {architecture.database || "None found or not applicable."}
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ color: "var(--accent-emerald)", marginBottom: "0.5rem" }}>External APIs</h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {architecture.external_apis || "None found or not applicable."}
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ color: "var(--accent-amber)", marginBottom: "0.5rem" }}>Authentication & Security</h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {architecture.authentication || "None found or not applicable."}
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ color: "var(--accent-rose)", marginBottom: "0.5rem" }}>AI & ML Services</h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {architecture.ai_components || "None found or not applicable."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureTab;
