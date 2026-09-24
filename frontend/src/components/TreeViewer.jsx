import React, { useState } from "react";
import { 
  FaFolder, 
  FaFolderOpen, 
  FaFileCode, 
  FaFileAlt, 
  FaChevronRight, 
  FaChevronDown,
  FaSearch
} from "react-icons/fa";

const TreeNode = ({ node, owner, repo, onFileSelect, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";

  // Auto-expand if search term is active and matches
  const hasMatch = searchTerm && (
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (node.children && JSON.stringify(node.children).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const shouldBeOpen = searchTerm ? hasMatch : isOpen;

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (["js", "jsx", "ts", "tsx", "py", "java", "c", "cpp", "go", "rs", "php"].includes(ext)) {
      return <FaFileCode style={{ color: "var(--accent-cyan)" }} />;
    }
    return <FaFileAlt style={{ color: "var(--text-muted)" }} />;
  };

  if (isFolder) {
    return (
      <div style={{ marginLeft: "1rem" }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.6rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.88rem",
            color: "var(--text-main)",
            transition: "var(--transition)",
            userSelect: "none"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {shouldBeOpen ? (
            <FaChevronDown style={{ fontSize: "0.75rem", color: "var(--text-dim)" }} />
          ) : (
            <FaChevronRight style={{ fontSize: "0.75rem", color: "var(--text-dim)" }} />
          )}
          {shouldBeOpen ? (
            <FaFolderOpen style={{ color: "var(--accent-amber)" }} />
          ) : (
            <FaFolder style={{ color: "var(--accent-amber)" }} />
          )}
          <span style={{ fontWeight: 500 }}>{node.name}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
            ({node.children ? node.children.length : 0})
          </span>
        </div>

        {shouldBeOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path || child.name}
                node={child}
                owner={owner}
                repo={repo}
                onFileSelect={onFileSelect}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // File node
  const matchesSearch = !searchTerm || node.name.toLowerCase().includes(searchTerm.toLowerCase());
  if (searchTerm && !matchesSearch) return null;

  return (
    <div
      onClick={() => onFileSelect && onFileSelect(node.path)}
      style={{
        marginLeft: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.35rem 0.6rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
        color: "var(--text-muted)",
        transition: "var(--transition)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
        e.currentTarget.style.color = "var(--text-main)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {getFileIcon(node.name)}
        <span>{node.name}</span>
      </div>
      {node.size > 0 && (
        <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
          {(node.size / 1024).toFixed(1)} KB
        </span>
      )}
    </div>
  );
};

const TreeViewer = ({ treeData, owner, repo, onFileSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!treeData || !Array.isArray(treeData) || treeData.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
        No repository structure found or tree is empty.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Search Input */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center"
      }}>
        <FaSearch style={{
          position: "absolute",
          left: "1rem",
          color: "var(--text-dim)",
          fontSize: "0.85rem"
        }} />
        <input
          type="text"
          placeholder="Filter files by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 1rem 0.6rem 2.4rem",
            background: "rgba(15, 21, 35, 0.8)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-main)",
            fontSize: "0.85rem",
            outline: "none"
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              position: "absolute",
              right: "0.75rem",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.8rem"
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{
        backgroundColor: "rgba(10, 13, 20, 0.6)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "1rem 0.5rem",
        maxHeight: "550px",
        overflowY: "auto"
      }}>
        {treeData.map((node) => (
          <TreeNode
            key={node.path || node.name}
            node={node}
            owner={owner}
            repo={repo}
            onFileSelect={onFileSelect}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeViewer;
