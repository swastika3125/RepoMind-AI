import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  FaStar, 
  FaCodeBranch, 
  FaExclamationCircle, 
  FaCode, 
  FaSitemap, 
  FaBrain, 
  FaComments, 
  FaProjectDiagram, 
  FaFileAlt, 
  FaBook, 
  FaExternalLinkAlt, 
  FaRedo
} from "react-icons/fa";
import { 
  analyzeRepository, 
  sendChatMessage, 
  generateReadme, 
  generateDocumentation 
} from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import StatCard from "../components/StatCard";
import TreeViewer from "../components/TreeViewer";
import CodeViewerModal from "../components/CodeViewerModal";
import OverviewTab from "../components/dashboard/OverviewTab";
import CodeAnalysisTab from "../components/dashboard/CodeAnalysisTab";
import ArchitectureTab from "../components/dashboard/ArchitectureTab";
import ChatTab from "../components/dashboard/ChatTab";
import ReadmeTab from "../components/dashboard/ReadmeTab";
import DocumentationTab from "../components/dashboard/DocumentationTab";

const TABS = [
  { id: "overview", label: "Overview", icon: FaBrain },
  { id: "tree", label: "File Structure", icon: FaSitemap },
  { id: "insights", label: "Code Analysis", icon: FaCode },
  { id: "architecture", label: "Architecture", icon: FaProjectDiagram },
  { id: "chat", label: "AI Chat", icon: FaComments },
  { id: "readme", label: "README Generator", icon: FaFileAlt },
  { id: "docs", label: "Documentation", icon: FaBook },
];

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get("url") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [analysisData, setAnalysisData] = useState(null);
  const [selectedFileForModal, setSelectedFileForModal] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI repository assistant. Ask me anything about the code, architecture, or configuration of this project."
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Readme & Docs state
  const [readmeContent, setReadmeContent] = useState("");
  const [readmeLoading, setReadmeLoading] = useState(false);

  const [docsContent, setDocsContent] = useState("");
  const [docsLoading, setDocsLoading] = useState(false);

  useEffect(() => {
    if (!repoUrl) return;

    let isMounted = true;
    const runAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzeRepository({ url: repoUrl });
        if (isMounted) {
          setAnalysisData(result);
          if (result.repository) {
            setChatMessages([
              {
                sender: "ai",
                text: `Welcome! I have indexed ${result.repository.full_name}. Ask me about its files, architecture, or functions.`
              }
            ]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to analyze repository.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [repoUrl]);

  const handleSendMessage = async (msgText) => {
    if (!msgText.trim() || chatLoading || !analysisData) return;

    const userMsg = { sender: "user", text: msgText };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const owner = analysisData.repository.owner.login;
      const repo = analysisData.repository.name;
      const res = await sendChatMessage({
        owner,
        repo,
        message: msgText,
        history: [...chatMessages, userMsg]
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.answer || "No response received.",
          sources: res.sources || []
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Error: ${err.message || "Failed to get AI response."}`,
          isError: true
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateReadme = async () => {
    if (!analysisData || readmeLoading) return;
    setReadmeLoading(true);
    try {
      const owner = analysisData.repository.owner.login;
      const repo = analysisData.repository.name;
      const res = await generateReadme({ owner, repo });
      setReadmeContent(res.readme);
    } catch (err) {
      alert(`Error generating README: ${err.message}`);
    } finally {
      setReadmeLoading(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!analysisData || docsLoading) return;
    setDocsLoading(true);
    try {
      const owner = analysisData.repository.owner.login;
      const repo = analysisData.repository.name;
      const res = await generateDocumentation({ owner, repo });
      setDocsContent(res.documentation);
    } catch (err) {
      alert(`Error generating documentation: ${err.message}`);
    } finally {
      setDocsLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen repoUrl={repoUrl} />;
  }

  if (error) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className="glass-panel" style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2.5rem",
          borderColor: "rgba(244, 63, 94, 0.4)"
        }}>
          <FaExclamationCircle style={{ color: "var(--accent-rose)", fontSize: "3rem", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Analysis Error
          </h2>
          <p style={{ color: "#fda4af", fontSize: "0.95rem", marginBottom: "1.75rem", lineHeight: 1.6 }}>
            {error}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              <FaRedo /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className="glass-panel" style={{ maxWidth: "500px", margin: "0 auto", padding: "2.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>No Repository Selected</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Please enter a repository URL on the home page to begin analysis.
          </p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  const { repository, stats, summary, code_insights, architecture, ai_errors } = analysisData;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {ai_errors && ai_errors.length > 0 && (
        <div style={{
          padding: "1rem 1.5rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(245, 158, 11, 0.12)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          color: "#fcd34d",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <FaExclamationCircle style={{ fontSize: "1.2rem", flexShrink: 0 }} />
          <div>
            <strong>AI Notice:</strong> {ai_errors[0]}
          </div>
        </div>
      )}

      {/* Repository Header Card */}
      <section className="glass-panel" style={{ padding: "2rem" }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem"
        }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                {repository.full_name}
              </h1>
              <span className="badge badge-emerald">Public</span>
              {repository.language && (
                <span className="badge badge-indigo">{repository.language}</span>
              )}
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "800px" }}>
              {repository.description}
            </p>
          </div>

          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
          >
            View on GitHub <FaExternalLinkAlt style={{ fontSize: "0.8rem" }} />
          </a>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginTop: "1.75rem"
        }}>
          <StatCard
            icon={FaStar}
            title="Stars"
            value={repository.stars.toLocaleString()}
            color="245, 158, 11"
          />
          <StatCard
            icon={FaCodeBranch}
            title="Forks"
            value={repository.forks.toLocaleString()}
            color="99, 102, 241"
          />
          <StatCard
            icon={FaExclamationCircle}
            title="Issues"
            value={repository.open_issues.toLocaleString()}
            color="244, 63, 94"
          />
          <StatCard
            icon={FaSitemap}
            title="Total Files"
            value={stats.total_files.toLocaleString()}
            color="6, 182, 212"
          />
          <StatCard
            icon={FaBrain}
            title="Analyzed Files"
            value={stats.analyzed_files}
            subtitle={`${stats.vector_chunks || 0} code vectors`}
            color="16, 185, 129"
          />
        </div>
      </section>

      {/* Tabs Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid var(--border-color)"
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.2rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: "var(--radius-md)",
                background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border: `1px solid ${isActive ? "rgba(99, 102, 241, 0.4)" : "transparent"}`,
                color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                cursor: "pointer",
                transition: "var(--transition)",
                whiteSpace: "nowrap"
              }}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && <OverviewTab summary={summary} />}
      
      {activeTab === "tree" && (
        <div className="glass-panel animate-fade-in" style={{ padding: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Repository File Hierarchy
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.3rem" }}>
              Explore the tree structure. Click any file to view its source code.
            </p>
          </div>
          <TreeViewer
            treeData={analysisData.tree}
            owner={repository.owner.login}
            repo={repository.name}
            onFileSelect={(path) => setSelectedFileForModal(path)}
          />
        </div>
      )}

      {activeTab === "insights" && <CodeAnalysisTab codeInsights={code_insights} />}

      {activeTab === "architecture" && <ArchitectureTab architecture={architecture} />}

      {activeTab === "chat" && (
        <ChatTab
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          chatLoading={chatLoading}
        />
      )}

      {activeTab === "readme" && (
        <ReadmeTab
          readmeContent={readmeContent}
          onGenerateReadme={handleGenerateReadme}
          loading={readmeLoading}
        />
      )}

      {activeTab === "docs" && (
        <DocumentationTab
          docContent={docsContent}
          onGenerateDocs={handleGenerateDocs}
          loading={docsLoading}
        />
      )}

      {selectedFileForModal && (
        <CodeViewerModal
          owner={repository.owner.login}
          repo={repository.name}
          path={selectedFileForModal}
          onClose={() => setSelectedFileForModal(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
