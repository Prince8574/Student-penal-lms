import { useState, useEffect, useRef } from "react";
import Card from './Card';

const T = {
  gold: "#f0a500",
  teal: "#00d4aa",
  text2: "#8899b8",
  text3: "#3d4f6e",
  bord: "rgba(255,255,255,0.06)",
};

const G = {
  gold: "linear-gradient(135deg,#f0a500,#ff7a30)",
};

export default function PomodoroTimer() {
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions] = useState([true, true, false, false]);
  const intRef = useRef(null);

  const total = isBreak ? 5 * 60 : 25 * 60;
  const pct = ((total - secs) / total) * 100;
  const radius = 52, circ = 2 * Math.PI * radius;

  const toggle = () => {
    if (running) { 
      clearInterval(intRef.current); 
      setRunning(false); 
    } else {
      setRunning(true);
      intRef.current = setInterval(() => setSecs(s => { 
        if (s <= 1) { 
          clearInterval(intRef.current); 
          setRunning(false); 
          return 0; 
        } 
        return s - 1; 
      }), 1000);
    }
  };

  const reset = () => { 
    clearInterval(intRef.current); 
    setRunning(false); 
    setSecs(isBreak ? 5 * 60 : 25 * 60); 
  };

  const swapMode = () => { 
    clearInterval(intRef.current); 
    setRunning(false); 
    setIsBreak(b => !b); 
    setSecs(isBreak ? 25 * 60 : 5 * 60); 
  };

  useEffect(() => () => clearInterval(intRef.current), []);

  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  const accent = isBreak ? T.teal : T.gold;

  return (
    <Card style={{ 
      background: `linear-gradient(135deg,rgba(240,165,0,.08),rgba(255,122,48,.04))`, 
      borderColor: 'rgba(240,165,0,.18)' 
    }} anim="slideLeft" delay={350}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.gold, boxShadow: `0 0 8px ${T.gold}` }} />
        <div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em' }}>Study Timer</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <svg width={130} height={130} viewBox="0 0 130 130">
          <circle cx={65} cy={65} r={radius} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={8} />
          <circle cx={65} cy={65} r={radius} fill="none" stroke={accent} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
            transform="rotate(-90 65 65)" className="timer-ring"
            style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />
          <text x={65} y={60} textAnchor="middle" fill={accent} fontFamily="Fraunces,serif" fontSize={22} fontWeight={900}>{m}:{s}</text>
          <text x={65} y={76} textAnchor="middle" fill={T.text3} fontFamily="Satoshi,sans-serif" fontSize={9} letterSpacing={2}>{isBreak ? 'BREAK' : 'FOCUS'}</text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 14 }}>
        {sessions.map((done, i) => (
          <div key={i} style={{ 
            width: 9, 
            height: 9, 
            borderRadius: '50%', 
            background: done ? T.gold : 'rgba(240,165,0,.18)', 
            border: `1px solid rgba(240,165,0,.3)`, 
            boxShadow: done ? `0 0 6px ${T.gold}` : 'none', 
            animation: done ? 'bdot 2.4s ease-in-out infinite' : 'none' 
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 7 }}>
        {[
          { label: running ? '⏸ Pause' : '▶ Start', fn: toggle, active: running }, 
          { label: '↺ Reset', fn: reset }, 
          { label: isBreak ? '📚 Focus' : '☕ Break', fn: swapMode }
        ].map((btn, i) => (
          <button key={i} onClick={btn.fn} style={{ 
            flex: 1, 
            padding: '9px 4px', 
            borderRadius: 10, 
            border: `1px solid ${btn.active ? 'rgba(240,165,0,.35)' : T.bord}`, 
            background: btn.active ? 'rgba(240,165,0,.1)' : 'rgba(255,255,255,.03)', 
            color: btn.active ? T.gold : T.text2, 
            cursor: "pointer", 
            fontFamily: 'Satoshi,sans-serif', 
            fontSize: '.75rem', 
            fontWeight: 700, 
            transition: 'all .18s' 
          }}
          onMouseEnter={e => { 
            e.target.style.borderColor = 'rgba(240,165,0,.35)'; 
            e.target.style.color = T.gold; 
          }}
          onMouseLeave={e => { 
            if (!btn.active) { 
              e.target.style.borderColor = T.bord; 
              e.target.style.color = T.text2; 
            } 
          }}
          >{btn.label}</button>
        ))}
      </div>
    </Card>
  );
}
