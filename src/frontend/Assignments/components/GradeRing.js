import { T } from "../utils/constants";

/* ══════════════════════════════GRADE RING══════════════════════════════ */
export default function GradeRing({ grade, max, size = 64 }) {
  const pct = (grade / max) * 100;
  const r = size / 2 - 5,
    circ = 2 * Math.PI * r;
  const col =
    pct >= 90 ? T.green : pct >= 75 ? T.teal : pct >= 60 ? T.gold : T.red;
  const letter =
    pct >= 90
      ? "A+"
      : pct >= 85
      ? "A"
      : pct >= 80
      ? "A-"
      : pct >= 75
      ? "B+"
      : pct >= 70
      ? "B"
      : pct >= 65
      ? "B-"
      : pct >= 60
      ? "C"
      : "D";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,.06)"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (pct / 100) * circ}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 1.4s ease",
            filter: `drop-shadow(0 0 5px ${col})`,
          }}
        />
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          fill={col}
          fontFamily="Fraunces,serif"
          fontSize={size === 64 ? 13 : 10}
          fontWeight={900}
        >
          {letter}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          fill={T.text3}
          fontFamily="Satoshi,sans-serif"
          fontSize={size === 64 ? 8 : 7}
        >
          {grade}/{max}
        </text>
      </svg>
    </div>
  );
}
