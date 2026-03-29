import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════
PROGRESS BAR COMPONENT
══════════════════════════════════════ */
export default function ProgressBar({pct, gradient, h=4}) {
  const [w, setW] = useState(0); 
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting) {
        setTimeout(() => setW(pct), 150);
        obs.disconnect();
      }
    }, {threshold:.3});
    
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div 
      ref={ref} 
      className="prog-track" 
      style={{
        height: h,
        background: "rgba(255,255,255,.06)",
        borderRadius: "99px",
        overflow: "hidden"
      }}
    >
      <div 
        className="prog-fill" 
        style={{
          width: `${w}%`,
          height: "100%",
          borderRadius: "99px",
          position: "relative",
          overflow: "hidden",
          transition: "width 1.4s cubic-bezier(.4,0,.2,1)",
          background: gradient,
          boxShadow: `0 0 8px ${gradient.includes("f0a500") ? "rgba(240,165,0,.4)" : "rgba(0,212,170,.3)"}`
        }}
      >
        <div style={{
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)",
          animation: "shimmer 2.4s ease-in-out infinite"
        }} />
      </div>
    </div>
  );
}