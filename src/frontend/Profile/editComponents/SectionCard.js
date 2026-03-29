const G = {
  gold: "linear-gradient(135deg,#f0a500,#ff7a30)",
};

const T = {
  text3: "#3d4f6e",
};

export default function SectionCard({ title, icon, sub, children, delay = 0 }) {
  return (
    <div className="s-card" style={{ animation: `fadeUp .6s ${delay}s both` }}>
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 22
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: G.gold,
          display: "grid",
          placeItems: "center",
          fontSize: "1rem",
          flexShrink: 0,
          boxShadow: "0 4px 14px rgba(240,165,0,.3)"
        }}>{icon}</div>
        <div>
          <div style={{
            fontFamily: "Fraunces,serif",
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: "-.04em"
          }}>{title}</div>
          {sub && (
            <div style={{
              fontSize: ".73rem",
              color: T.text3,
              marginTop: 2
            }}>{sub}</div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}