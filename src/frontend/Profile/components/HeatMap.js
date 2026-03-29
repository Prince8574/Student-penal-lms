import { useState, useEffect, useRef } from "react";

const T = {
  text: "#f0f6ff",
  text2: "#8899b8", 
  text3: "#3d4f6e",
  gold: "#f0a500",
};

export default function HeatMap() {
  const [cells] = useState(() => Array.from({ length: 12 * 7 }, () => { 
    const r = Math.random(); 
    return r < .26 ? 0 : r < .48 ? 1 : r < .70 ? 2 : r < .87 ? 3 : 4; 
  }));
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setVisible(true); 
        obs.disconnect(); 
      } 
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const bg = ['rgba(255,255,255,.04)', 'rgba(240,165,0,.16)', 'rgba(240,165,0,.4)', 'rgba(240,165,0,.65)', 'rgba(240,165,0,.92)'];
  const shadow = ['none','none','none','none','0 0 8px rgba(240,165,0,.45)'];

  return (
    <div ref={ref}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 3, marginTop: 12 }}>
        {Array.from({ length: 12 }, (_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Array.from({ length: 7 }, (_, d) => {
              const idx = w * 7 + d, lv = cells[idx];
              const delay = (w + d) * 0.022;
              return (
                <div key={d} className="hday"
                  style={{ 
                    width: '100%', 
                    aspectRatio: '1', 
                    borderRadius: 3, 
                    background: bg[lv], 
                    boxShadow: shadow[lv], 
                    cursor: "pointer", 
                    opacity: visible ? 1 : 0, 
                    transform: visible ? 'scale(1)' : 'scale(0)', 
                    transition: `opacity .38s ${delay}s, transform .38s ${delay}s cubic-bezier(.34,1.56,.64,1)`, 
                    position: 'relative' 
                  }} />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, fontSize: '.62rem', color: T.text3, letterSpacing: '.04em' }}>
        {['Oct','Nov','Dec','Jan','Feb','Mar'].map(m => <span key={m}>{m}</span>)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, justifyContent: 'flex-end', fontSize: '.67rem', color: T.text3 }}>
        <span>Less</span>
        {bg.map((b, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: b }} />)}
        <span>More</span>
      </div>

      <div style={{ marginTop: 14, padding: '13px 16px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(240,165,0,.07),rgba(255,122,48,.04))', border: '1px solid rgba(240,165,0,.14)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 24, animation: 'flicker 1.6s ease-in-out infinite' }}>🔥</div>
        <div>
          <div style={{ fontSize: '.82rem', color: T.text2 }}>
            <strong style={{ color: T.text, fontSize: '.9rem' }}>14-day streak</strong> — Keep going! Your best was 21 days.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
            {['🔥 14 days', '📚 347h total', '⚡ 8,450 XP'].map(b => (
              <span key={b} style={{ padding: '2px 9px', borderRadius: 6, fontSize: '.68rem', fontWeight: 700, background: 'rgba(240,165,0,.1)', color: T.gold, border: '1px solid rgba(240,165,0,.2)' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
