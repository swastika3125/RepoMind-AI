import React, { useEffect, useState } from "react";
import { FaTimes, FaCopy, FaCheck, FaFileCode } from "react-icons/fa";
import { getFileContent } from "../services/api";

const CodeViewerModal = ({ owner, repo, path, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFileContent({ owner, repo, path });
        if (isMounted) {
          setFileData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load file content.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (owner && repo && path) {
      fetchContent();
    }

    return () => {
      isMounted = false;
    };
  }, [owner, repo, path]);

  const handleCopy = () => {
    if (fileData && fileData.content) {
      navigator.clipboard.writeText(fileData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: "1.5rem"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "900px",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "rgba(22, 31, 54, 0.4)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
            <FaFileCode style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: "0.95rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {path}
            </span>
            {fileData && (
              <span className="badge" style={{ fontSize: "0.75rem" }}>
                {(fileData.size / 1024).toFixed(1)} KB
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {fileData && (
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
              >
                {copied ? <><FaCheck style={{ color: "#10b981" }} /> Copied</> : <><FaCopy /> Copy</>}
              </button>
            )}
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: "0.35rem 0.6rem", fontSize: "0.9rem" }}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.25rem", overflowY: "auto", flex: 1 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              Loading file content from GitHub...
            </div>
          )}

          {error && (
            <div style={{
              padding: "1rem",
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              borderRadius: "var(--radius-sm)",
              color: "#fda4af"
            }}>
              {error}
            </div>
          )}

          {!loading && !error && fileData && (
            <pre style={{
              margin: 0,
              fontSize: "0.85rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all"
            }}>
              <code>{fileData.content}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeViewerModal;
