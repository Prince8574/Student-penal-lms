import { useState, useEffect, useRef } from "react";
import { T, G } from "../utils/designTokens";

// Stars component
export function Stars({ r, sz = ".72rem" }) {
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{
            fontSize: sz,
            color: i <= Math.floor(r)
              ? T.gold
              : i === Math.ceil(r) && r % 1 > .3
              ? T.gold + "88"
              : T.text3
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Progress bar component
export function Prog({ pct, g, h = 4 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setW(pct), 200);
        obs.disconnect();
      }
    }, { threshold: .3 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div ref={ref} className="prog-track" style={{ height: h }}>
      <div className="prog-fill" style={{ width: `${w}%`, height: "100%", background: g }} />
    </div>
  );
}

// Badge pill component
export function BadgePill({ text }) {
  const MAP = {
    Bestseller: { bg: "rgba(240,165,0,.15)", col: T.gold, b: "rgba(240,165,0,.3)" },
    "Top Rated": { bg: "rgba(0,212,170,.1)", col: T.teal, b: "rgba(0,212,170,.25)" },
    Hot: { bg: "rgba(239,68,68,.1)", col: T.red, b: "rgba(239,68,68,.25)" },
    New: { bg: "rgba(59,130,246,.12)", col: T.blue2, b: "rgba(59,130,246,.28)" },
    Trending: { bg: "rgba(167,139,250,.1)", col: T.purple, b: "rgba(167,139,250,.25)" },
    Popular: { bg: "rgba(244,114,182,.1)", col: T.pink, b: "rgba(244,114,182,.25)" },
    Completed: { bg: "rgba(74,222,128,.1)", col: T.green, b: "rgba(74,222,128,.25)" }
  };

  const s = MAP[text] || MAP.Bestseller;

  return (
    <span
      className="badge"
      style={{
        background: s.bg,
        color: s.col,
        border: `1px solid ${s.b}`
      }}
    >
      {text}
    </span>
  );
}

// Section label component
export function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: ".6rem",
        fontWeight: 800,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: T.text3,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
    >
      <div style={{ height: 1, width: 18, background: G.gold, borderRadius: 1 }} />
      {children}
      <div style={{ height: 1, flex: 1, background: T.bord, borderRadius: 1 }} />
    </div>
  );
}

// Animated number component
export function ANum({ target, suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600;
        const start = performance.now();

        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const v = target * ease;
          setVal(decimals ? +v.toFixed(decimals) : Math.round(v));
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      }
    }, { threshold: .3 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, decimals]);

  return (
    <span ref={ref}>
      {decimals ? val.toFixed(decimals) : val.toLocaleString()}{suffix}
    </span>
  );
}
