const T = {
  gold: "#f0a500",
  bord: "rgba(255,255,255,0.06)",
  text3: "#3d4f6e",
};

const G = {
  gold: "linear-gradient(135deg,#f0a500,#ff7a30)",
};

export default function ProgressSteps({ steps, cur }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 28,
      animation: "fadeUp .6s .18s both"
    }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          flex: i < steps.length - 1 ? 1 : "none"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            flexShrink: 0
          }}>
            <div className="step-dot" style={{
              borderColor: i <= cur ? T.gold : T.bord,
              background: i < cur ? G.gold : i === cur ? "rgba(240,165,0,.12)" : "transparent",
              boxShadow: i < cur ? `0 0 14px rgba(240,165,0,.3)` : "none",
              animation: i === cur ? "pulse 2.2s infinite" : "none"
            }}>
              {i < cur ? (
                <span style={{
                  animation: "checkBounce .4s cubic-bezier(.34,1.56,.64,1) both",
                  fontSize: ".85rem"
                }}>✓</span>
              ) : (
                <span style={{
                  color: i === cur ? T.gold : T.text3,
                  fontSize: ".68rem",
                  fontWeight: 800
                }}>{i + 1}</span>
              )}
            </div>
            <div style={{
              fontSize: ".6rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              color: i <= cur ? T.gold : T.text3,
              whiteSpace: "nowrap"
            }}>{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="step-line" style={{
              background: i < cur ? G.gold : "rgba(255,255,255,.06)"
            }} />
          )}
        </div>
      ))}
    </div>
  );
}