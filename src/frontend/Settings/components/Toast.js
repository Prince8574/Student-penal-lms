import { useEffect } from 'react';
import { T } from '../utils/designTokens';

export function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const map = {
    success: { bg: 'rgba(74,222,128,.12)', bord: 'rgba(74,222,128,.28)', col: T.green, ico: '✅' },
    error: { bg: 'rgba(239,68,68,.1)', bord: 'rgba(239,68,68,.25)', col: T.red, ico: '❌' },
    info: { bg: 'rgba(240,165,0,.1)', bord: 'rgba(240,165,0,.25)', col: T.gold, ico: '💡' },
  };

  const s = map[type] || map.info;

  return (
    <div
      className="toast"
      style={{
        background: s.bg,
        border: `1px solid ${s.bord}`,
        animation: 'toastIn .35s cubic-bezier(.34,1.56,.64,1) both',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{s.ico}</span>
      <span style={{ fontSize: '.875rem', fontWeight: 600, color: s.col }}>{msg}</span>
    </div>
  );
}

