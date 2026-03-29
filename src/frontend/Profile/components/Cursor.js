import { useState, useEffect, useRef } from "react";

const T = {
  gold: "#f0a500"
};

export default function Cursor() {
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const mainRef = useRef(null);
  const ringRef = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const onMove = e => { 
      pos.current = { x: e.clientX, y: e.clientY }; 
      if (mainRef.current) { 
        mainRef.current.style.left = e.clientX + 'px'; 
        mainRef.current.style.top = e.clientY + 'px'; 
      } 
    };
    window.addEventListener('mousemove', onMove);

    const targets = document.querySelectorAll('a,button,.chip,.sk-item,.badg-item,.crow-item,.soc-item,.hday,.certrow,.acard,.feed-item,.stat-box');
    targets.forEach(el => { 
      el.addEventListener('mouseenter', () => setHov(true)); 
      el.addEventListener('mouseleave', () => setHov(false)); 
    });

    let raf;
    const loop = () => { 
      raf = requestAnimationFrame(loop); 
      ring.current.x += (pos.current.x - ring.current.x) * .11; 
      ring.current.y += (pos.current.y - ring.current.y) * .11; 
      if (ringRef.current) { 
        ringRef.current.style.left = ring.current.x + 'px'; 
        ringRef.current.style.top = ring.current.y + 'px'; 
      } 
    };
    loop();

    return () => { 
      window.removeEventListener('mousemove', onMove); 
      cancelAnimationFrame(raf); 
    };
  }, []);

  return (
    <>
      <div ref={mainRef} className="cur-main" style={{ width: hov ? 6 : 10, height: hov ? 6 : 10, background: T.gold, boxShadow: `0 0 10px ${T.gold}`, opacity: hov ? .35 : 1 }} />
      <div ref={ringRef} className="cur-ring" style={{ width: hov ? 56 : 38, height: hov ? 56 : 38, border: `1.5px solid rgba(240,165,0,${hov ? .75 : .4})`, opacity: hov ? .95 : .6 }} />
    </>
  );
}