import { T } from '../utils/designTokens';

/* ══════════════════════════════════════
BADGE CHIP COMPONENT
══════════════════════════════════════ */
export default function BadgeChip({text}) {
  const map = {
    Bestseller: {bg:"rgba(240,165,0,.15)", col:T.gold, bord:"rgba(240,165,0,.3)"},
    "Top Rated": {bg:"rgba(0,212,170,.1)", col:T.teal, bord:"rgba(0,212,170,.25)"},
    New: {bg:"rgba(59,130,246,.12)", col:T.blue2, bord:"rgba(59,130,246,.28)"},
    Hot: {bg:"rgba(239,68,68,.1)", col:T.red, bord:"rgba(239,68,68,.25)"},
    Trending: {bg:"rgba(167,139,250,.1)", col:T.purple, bord:"rgba(167,139,250,.25)"},
    Popular: {bg:"rgba(244,114,182,.1)", col:T.pink, bord:"rgba(244,114,182,.25)"},
    Completed: {bg:"rgba(74,222,128,.1)", col:T.green, bord:"rgba(74,222,128,.25)"}
  };
  
  const s = map[text] || map.Bestseller;
  
  return (
    <span 
      className="badge" 
      style={{
        padding: "3px 9px",
        borderRadius: "6px",
        fontSize: ".62rem",
        fontWeight: 800,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        background: s.bg,
        color: s.col,
        border: `1px solid ${s.bord}`
      }}
    >
      {text}
    </span>
  );
}