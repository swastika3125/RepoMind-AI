import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle, FaBrain } from "react-icons/fa";

const LOADING_STEPS = [
  "Connecting to GitHub...",
  "Fetching repository...",
  "Reading repository structure...",
  "Filtering files...",
  "Processing source code...",
  "Building repository context...",
  "Generating embeddings...",
  "Analyzing repository with AI...",
  "Preparing dashboard..."
];

const LoadingScreen = ({ repoUrl }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / LOADING_STEPS.length) * 100));

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      padding: "2rem"
    }}>
      <div className="glass-panel" style={{
        maxWidth: "600px",
        width: "100%",
        padding: "2.5rem",
        textAlign: "center"
      }}>
        {/* Pulsing Icon */}
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "20px",
          margin: "0 auto 1.5rem",
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          color: "white",
          boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
          animation: "pulseGlow 2s infinite ease-in-out"
        }}>
          <FaBrain />
        </div>

        <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Analyzing Repository
        </h3>
        <p style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", marginBottom: "2rem", wordBreak: "break-all" }}>
          {repoUrl || "Target Repository"}
        </p>

        {/* Progress Bar */}
        <div style={{
          width: "100%",
          height: "8px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "9999px",
          overflow: "hidden",
          marginBottom: "2rem"
        }}>
          <div style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #6366f1, #06b6d4)",
            transition: "width 0.5s ease-out"
          }} />
        </div>

        {/* Step list */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          textAlign: "left"
        }}>
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                  color: isCompleted ? "var(--text-muted)" : isCurrent ? "var(--text-main)" : "var(--text-dim)",
                  transition: "var(--transition)"
                }}
              >
                {isCompleted ? (
                  <FaCheckCircle style={{ color: "var(--accent-emerald)", fontSize: "1rem" }} />
                ) : isCurrent ? (
                  <FaSpinner className="animate-spin" style={{ color: "var(--accent-cyan)", fontSize: "1rem" }} />
                ) : (
                  <span style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1px solid var(--border-color)",
                    display: "inline-block"
                  }} />
                )}
                <span style={{ fontWeight: isCurrent ? 600 : 400 }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
