import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function GradeCard({ g, idx }) {
  const cardRef = useRef(null);
  const barRef  = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const bar  = barRef.current;
    if (!card || !bar) return;

    gsap.fromTo(card, { opacity: 0, y: 22 }, {
      opacity: 1, y: 0, duration: 0.55, delay: idx * 0.07, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 90%" },
    });

    ScrollTrigger.create({
      trigger: card, start: "top 85%",
      onEnter: () => gsap.to(bar, { width: g.score + "%", duration: 1.4, ease: "power3.out", delay: 0.15 }),
    });
  }, [g.score, idx]);

  return (
    <div ref={cardRef} className={`grade-card ${g.bgClass}`} style={{ opacity: 0 }}>
      <div className="gc-top">
        <div className="gc-icon">{g.emoji}</div>
        <div className="gc-badge" style={{ color: g.color }}>{g.grade}</div>
      </div>
      <div className="gc-title">{g.title}</div>
      <div className="gc-sub">Instructor: {g.instructor} · {g.tag}</div>
      <div className="gc-progress-label">
        <span>Score</span>
        <span style={{ color: g.color, fontWeight: 700 }}>{g.score}%</span>
      </div>
      <div className="gc-progress-bar">
        <div ref={barRef} className="gc-progress-fill"
          style={{ width: "0%", background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }} />
      </div>
      <div className="gc-meta">
        <span>✅ Completed</span>
        <span>📅 {g.completed}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: 3 }}>
          <span className="gc-score-big" style={{ color: g.color }}>{g.score}</span>
          <span className="gc-score-max">/{g.total}</span>
        </div>
      </div>
    </div>
  );
}
