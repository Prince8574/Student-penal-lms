import { useEffect } from "react";

const T = {
  green: "#4ade80",
  red: "#ef4444",
  gold: "#f0a500",
};

export default function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [onDone]);

  const c = {
    success: { bg: "rgba(74,222,128,.12)", bord: "rgba(74,222,128,.28)", col: T.green, ico: "✅" },
    error: { bg: "rgba(239,68,68,.1)", bord: "rgba(239,68,68,.25)", col: T.red, ico: "❌" },
    info: { bg: "rgba(240,165,0,.1)", bord: "rgba(240,165,0,.25)", col: T.gold, ico: "💡" }
  }[type] || {};

  return (
    <div style={{
      position: "fixed",
      bottom: 30,
      right: 30,
      zIndex: 9000,
      padding: "14px 20px",
      borderRadius: 14,
      background: c.bg,
      border: `1px solid ${c.bord}`,
      backdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1) both",
      boxShadow: "0 20px 50px rgba(0,0,0,.5)",
      minWidth: 260
    }}>
      <span style={{ fontSize: "1.1rem" }}>{c.ico}</span>
      <span style={{ fontSize: ".875rem", fontWeight: 600, color: c.col }}>{msg}</span>
    </div>
  );
}