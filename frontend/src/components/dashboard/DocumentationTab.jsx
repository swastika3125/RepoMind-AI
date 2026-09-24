import React, { useState } from "react";
import { FaCopy, FaCheck, FaDownload } from "react-icons/fa";

const DocumentationTab = ({ docContent, onGenerateDocs, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!docContent) return;
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!docContent) return;
    const blob = new Blob([docContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "DOCUMENTATION.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: "2rem" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Technical System Documentation
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
            Comprehensive developer documentation covering architecture, execution flow, APIs, and future enhancements.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={onGenerateDocs}
            disabled={loading}
            className="btn btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
          >
            {loading ? "Generating..." : docContent ? "Regenerate Documentation" : "Generate Documentation"}
          </button>

          {docContent && (
            <>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
              >
                {copied ? <><FaCheck style={{ color: "#10b981" }} /> Copied</> : <><FaCopy /> Copy Markdown</>}
              </button>

              <button
                onClick={handleDownload}
                className="btn btn-outline"
                style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
              >
                <FaDownload /> Download
              </button>
            </>
          )}
        </div>
      </div>

      {docContent ? (
        <div style={{
          background: "#0d1117",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          maxHeight: "600px",
          overflowY: "auto"
        }}>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
            <code>{docContent}</code>
          </pre>
        </div>
      ) : (
        <div style={{
          padding: "3.5rem",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px dashed var(--border-color)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-muted)"
        }}>
          Click "Generate Documentation" to create full technical documentation of this codebase.
        </div>
      )}
    </div>
  );
};

export default DocumentationTab;
