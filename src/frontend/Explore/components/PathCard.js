import { useState, useEffect, useRef } from "react";
import { T } from "../utils/designTokens";

export default function PathCard({ p, idx, onOpen }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setVis(true), idx * 80);
        obs.disconnect();
      }
    }, { threshold: .08 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [idx]);

  return (
    <div
      ref={ref}
      className="path-card"
      onClick={() => onOpen(p)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .6s ${idx * .08}s,transform .6s ${idx * .08}s cubic-bezier(.4,0,.2,1)`,
        background: p.g
      }}
    >
      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 60% at 20% 30%,${p.color}22,transparent)`, pointerEvents: "none" }} />
      <div style={{ padding: "20px 20px 18px", position: "relative", zIndex: 1 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}18`, border: `1.5px solid ${p.color}35`, display: "grid", placeItems: "center", fontSize: "1.6rem" }}>
            {p.icon}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span style={{ padding: "3px 9px", borderRadius: 6, background: `${p.color}18`, color: p.color, fontSize: ".62rem", fontWeight: 800, border: `1px solid ${p.color}30`, textTransform: "uppercase", letterSpacing: ".06em" }}>
              {p.level}
            </span>
            <span style={{ fontSize: ".7rem", color: T.text3 }}>{p.courses} courses</span>
          </div>
        </div>
        {/* Title */}
        <div className="ff" style={{ fontSize: "1.08rem", fontWeight: 900, letterSpacing: "-.04em", marginBottom: 6, lineHeight: 1.25 }}>
          {p.title}
        </div>
        <div style={{ fontSize: ".78rem", color: T.text2, lineHeight: 1.55, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {p.desc}
        </div>
        {/* Steps preview */}
        <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
          {p.steps.slice(0, 4).map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${p.color}18`, border: `1px solid ${p.color}35`, display: "grid", placeItems: "center", fontSize: ".55rem", fontWeight: 900, color: p.color, flexShrink: 0 }}>
                {i + 1}
              </div>
              <span style={{ fontSize: ".68rem", color: T.text2, whiteSpace: "nowrap" }}>{s}</span>
              {i < Math.min(p.steps.length - 1, 3) && <span style={{ color: T.text3, fontSize: ".6rem" }}>›</span>}
            </div>
          ))}
          {p.steps.length > 4 && <span style={{ fontSize: ".68rem", color: T.text3 }}>+{p.steps.length - 4} more</span>}
        </div>
        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
          {p.tags.slice(0, 4).map(t => (
            <span key={t} style={{ padding: "2px 8px", borderRadius: 5, background: `${p.color}0f`, color: p.color, fontSize: ".66rem", fontWeight: 700, border: `1px solid ${p.color}28` }}>
              {t}
            </span>
          ))}
        </div>
        {/* Bottom row */}
        <div style={{ height: 1, background: "rgba(255,255,255,.07)", marginBottom: 13 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: ".8rem", fontWeight: 700, color: T.text }}>{(p.enrolled / 1000).toFixed(0)}k+ enrolled</div>
            <div style={{ fontSize: ".68rem", color: T.text3 }}>{p.duration} · Self-paced</div>
          </div>
          <button className="btn-gold" style={{ fontSize: ".76rem", padding: "8px 16px" }} onClick={e => e.stopPropagation()}>
            <span className="sh" />Start Path →
          </button>
        </div>
      </div>
    </div>
  );
}
