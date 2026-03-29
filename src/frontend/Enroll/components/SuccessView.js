import { useEffect, useState } from "react";

export default function SuccessView({ course, paymentInfo, onLearn, onExplore }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const orderId = `#LV-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div style={{ textAlign: "center", padding: "28px 20px", maxWidth: 500, margin: "0 auto" }}>
      <style>{`
        @keyframes circDraw { to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Animated checkmark */}
      <div style={{ width: 76, height: 76, margin: "0 auto 16px" }}>
        <svg viewBox="0 0 76 76" width="76" height="76">
          <circle cx="38" cy="38" r="34" fill="none" stroke="#4F6EF7" strokeWidth="2.5"
            strokeDasharray="214" strokeDashoffset={show ? 0 : 214}
            style={{ transition: "stroke-dashoffset .85s ease" }} />
          <polyline points="20,40 32,52 56,26" fill="none" stroke="#4F6EF7" strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="58" strokeDashoffset={show ? 0 : 58}
            style={{ transition: "stroke-dashoffset .45s ease .82s" }} />
        </svg>
      </div>

      <div style={{ fontSize: 24, fontWeight: 800, color: "#F0F4FF", letterSpacing: "-.03em", marginBottom: 7,
        opacity: show ? 1 : 0, transform: show ? "none" : "translateY(14px)", transition: "all .5s ease 1s" }}>
        Enrolled Successfully!
      </div>
      <div style={{ fontSize: 13, color: "#6B7A99", marginBottom: 20, lineHeight: 1.6,
        opacity: show ? 1 : 0, transition: "all .45s ease 1.18s" }}>
        You're now enrolled in<br />
        <strong style={{ color: "#B8C4D8" }}>{course.title}</strong>
      </div>

      {/* Enrollment details card */}
      <div style={{ background: "rgba(15,22,35,0.85)", border: "1px solid rgba(79,110,247,0.2)", borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "left",
        opacity: show ? 1 : 0, transition: "all .45s ease 1.35s" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#3A4460", marginBottom: 11 }}>ENROLLMENT DETAILS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 11 }}>
          {[
            { label: "ORDER ID",     value: orderId,                                  color: "#F0F4FF",  bg: "rgba(79,110,247,.07)",  bord: "rgba(79,110,247,.15)" },
            { label: "AMOUNT PAID",  value: paymentInfo?.amount ? `₹${paymentInfo.amount.toLocaleString()}` : "—", color: "#22C55E", bg: "rgba(34,197,94,.07)", bord: "rgba(34,197,94,.15)" },
            { label: "GST PAID",     value: paymentInfo?.gst ? `₹${paymentInfo.gst.toLocaleString()}` : "—",       color: "#F59E0B", bg: "rgba(245,158,11,.07)", bord: "rgba(245,158,11,.15)" },
            { label: "PAYMENT VIA",  value: paymentInfo?.paymentMethod || "—",        color: "#0EB5AA",  bg: "rgba(14,181,170,.07)",  bord: "rgba(14,181,170,.15)" },
          ].map(item => (
            <div key={item.label} style={{ padding: 10, background: item.bg, borderRadius: 8, border: `1px solid ${item.bord}` }}>
              <div style={{ fontSize: 10, color: "#3A4460", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: item.label === "ORDER ID" ? "monospace" : "inherit" }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,.06)", marginBottom: 10 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", background: "rgba(34,197,94,.06)", borderRadius: 7, border: "1px solid rgba(34,197,94,.14)" }}>
          <span style={{ fontSize: 14 }}>📧</span>
          <span style={{ fontSize: 11, color: "#B8C4D8" }}>Confirmation sent to your registered email</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 9, opacity: show ? 1 : 0, transition: "all .4s ease 1.55s" }}>
        <button onClick={onLearn}
          style={{ flex: 1, padding: 11, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#4F6EF7,#6B85F8)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Start Learning →
        </button>
        <button onClick={onExplore}
          style={{ padding: "11px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#B8C4D8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          Explore More
        </button>
      </div>
    </div>
  );
}
