import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaGithub, 
  FaBrain, 
  FaComments, 
  FaProjectDiagram, 
  FaFileAlt, 
  FaBook, 
  FaLightbulb,
  FaArrowRight,
  FaSearch
} from "react-icons/fa";

const SAMPLE_REPOS = [
  "facebook/react",
  "pallets/flask",
  "fastapi/fastapi",
  "expressjs/express"
];

const FEATURES = [
  {
    icon: FaBrain,
    color: "99, 102, 241",
    title: "AI Code Analysis",
    description: "Deep codebase inspection of architecture, separation of concerns, code reusability, and error handling patterns."
  },
  {
    icon: FaComments,
    color: "6, 182, 212",
    title: "Repository Chat",
    description: "Ask questions grounded in actual repository files using our ChromaDB vector database and RAG engine."
  },
  {
    icon: FaProjectDiagram,
    color: "168, 85, 247",
    title: "Architecture Analysis",
    description: "Understand frontend, backend, APIs, authentication, and data flows with structured breakdowns."
  },
  {
    icon: FaFileAlt,
    color: "16, 185, 129",
    title: "README Generator",
    description: "Generate professional, production-grade GitHub README markdown with tech stacks, badges, and install guides."
  },
  {
    icon: FaBook,
    color: "245, 158, 11",
    title: "Documentation Generator",
    description: "Produce comprehensive technical system documentation covering end-to-end execution flow and APIs."
  },
  {
    icon: FaLightbulb,
    color: "244, 63, 94",
    title: "Improvement Suggestions",
    description: "Evidence-based recommendations for testing, security, API validation, and refactoring."
  }
];

const Home = () => {
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError("Please enter a GitHub repository URL or owner/repo.");
      return;
    }
    setError("");
    navigate(`/dashboard?url=${encodeURIComponent(urlInput.trim())}`);
  };

  const handleSelectSample = (sample) => {
    setUrlInput(`https://github.com/${sample}`);
    setError("");
    navigate(`/dashboard?url=${encodeURIComponent(`https://github.com/${sample}`)}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem", paddingBottom: "2rem" }}>
      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        padding: "4rem 1rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div className="badge badge-indigo" style={{ marginBottom: "1.25rem", padding: "0.4rem 1rem" }}>
          <FaBrain /> AI-Powered GitHub Intelligence
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontWeight: 800,
          letterSpacing: "-1.5px",
          lineHeight: 1.15,
          maxWidth: "850px",
          marginBottom: "1.5rem"
        }}>
          Understand Any GitHub Repository with{" "}
          <span style={{
            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            AI
          </span>
        </h1>

        <p style={{
          fontSize: "1.2rem",
          color: "var(--text-muted)",
          maxWidth: "640px",
          marginBottom: "2.5rem",
          lineHeight: 1.6
        }}>
          Analyze code. Understand architecture. Chat with your repository.
        </p>

        {/* Input Bar */}
        <form
          onSubmit={handleAnalyze}
          className="glass-panel"
          style={{
            maxWidth: "700px",
            width: "100%",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            borderRadius: "var(--radius-xl)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.12)"
          }}
        >
          <div style={{ paddingLeft: "1rem", color: "var(--text-dim)", display: "flex", alignItems: "center" }}>
            <FaGithub style={{ fontSize: "1.3rem" }} />
          </div>
          <input
            type="text"
            placeholder="Enter GitHub Repository URL (e.g., https://github.com/facebook/react)"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              if (error) setError("");
            }}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              fontSize: "1rem",
              padding: "0.8rem 0.5rem",
              outline: "none"
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-lg)", padding: "0.8rem 1.75rem", whiteSpace: "nowrap" }}
          >
            Analyze Repository <FaArrowRight />
          </button>
        </form>

        {error && (
          <p style={{ color: "#fda4af", fontSize: "0.88rem", marginTop: "0.75rem" }}>
            {error}
          </p>
        )}

        {/* Quick Sample Badges */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
          marginTop: "1.5rem"
        }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Try an example:</span>
          {SAMPLE_REPOS.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSelectSample(sample)}
              className="badge"
              style={{
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-color)",
                transition: "var(--transition)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-primary)";
                e.currentTarget.style.color = "var(--text-main)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {sample}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
            Comprehensive Intelligence Suite
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Everything you need to deeply comprehend and document any codebase in seconds.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem"
        }}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `rgba(${feature.color}, 0.15)`,
                  border: `1px solid rgba(${feature.color}, 0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: `rgb(${feature.color})`,
                  fontSize: "1.2rem"
                }}>
                  <Icon />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Flow Banner */}
      <section className="glass-panel" style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
          How RepoMind AI Works
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "700px", margin: "0 auto 2rem" }}>
          Automated multi-stage processing pipeline from raw GitHub API trees to vectorized semantic search and AI generation.
        </p>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem"
        }}>
          {["GitHub URL", "Tree Extraction", "File Filtering", "RAG / Embeddings", "ChromaDB Storage", "LLM Processing", "Interactive Dashboard"].map((step, idx, arr) => (
            <React.Fragment key={step}>
              <div style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                color: "#c7d2fe",
                fontSize: "0.85rem",
                fontWeight: 600
              }}>
                {step}
              </div>
              {idx < arr.length - 1 && (
                <FaArrowRight style={{ color: "var(--text-dim)", fontSize: "0.75rem" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
