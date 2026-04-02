import { useState, useEffect, useRef } from "react";

export default function AnimNumber({ target, suffix = "", delay = 0, style = {} }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const timer = setTimeout(() => {
      const dur = 1800, start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return <span ref={ref} style={style}>{val}{suffix}</span>;
}