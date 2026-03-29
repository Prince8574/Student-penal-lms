import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../utils/designTokens";
import { Stars, BadgePill } from "./UIElements";

export default function CourseCard({ c, idx, onOpen, enrolled }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setVis(true), idx * 55);
        obs.disconnect();
      }
    }, { threshold: .07 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [idx]);

  const disc = c.original > c.price ? Math.round((1 - c.price / c.original) * 100) : 0;

  const onMM = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    ref.current.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  };

  return (
    <div
      ref={ref}
      className="course-card"
      onClick={() => onOpen(c)}
      onMouseMove={onMM}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(22px)",
        transition: `opacity .55s ${idx * .06}s,transform .55s ${idx * .06}s cubic-bezier(.4,0,.2,1)`
      }}
    >
      {/* Thumb */}
      <div style={{ height: 155, background: c.g, position: "relative", overflow: "hidden" }}>
        {c.thumbnail ? (
          <img src={c.thumbnail} alt={c.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}/>
        ) : (
          <>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 80% at 30% 40%,${c.accent}28,transparent)` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "3.2rem", opacity: .16, filter: "blur(1px)", animation: "float 4s ease-in-out infinite" }}>{c.icon}</span>
            </div>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-55%)", width:58, height:58, borderRadius:15, background:`linear-gradient(135deg,${c.accent}1a,${c.accent}36)`, border:`1.5px solid ${c.accent}44`, display:"grid", placeItems:"center", backdropFilter:"blur(8px)", zIndex:2 }}>
              <span style={{ fontSize: "1.7rem" }}>{c.icon}</span>
            </div>
          </>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 35%,rgba(0,0,0,.7))", zIndex:1 }} />
        <div style={{ position: "absolute", top: 11, left: 11, zIndex: 3, display: "flex", gap: 6 }}>
          <BadgePill text={c.badge} />
        </div>
        <div style={{
          position: "absolute",
          top: 11,
          right: 11,
          zIndex: 3,
          padding: "3px 8px",
          borderRadius: 6,
          background: "rgba(0,0,0,.55)",
          backdropFilter: "blur(6px)",
          fontSize: ".63rem",
          fontWeight: 700,
          color: T.text2,
          border: "1px solid rgba(255,255,255,.08)"
        }}>
          {c.level}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "15px 16px 17px", display: "flex", flexDirection: "column", gap: 9, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: ".62rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: c.accent }}>{c.cat}</span>
          <span style={{ fontSize: ".68rem", color: T.text3 }}>{c.duration}</span>
        </div>
        <div className="ff" style={{
          fontSize: ".93rem",
          fontWeight: 800,
          letterSpacing: "-.03em",
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {c.title}
        </div>
        <div style={{ fontSize: ".76rem", color: T.text2 }}>{c.instructor}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: ".8rem", fontWeight: 800, color: T.gold }}>{c.rating}</span>
          <Stars r={c.rating} />
          <span style={{ fontSize: ".7rem", color: T.text3 }}>({c.reviews.toLocaleString()})</span>
          <span style={{ marginLeft: "auto", fontSize: ".68rem", color: T.text3 }}>{(c.students / 1000).toFixed(0)}k</span>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {c.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div style={{ height: 1, background: T.bord, margin: "2px 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span className="ff" style={{ fontSize: "1.1rem", fontWeight: 900, color: T.gold }}>₹{c.price.toLocaleString()}</span>
            <span style={{ fontSize: ".72rem", color: T.text3, textDecoration: "line-through" }}>₹{c.original.toLocaleString()}</span>
            <span style={{ fontSize: ".65rem", fontWeight: 800, color: T.green, background: "rgba(74,222,128,.1)", padding: "1px 6px", borderRadius: 4 }}>{disc}%</span>
          </div>
          <button className="btn-teal" style={{ fontSize: ".74rem", padding: "7px 14px" }} onClick={e => { e.stopPropagation(); if(enrolled) navigate(`/learn/${c.id}`); else navigate(`/enroll/${c.id}`); }}>
            {enrolled ? "▶ Continue" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
