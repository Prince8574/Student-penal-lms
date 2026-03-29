import { useState, useEffect, useRef } from "react";

export default function ProgressBar({ pct, gradient, height = 5 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setTimeout(() => setW(pct), 200); 
        obs.disconnect(); 
      } 
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div ref={ref} style={{ height, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: '100%', width: `${w}%`, background: gradient, borderRadius: 99, transition: 'width 1.8s cubic-bezier(.4,0,.2,1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)', animation: 'shimmer 2.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}