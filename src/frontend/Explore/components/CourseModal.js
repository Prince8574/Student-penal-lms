import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../utils/designTokens";
import { BadgePill } from "./UIElements";

export default function CourseModal({ c, onClose, enrolled }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const handleEnroll = () => {
    onClose();
    navigate(`/enroll/${c.id}`);
  };

  const handleWishlist = () => {
    const list = JSON.parse(localStorage.getItem("wishlist_courses") || "[]");
    const idx = list.indexOf(String(c.id));
    if (idx === -1) list.push(String(c.id));
    else list.splice(idx, 1);
    localStorage.setItem("wishlist_courses", JSON.stringify(list));
    setWishlisted(idx === -1);
  };
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const disc = c.original > c.price ? Math.round((1 - c.price / c.original) * 100) : 0;

  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Hero */}
        <div style={{ height: 190, background: c.g, position: "relative", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
          {c.thumbnail && <img src={c.thumbnail} alt={c.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}/>}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 80% at 30% 50%,${c.accent}2a,transparent)` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 25%,rgba(0,0,0,.72))", zIndex:1 }} />
          {!c.thumbnail && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex:1 }}>
            <span style={{ fontSize: "4.5rem", opacity: .1, filter: "blur(2px)" }}>{c.icon}</span>
          </div>}
          <div style={{ position: "absolute", bottom: 18, left: 22, zIndex: 2 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <BadgePill text={c.badge} />
              <span style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(0,0,0,.5)", fontSize: ".62rem", color: T.text2, border: "1px solid rgba(255,255,255,.07)", fontWeight: 700 }}>
                {c.level}
              </span>
            </div>
            <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em", lineHeight: 1.2, color: T.text, maxWidth: 480 }}>
              {c.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 3,
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,.18)",
              background: "rgba(0,0,0,.55)",
              color: T.text,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              fontSize: ".95rem",
              display: "grid",
              placeItems: "center",
              transition: "all .2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,.55)"}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.bord, borderRadius: 12, overflow: "hidden" }}>
            {[
              { l: "Rating", v: `${c.rating||0}★`, col: T.gold },
              { l: "Reviews", v: (c.reviews||0).toLocaleString(), col: T.text },
              { l: "Students", v: `${((c.students||0) / 1000).toFixed(0)}k`, col: T.teal },
              { l: "Duration", v: c.duration||"—", col: T.text }
            ].map(({ l, v, col }) => (
              <div key={l} style={{ padding: "11px 12px", background: T.card, textAlign: "center" }}>
                <div className="ff" style={{ fontSize: "1.05rem", fontWeight: 900, color: col }}>{v}</div>
                <div style={{ fontSize: ".6rem", textTransform: "uppercase", letterSpacing: ".08em", color: T.text3, marginTop: 3, fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 13, background: "rgba(255,255,255,.025)", border: `1px solid ${T.bord}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${c.accent}28,${c.accent}44)`, border: `1px solid ${c.accent}44`, display: "grid", placeItems: "center", fontSize: ".8rem", fontWeight: 900, color: c.accent, flexShrink: 0 }}>
              {c.instructor.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: ".88rem", fontWeight: 700 }}>{c.instructor}</div>
              <div style={{ fontSize: ".72rem", color: T.text3, marginTop: 2 }}>{c.category || c.cat} · Expert Instructor</div>
            </div>
            <button className="btn-outline" style={{ fontSize: ".75rem", padding: "6px 13px" }}>View Profile</button>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3, marginBottom: 8 }}>About This Course</div>
            <div style={{ fontSize: ".85rem", color: T.text2, lineHeight: 1.7 }}>{c.description || c.desc || "—"}</div>
          </div>

          {/* Outcomes */}
          {(c.outcomes || []).filter(Boolean).length > 0 && (
            <div>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3, marginBottom: 9 }}>What You'll Learn</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {(c.outcomes || []).filter(Boolean).map((o, i) => {
                  const text = typeof o === "object" ? (o.text||o.name||o.label||String(o)) : String(o);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 11px", borderRadius: 9, background: "rgba(255,255,255,.025)", border: `1px solid ${T.bord}` }}>
                      <span style={{ color: T.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: ".78rem", color: T.text2 }}>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {(c.tags || []).length > 0 && (
          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3, marginBottom: 9 }}>Skills You'll Gain</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(c.tags || []).map((t, i) => { const tag = typeof t === "object" ? (t.name||t.label||String(t)) : String(t); return <span key={i} className="tag" style={{ padding: "4px 11px", fontSize: ".74rem" }}>{tag}</span>; })}
            </div>
          </div>
          )}

          {/* Price CTA */}
          <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(240,165,0,.05)", border: "1px solid rgba(240,165,0,.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
              <div className="ff" style={{ fontSize: "1.55rem", fontWeight: 900, color: T.gold }}>{c.price === 0 ? "FREE" : `₹${c.price.toLocaleString()}`}</div>
              {c.original > c.price && <>
                <div style={{ fontSize: ".82rem", color: T.text3, textDecoration: "line-through" }}>₹{c.original.toLocaleString()}</div>
                <span style={{ padding: "2px 8px", borderRadius: 5, background: "rgba(74,222,128,.12)", color: T.green, fontSize: ".7rem", fontWeight: 800 }}>{disc}% OFF</span>
              </>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {enrolled ? (
                <button className="btn-gold" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onClose(); navigate(`/learn/${c.id}`); }}>
                  ▶ Continue Learning
                </button>
              ) : (
                <button className="btn-gold" style={{ flex: 1, justifyContent: "center" }} onClick={handleEnroll}>
                  🚀 {c.price === 0 ? "Enroll Free" : "Enroll Now"}
                </button>
              )}
              <button onClick={handleWishlist} style={{ padding:"9px 16px", borderRadius:11, border:`1px solid ${wishlisted?"rgba(240,32,121,.4)":"rgba(255,255,255,.1)"}`, background:wishlisted?"rgba(240,32,121,.1)":"transparent", color:wishlisted?"#f02079":T.text2, cursor:"pointer", fontSize:".82rem", transition:"all .2s", fontFamily:"'Satoshi',sans-serif" }}>
                {wishlisted ? "♥ Saved" : "♡ Wishlist"}
              </button>
            </div>
            <div style={{ fontSize: ".7rem", color: T.text3, marginTop: 9, textAlign: "center" }}>
              30-day money-back guarantee · Lifetime access · Certificate included
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

