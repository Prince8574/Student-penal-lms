import { useState, useEffect, useRef } from "react";
import { T } from "../utils/constants";

/* ══════════════════════════════CURSOR══════════════════════════════ */
export default function Cursor() {
  const dRef = useRef(null),
    rRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 }),
    rp = useRef({ x: -200, y: -200 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const mv = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dRef.current) {
        dRef.current.style.left = e.clientX + "px";
        dRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", mv);
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rp.current.x += (pos.current.x - rp.current.x) * 0.11;
      rp.current.y += (pos.current.y - rp.current.y) * 0.11;
      if (rRef.current) {
        rRef.current.style.left = rp.current.x + "px";
        rRef.current.style.top = rp.current.y + "px";
      }
    };
    loop();
    const add = () => setHov(true),
      rm = () => setHov(false);
    const att = () =>
      document
        .querySelectorAll(
          "button,a,.a-card,.f-pill,.sb-link,.file-chip,.upload-zone,.tab-btn"
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", add);
          el.addEventListener("mouseleave", rm);
        });
    att();
    const obs = new MutationObserver(att);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("mousemove", mv);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);
  return (
    <>
      <div
        ref={dRef}
        className="cur-d"
        style={{
          width: hov ? 6 : 10,
          height: hov ? 6 : 10,
          background: T.gold,
          boxShadow: `0 0 10px ${T.gold}`,
          opacity: hov ? 0.25 : 1,
          transition: "width .18s,height .18s,opacity .18s",
        }}
      />
      <div
        ref={rRef}
        className="cur-r"
        style={{
          width: hov ? 54 : 38,
          height: hov ? 54 : 38,
          border: `1.5px solid rgba(240,165,0,${hov ? 0.75 : 0.38})`,
          opacity: hov ? 0.9 : 0.55,
          transition: "width .28s,height .28s,opacity .28s",
        }}
      />
    </>
  );
}
