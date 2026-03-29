const T = {
  red: "#ef4444",
  orange: "#ff7a30", 
  gold: "#f0a500",
  green: "#4ade80",
  card: "rgba(11,20,42,0.9)",
  bord: "rgba(255,255,255,0.06)",
  text: "#f0f6ff",
  text2: "#8899b8",
};

export default function CompletionRing({ pct }) {
  const col = pct < 40 ? T.red : pct < 70 ? T.orange : pct < 90 ? T.gold : T.green;
  
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.bord}`,
      borderRadius: 14,
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      animation: "fadeUp .6s .12s both"
    }}>
      <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
        <svg width={52} height={52} viewBox="0 0 52 52">
          <circle cx={26} cy={26} r={22} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={4} />
          <circle cx={26} cy={26} r={22} fill="none" stroke={col} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={138.2} strokeDashoffset={138.2 - (pct / 100) * 138.2}
            transform="rotate(-90 26 26)" style={{
              transition: "stroke-dashoffset 1.2s ease",
              filter: `drop-shadow(0 0 5px ${col})`
            }} />
          <text x={26} y={30} textAnchor="middle" fill={col} fontFamily="Fraunces,serif" fontSize={11} fontWeight={900}>
            {pct}%
          </text>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: ".85rem", fontWeight: 700, marginBottom: 3 }}>Profile Completion</div>
        <div style={{ fontSize: ".73rem", color: T.text2, marginBottom: 8 }}>
          {pct < 100 ? `${100 - pct}% more to unlock premium features` : "🎉 Your profile is fully complete!"}
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,.05)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: col,
            borderRadius: 99,
            transition: "width 1.3s ease",
            boxShadow: `0 0 8px ${col}55`,
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",
              animation: "shimmer 2.4s ease-in-out infinite"
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}