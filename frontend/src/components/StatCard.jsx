import React from "react";

const StatCard = ({ icon: Icon, title, value, color, subtitle }) => {
  return (
    <div className="glass-card" style={{
      display: "flex",
      alignItems: "center",
      gap: "1.25rem",
      padding: "1.25rem 1.5rem"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: `rgba(${color || "99, 102, 241"}, 0.15)`,
        border: `1px solid rgba(${color || "99, 102, 241"}, 0.3)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: `rgb(${color || "99, 102, 241"})`,
        fontSize: "1.3rem"
      }}>
        <Icon />
      </div>
      <div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {title}
        </div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
