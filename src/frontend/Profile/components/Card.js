import React from "react";

const T = {
  card: "rgba(11,20,42,0.88)",
  bord: "rgba(255,255,255,0.06)",
};

export default function Card({ children, style = {}, anim = "fadeUp", delay = 0 }) {
  return (
    <div className="card-glow"
      style={{ 
        background: T.card, 
        border: `1px solid ${T.bord}`, 
        borderRadius: 20, 
        padding: 18, 
        position: 'relative', 
        overflow: 'hidden', 
        backdropFilter: 'blur(20px)', 
        transition: 'border-color .3s', 
        ...style 
      }}
      onMouseMove={e => { 
        const r = e.currentTarget.getBoundingClientRect(); 
        e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); 
        e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); 
      }}
    >
      {children}
    </div>
  );
}