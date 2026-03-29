import { useState, useEffect } from "react";
import { T } from "../utils/constants";

/* ══════════════════════════════COUNTDOWN TIMER══════════════════════════════ */
export default function Countdown({ dueDate, dueTime }) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0, past: false });
  useEffect(() => {
    const calc = () => {
      const due = new Date(`${dueDate} ${dueTime}`),
        now = new Date();
      const diff = due - now;
      if (diff < 0) {
        setLeft({ d: 0, h: 0, m: 0, s: 0, past: true });
        return;
      }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        past: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dueDate, dueTime]);
  if (left.past)
    return (
      <span style={{ fontSize: ".78rem", fontWeight: 700, color: T.red }}>
        ⚠ Overdue
      </span>
    );
  const urgent = left.d === 0 && left.h < 6;
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[
        { v: left.d, l: "d" },
        { v: left.h, l: "h" },
        { v: left.m, l: "m" },
        { v: left.s, l: "s" },
      ].map(({ v, l }) => (
        <div key={l} style={{ textAlign: "center", minWidth: 28 }}>
          <div
            className="ff cntd"
            style={{
              fontSize: "1rem",
              fontWeight: 900,
              lineHeight: 1,
              color: urgent ? T.red : T.gold,
            }}
          >
            {String(v).padStart(2, "0")}
          </div>
          <div
            style={{
              fontSize: ".55rem",
              color: T.text3,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {l}
          </div>
        </div>
      ))}
    </div>
  );
}
