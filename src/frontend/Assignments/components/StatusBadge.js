import { T } from "../utils/constants";

/* ══════════════════════════════STATUS BADGE══════════════════════════════ */
export default function StatusBadge({ status }) {
  const m = {
    pending: {
      bg: "rgba(59,130,246,.12)",
      col: T.blue2,
      bord: "rgba(59,130,246,.28)",
      ico: "📋",
      lbl: "Pending",
    },
    submitted: {
      bg: "rgba(0,212,170,.1)",
      col: T.teal,
      bord: "rgba(0,212,170,.28)",
      ico: "✅",
      lbl: "Submitted",
    },
    graded: {
      bg: "rgba(74,222,128,.1)",
      col: T.green,
      bord: "rgba(74,222,128,.28)",
      ico: "🏅",
      lbl: "Graded",
    },
    overdue: {
      bg: "rgba(239,68,68,.1)",
      col: T.red,
      bord: "rgba(239,68,68,.28)",
      ico: "⚠",
      lbl: "Overdue",
    },
  }[status] || {};
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 8,
        background: m.bg,
        color: m.col,
        border: `1px solid ${m.bord}`,
        fontSize: ".7rem",
        fontWeight: 800,
        letterSpacing: ".04em",
        textTransform: "uppercase",
      }}
    >
      <span>{m.ico}</span>
      {m.lbl}
    </span>
  );
}
