import { useEffect } from "react";
import { T, G } from "../utils/constants";
import { fmtDate } from "../utils/helpers";
import StatusBadge from "./StatusBadge";
import GradeRing from "./GradeRing";

/* ══════════════════════════════FEEDBACK MODAL══════════════════════════════ */
export default function FeedbackModal({ a, onClose, asPage }) {
  useEffect(function() {
    if (asPage) return;
    function esc(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", esc);
    return function() { window.removeEventListener("keydown", esc); };
  }, [onClose, asPage]);

  const pct = a.grade != null ? Math.round((a.grade / a.points) * 100) : 0;
  const scoreColor = pct >= 75 ? T.green : pct >= 60 ? T.gold : T.red;
  const scoreGrad  = pct >= 75 ? G.green : pct >= 60 ? G.gold : G.red;

  const inner = (
      <div style={{ background:"#090d1f", width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", animation:"modalIn .35s cubic-bezier(.34,1.3,.64,1) both" }}>
        {/* Top accent bar */}
        <div style={{ height:3, background:"linear-gradient(90deg," + a.courseColor + "," + a.courseColor + "55,transparent)", flexShrink:0 }}/>

        {/* Header — hidden in page mode (TopBar handles navigation) */}
        {!asPage && (
        <div style={{ padding:"18px 28px 14px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ padding:"3px 10px", borderRadius:99, background:a.courseColor + "15", border:"1px solid " + a.courseColor + "30" }}>
                <span style={{ fontSize:".65rem", fontWeight:800, color:a.courseColor }}>{a.courseIcon} {(a.course||"").split(" ").slice(0,3).join(" ")}</span>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="ff" style={{ fontSize:"1.25rem", fontWeight:900, letterSpacing:"-.04em", lineHeight:1.2, color:T.text }}>{a.title}</div>
          </div>
          {a.grade != null && <GradeRing grade={a.grade} max={a.points} size={68} />}
          <button onClick={onClose}
            style={{ width:36, height:36, borderRadius:10, border:"1px solid rgba(255,255,255,.08)", background:"transparent", color:T.text3, cursor:"pointer", display:"grid", placeItems:"center", fontSize:"1rem", transition:"all .2s", flexShrink:0 }}
            onMouseEnter={function(e) { e.currentTarget.style.background="rgba(255,255,255,.06)"; e.currentTarget.style.color=T.text; }}
            onMouseLeave={function(e) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.text3; }}>✕</button>
        </div>
        )}

        {/* Two-column body */}
        <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

          {/* LEFT — score + rubric */}
          <div style={{ width:300, flexShrink:0, borderRight:"1px solid rgba(255,255,255,.06)", overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:18 }}>

            {/* Score card */}
            {a.grade != null && (
              <div style={{ padding:"18px", borderRadius:16, background:"linear-gradient(135deg," + a.courseColor + "08,rgba(0,0,0,0))", border:"1px solid " + a.courseColor + "28" }}>
                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Final Score</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:14 }}>
                  <div className="ff" style={{ fontSize:"2.6rem", fontWeight:900, color:scoreColor, letterSpacing:"-.05em" }}>{a.grade}</div>
                  <div style={{ fontSize:".9rem", color:T.text3 }}>/ {a.points} pts</div>
                  <div style={{ padding:"3px 10px", borderRadius:6, background:scoreColor + "18", color:scoreColor, fontSize:".72rem", fontWeight:800, border:"1px solid " + scoreColor + "35" }}>{pct}%</div>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,.06)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:pct + "%", background:scoreGrad, borderRadius:99, transition:"width 1.4s ease", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)", animation:"shimmer 2.5s ease-in-out infinite" }}/>
                  </div>
                </div>
              </div>
            )}

            {/* Rubric breakdown */}
            {(a.rubric||[]).length > 0 && (
              <div>
                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Rubric Breakdown</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(a.rubric||[]).map(function(rb, i) {
                    const label  = rb.criterion || rb.l || "";
                    const pts    = rb.points    || rb.p || 0;
                    const rScore = pts > 0 && a.grade != null ? Math.round(pts * (a.grade / a.points)) : 0;
                    return (
                      <div key={i} style={{ padding:"11px 13px", borderRadius:11, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                          <div style={{ fontSize:".8rem", fontWeight:600, color:T.text2 }}>{label}</div>
                          <div style={{ fontSize:".76rem", fontWeight:800, color:T.gold }}>{rScore} / {pts} pts</div>
                        </div>
                        <div className="rub-bar">
                          <div className="rub-fill" style={{ width: pts > 0 ? ((rScore/pts)*100) + "%" : "0%" }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — feedback + files + actions */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 28px", display:"flex", flexDirection:"column", gap:18, minWidth:0 }}>

            {/* Instructor feedback */}
            {a.feedback ? (
              <div>
                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Instructor Feedback</div>
                <div style={{ padding:"18px", borderRadius:14, background:"rgba(74,222,128,.04)", border:"1px solid rgba(74,222,128,.18)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:38, height:38, borderRadius:11, background:"rgba(74,222,128,.12)", border:"1px solid rgba(74,222,128,.2)", display:"grid", placeItems:"center", fontSize:".75rem", fontWeight:900, color:T.green, flexShrink:0 }}>PN</div>
                    <div>
                      <div style={{ fontSize:".84rem", fontWeight:700 }}>Prof. Nair</div>
                      <div style={{ fontSize:".7rem", color:T.text3 }}>Graded on {fmtDate(a.dueDate)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:".86rem", color:T.text2, lineHeight:1.75 }}>{a.feedback}</div>
                </div>
              </div>
            ) : (
              <div style={{ padding:"32px", textAlign:"center", borderRadius:14, border:"1px dashed rgba(255,255,255,.08)", color:T.text3, fontSize:".84rem" }}>
                No feedback yet from instructor.
              </div>
            )}

            {/* Submitted files */}
            {a.attachments && a.attachments.length > 0 && (
              <div>
                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Your Submission</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {a.attachments.map(function(f, i) {
                    return (
                      <div key={i} className="file-chip">
                        <span style={{ fontSize:"1rem" }}>{f.endsWith(".pdf") ? "📄" : f.endsWith(".mp4") ? "🎥" : f.endsWith(".md") ? "📝" : "📎"}</span>
                        <span style={{ flex:1, fontSize:".82rem", fontWeight:600 }}>{f}</span>
                        <button style={{ background:"none", border:"none", color:T.text3, cursor:"pointer", fontSize:".8rem", transition:"color .2s", padding:"4px" }}
                          onMouseEnter={function(e) { e.currentTarget.style.color=T.gold; }}
                          onMouseLeave={function(e) { e.currentTarget.style.color=T.text3; }}>⬇</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spacer */}
            <div style={{ flex:1 }}/>

            {/* Actions */}
            <div style={{ display:"flex", gap:10, paddingTop:4 }}>
              <button onClick={onClose} className="btn-outline" style={{ flex:1 }}>Close</button>
              <button className="btn-prim" style={{ flex:2, padding:"12px" }}>
                <span className="sh"/>
                📤 Request Re-evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  if (asPage) { return inner; }
  return (
    <div className="modal-overlay" onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
      {inner}
    </div>
  );
}
