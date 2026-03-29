import { useEffect } from "react";
import { T } from "../utils/designTokens";

export default function PathModal({ p, onClose }) {
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div style={{ height: 170, background: p.g, position: "relative", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 80% at 25% 50%,${p.color}22,transparent)` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 20%,rgba(0,0,0,.75))" }} />
          <div style={{ position: "absolute", bottom: 18, left: 22, zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: "1.8rem" }}>{p.icon}</span>
              <span style={{ padding: "3px 9px", borderRadius: 6, background: `${p.color}20`, color: p.color, fontSize: ".62rem", fontWeight: 800, border: `1px solid ${p.color}35`, textTransform: "uppercase", letterSpacing: ".06em" }}>
                {p.level}
              </span>
            </div>
            <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em", color: T.text }}>
              {p.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 3,
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,.18)",
              background: "rgba(0,0,0,.55)",
              color: T.text,
              cursor: "pointer",
              fontSize: ".95rem",
              display: "grid",
              placeItems: "center",
              transition: "all .2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,.55)"}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: T.bord, borderRadius: 12, overflow: "hidden" }}>
            {[
              { l: "Duration", v: p.duration },
              { l: "Courses", v: p.courses },
              { l: "Enrolled", v: `${(p.enrolled / 1000).toFixed(0)}k` }
            ].map(({ l, v }) => (
              <div key={l} style={{ padding: "11px", background: T.card, textAlign: "center" }}>
                <div className="ff" style={{ fontSize: "1.1rem", fontWeight: 900, color: p.color }}>{v}</div>
                <div style={{ fontSize: ".6rem", textTransform: "uppercase", letterSpacing: ".08em", color: T.text3, marginTop: 3, fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* About */}
          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3, marginBottom: 8 }}>About This Path</div>
            <div style={{ fontSize: ".85rem", color: T.text2, lineHeight: 1.7 }}>{p.desc}</div>
          </div>

          {/* Roadmap */}
          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3, marginBottom: 12 }}>Learning Roadmap</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 11, background: "rgba(255,255,255,.025)", border: `1px solid ${T.bord}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${p.color}18`, border: `1.5px solid ${p.color}40`, display: "grid", placeItems: "center", fontSize: ".7rem", fontWeight: 900, color: p.color, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: ".84rem", fontWeight: 600 }}>{step}</span>
                  {i < p.steps.length - 1 && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: `${p.color}55` }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3, marginBottom: 9 }}>Skills Covered</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.tags.map(t => (
                <span key={t} style={{ padding: "4px 11px", borderRadius: 99, background: `${p.color}0f`, color: p.color, fontSize: ".74rem", fontWeight: 700, border: `1px solid ${p.color}28` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-gold" style={{ flex: 1, padding: "12px", fontSize: ".88rem", justifyContent: "center" }}>
              <span className="sh" />🚀 Start Learning Path
            </button>
            <button className="btn-outline" style={{ padding: "12px 20px" }}>Preview</button>
          </div>
        </div>
      </div>
    </div>
  );
}

