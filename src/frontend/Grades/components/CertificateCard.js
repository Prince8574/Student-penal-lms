import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Mini certificate preview rendered as HTML inside the card
function CertPreview({ c }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: c.theme?.bg || "linear-gradient(135deg,#0d1b2a,#162a46)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "18px 14px",
      fontFamily: "inherit",
    }}>
      {/* Background pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 20%, ${c.theme?.accent || "#3b9eff"}18 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${c.theme?.accent || "#3b9eff"}12 0%, transparent 50%)`,
        pointerEvents: "none",
      }} />

      {/* Corner decorations */}
      {["0 0", "auto 0", "0 auto", "auto auto"].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          top: pos.split(" ")[1] === "0" ? 6 : "auto",
          bottom: pos.split(" ")[1] === "auto" ? 6 : "auto",
          left: pos.split(" ")[0] === "0" ? 6 : "auto",
          right: pos.split(" ")[0] === "auto" ? 6 : "auto",
          width: 18, height: 18,
          borderTop: pos.split(" ")[1] === "0" ? `2px solid ${c.theme?.accent || "#3b9eff"}66` : "none",
          borderBottom: pos.split(" ")[1] === "auto" ? `2px solid ${c.theme?.accent || "#3b9eff"}66` : "none",
          borderLeft: pos.split(" ")[0] === "0" ? `2px solid ${c.theme?.accent || "#3b9eff"}66` : "none",
          borderRight: pos.split(" ")[0] === "auto" ? `2px solid ${c.theme?.accent || "#3b9eff"}66` : "none",
        }} />
      ))}

      {/* Border */}
      <div style={{
        position: "absolute", inset: 8,
        border: `1px solid ${c.theme?.accent || "#3b9eff"}33`,
        borderRadius: 4, pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{
        fontSize: ".65rem", fontWeight: 800, letterSpacing: ".08em",
        color: c.theme?.accent || "#3b9eff", marginBottom: 6, zIndex: 1,
        textTransform: "uppercase",
      }}>🎓 LearnVerse</div>

      {/* Certificate of Completion */}
      <div style={{
        fontSize: ".52rem", color: c.theme?.text || "#c8e6ff",
        letterSpacing: ".12em", textTransform: "uppercase",
        opacity: 0.7, marginBottom: 8, zIndex: 1,
      }}>Certificate of Completion</div>

      {/* Divider */}
      <div style={{
        width: 40, height: 1,
        background: `linear-gradient(90deg, transparent, ${c.theme?.accent || "#3b9eff"}88, transparent)`,
        marginBottom: 8, zIndex: 1,
      }} />

      {/* Trophy */}
      <div style={{ fontSize: "1.6rem", marginBottom: 6, zIndex: 1 }}>🏆</div>

      {/* Assignment title */}
      <div style={{
        fontSize: ".62rem", fontWeight: 700,
        color: c.theme?.text || "#c8e6ff",
        textAlign: "center", lineHeight: 1.3,
        maxWidth: "85%", zIndex: 1,
        display: "-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{c.courseName || c.title}</div>

      {/* Score badge */}
      <div style={{
        marginTop: 8, padding: "3px 10px",
        background: `${c.theme?.accent || "#3b9eff"}22`,
        border: `1px solid ${c.theme?.accent || "#3b9eff"}55`,
        borderRadius: 99, zIndex: 1,
        fontSize: ".58rem", fontWeight: 800,
        color: c.theme?.accent || "#3b9eff",
        letterSpacing: ".06em",
      }}>{c.score}% · Grade {c.grade}</div>

      {/* Bottom line */}
      <div style={{
        position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
        fontSize: ".48rem", color: c.theme?.text || "#c8e6ff",
        opacity: 0.4, letterSpacing: ".08em", whiteSpace: "nowrap", zIndex: 1,
      }}>Issued: {c.issued}</div>
    </div>
  );
}

export default function CertificateCard({ c, idx, onPreview, onDownload }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.fromTo(card, { opacity: 0, y: 22 }, {
      opacity: 1, y: 0, duration: 0.6, delay: idx * 0.09, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%" },
    });
  }, [idx]);

  return (
    <div ref={cardRef} className="cert-card" style={{ opacity: 0 }}>
      {/* Certificate preview image */}
      <div className="cert-thumb" style={{ padding: 0, overflow: "hidden" }}>
        <CertPreview c={c} />
      </div>

      <div className="cert-body">
        <div className="cert-name">{c.courseName || c.title}</div>
        <div className="cert-meta">
          <span>🏆 Grade: <b style={{ color: "#f5a020" }}>{c.grade}</b></span>
          <span>📅 {c.issued}</span>
          <span>📊 {c.score}%</span>
        </div>
        <div className="cert-actions">
          <button className="btn-dl" onClick={e => { e.stopPropagation(); onDownload(c.id); }}>⬇ Download PDF</button>
          <button className="btn-view" onClick={e => { e.stopPropagation(); onPreview(c.id); }}>👁 Preview</button>
        </div>
      </div>
    </div>
  );
}
