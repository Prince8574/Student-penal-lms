import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import './Course.css';
import { useBg } from './utils/threeBackground';
import { T, G } from './utils/designTokens';
import { COURSES, CATEGORIES, LEVELS, NAV } from './utils/courseData';
import Cursor from './components/Cursor';
import Stars from './components/Stars';
import ProgressBar from './components/ProgressBar';
import BadgeChip from './components/BadgeChip';

/* ══════════════════════════════════════
CSS STYLES
══════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Satoshi:wght@300;400;500;700;900&display=swap');

*,::before,::after{box-sizing:border-box;margin:0;padding:0}
html{scrollbar-width:thin;scrollbar-color:#0f1e38 transparent}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#0f1e38;border-radius:3px}
body{overflow:hidden;height:100vh}
.ff{font-family:'Fraunces',serif!important}
.fs{font-family:'Satoshi',sans-serif!important}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes popIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(240,165,0,.5)}50%{box-shadow:0 0 0 8px rgba(240,165,0,0)}}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
@keyframes noise{0%{transform:translate(0)}50%{transform:translate(-2%,-1%)}100%{transform:translate(1%,2%)}}
@keyframes modalIn{from{opacity:0;transform:scale(0.94) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
@keyframes progressFill{from{width:0%}to{width:var(--pw,0%)}}
@keyframes starPop{0%{transform:scale(0) rotate(-30deg)}70%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
@keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 0 4px transparent}}
@keyframes dot3{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}

/* Sidebar */
.sb-item{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:11px;cursor:pointer;color:#8899b8;font-size:.83rem;font-weight:500;transition:all .2s;position:relative;margin-bottom:2px;user-select:none;border:1px solid transparent}
.sb-item:hover{background:rgba(255,255,255,.04);color:#f0f6ff;border-color:rgba(255,255,255,.04)}
.sb-item.act{background:rgba(240,165,0,.09);color:#f0a500;border-color:rgba(240,165,0,.18)}
.sb-item.act::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:58%;background:linear-gradient(to bottom,#f0a500,#ff7a30);border-radius:0 2px 2px 0}

/* Cards */
.c-card{background:rgba(10,18,38,.92);border:1px solid rgba(255,255,255,.055);border-radius:18px;overflow:hidden;transition:all .32s cubic-bezier(.4,0,.2,1);cursor:pointer;position:relative;z-index:1}
.c-card:hover{border-color:rgba(240,165,0,.22);transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,.6);z-index:2}
.c-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(240,165,0,.04),transparent 60%);opacity:0;transition:opacity .35s;pointer-events:none;z-index:1}
.c-card:hover::before{opacity:1}

/* Header */
header{position:relative!important;z-index:100!important}

/* List card */
.lc-card{display:flex;align-items:stretch;background:rgba(10,18,38,.92);border:1px solid rgba(255,255,255,.055);border-radius:16px;overflow:hidden;transition:all .28s;cursor:pointer;position:relative}
.lc-card:hover{border-color:rgba(240,165,0,.2);transform:translateX(4px);box-shadow:0 14px 40px rgba(0,0,0,.5)}

/* Buttons */
.btn-prim{padding:10px 22px;border-radius:11px;border:none;background:linear-gradient(135deg,#f0a500,#ff7a30);color:#030810;font-family:'Satoshi',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;white-space:nowrap}
.btn-prim:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(240,165,0,.4)}
.btn-prim .sh{position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:translateX(-120%);transition:transform .4s}
.btn-prim:hover .sh{transform:translateX(120%)}

.btn-ghost{padding:9px 20px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:transparent;color:#8899b8;font-family:'Satoshi',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s}
.btn-ghost:hover{border-color:rgba(240,165,0,.28);color:#f0a500;background:rgba(240,165,0,.06)}

.btn-teal{padding:10px 22px;border-radius:11px;border:none;background:linear-gradient(135deg,#00d4aa,#3b82f6);color:#030810;font-family:'Satoshi',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .22s}
.btn-teal:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,212,170,.35)}

.icon-btn{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.07);background:transparent;display:grid;place-items:center;cursor:pointer;font-size:.9rem;color:#8899b8;transition:all .2s;flex-shrink:0}
.icon-btn:hover{border-color:rgba(240,165,0,.3);color:#f0a500;background:rgba(240,165,0,.07)}

/* Search */
.search-wrap{display:flex;align-items:center;gap:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:10px 14px;transition:all .22s;flex:1;max-width:360px}
.search-wrap:focus-within{border-color:rgba(240,165,0,.35);background:rgba(240,165,0,.025);box-shadow:0 0 0 3px rgba(240,165,0,.07)}
.search-inp{background:none;border:none;outline:none;color:#f0f6ff;font-family:'Satoshi',sans-serif;font-size:.85rem;flex:1}
.search-inp::placeholder{color:#3a4f6e}

/* Filter pill */
.f-pill{padding:7px 16px;border-radius:99px;border:1px solid rgba(255,255,255,.07);background:transparent;color:#8899b8;font-family:'Satoshi',sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
.f-pill.on{background:rgba(240,165,0,.1);color:#f0a500;border-color:rgba(240,165,0,.25)}
.f-pill:hover:not(.on){background:rgba(255,255,255,.04);color:#f0f6ff;border-color:rgba(255,255,255,.12)}

/* Tag */
.tag{padding:3px 9px;border-radius:6px;font-size:.68rem;font-weight:700;background:rgba(255,255,255,.05);color:#8899b8;border:1px solid rgba(255,255,255,.06);white-space:nowrap;transition:all .2s}
.tag:hover{background:rgba(240,165,0,.08);color:#f0a500;border-color:rgba(240,165,0,.2)}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .25s ease both;backdrop-filter:blur(8px)}
.modal-box{background:#0c1628;border:1px solid rgba(255,255,255,.08);border-radius:24px;max-width:780px;width:100%;max-height:88vh;overflow-y:auto;animation:modalIn .35s cubic-bezier(.34,1.3,.64,1) both;scrollbar-width:thin;scrollbar-color:#1a2a4a transparent}

/* View toggle */
.v-btn{width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.07);background:transparent;display:grid;place-items:center;cursor:pointer;font-size:.85rem;color:#8899b8;transition:all .2s}
.v-btn.on{background:rgba(240,165,0,.1);border-color:rgba(240,165,0,.25);color:#f0a500}

/* Avatar circle */
.av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:.72rem;font-weight:800;flex-shrink:0}

/* Dropdown */
.dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#0c1628;border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:6px;min-width:180px;z-index:9999;animation:popIn .2s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.dd-item{padding:9px 12px;border-radius:8px;font-size:.8rem;cursor:pointer;color:#8899b8;transition:all .18s;white-space:nowrap}
.dd-item:hover{background:rgba(255,255,255,.05);color:#f0f6ff}
`;

/* ══════════════════════════════════════
COURSE CARD COMPONENT
══════════════════════════════════════ */
export function CourseCard({course, idx, onOpen, enrolled = false}) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const navigate = useNavigate();
  const disc = course.originalPrice > course.price ? Math.round((1 - course.price / course.originalPrice) * 100) : 0;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting) {
        setTimeout(() => setVis(true), idx * 60);
        obs.disconnect();
      }
    }, {threshold:.08});
    
    if(ref.current) obs.observe(ref.current); 
    return () => obs.disconnect();
  }, [idx]);

  const onMM = e => {
    if(!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", ((e.clientX-r.left)/r.width*100).toFixed(1)+"%");
    ref.current.style.setProperty("--my", ((e.clientY-r.top)/r.height*100).toFixed(1)+"%");
  };

  return (
    <div 
      ref={ref} 
      className="c-card" 
      onClick={() => onOpen(course)} 
      onMouseMove={onMM}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .6s ${idx*.06}s,transform .6s ${idx*.06}s cubic-bezier(.4,0,.2,1)`,
        position: "relative"
      }}
    >
      {/* Thumbnail */}
      <div style={{height:168, background:course.gradient, position:"relative", overflow:"hidden", flexShrink:0}}>
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} style={{position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0}}/>
        )}
        <div style={{position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.65))", zIndex:1}} />
        {!course.thumbnail && (
          <>
            <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:0}}>
              <span style={{fontSize:"3.8rem", opacity:.18, filter:"blur(1px)", animation:"float 4s ease-in-out infinite"}}>{course.icon}</span>
            </div>
            <div style={{position:"absolute", top:0, left:0, right:0, bottom:0, background:`radial-gradient(ellipse 70% 70% at 30% 40%,${course.accentGlow},transparent)`, zIndex:0}} />
            <div style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-55%)", zIndex:2, width:62, height:62, borderRadius:16, background:`linear-gradient(135deg,${course.accent}22,${course.accent}44)`, border:`1.5px solid ${course.accent}55`, display:"grid", placeItems:"center", backdropFilter:"blur(8px)"}}>
              <span style={{fontSize:"1.8rem"}}>{course.icon}</span>
            </div>
          </>
        )}
        
        {/* Top badges */}
        <div style={{position:"absolute", top:12, left:12, zIndex:3, display:"flex", gap:6, flexWrap:"wrap"}}>
          <BadgeChip text={course.badge} />
        </div>
        
        <div style={{position:"absolute", top:12, right:12, zIndex:3, display:"flex", gap:5}}>
          <div style={{padding:"3px 8px", borderRadius:6, background:"rgba(0,0,0,.6)", backdropFilter:"blur(8px)", fontSize:".65rem", fontWeight:700, color:T.text2, border:"1px solid rgba(255,255,255,.08)"}}>{course.level}</div>
        </div>
        
        {/* Progress bar overlay */}
        {enrolled && (
          <div style={{position:"absolute", bottom:0, left:0, right:0, zIndex:3}}>
            <div style={{height:3, background:"rgba(0,0,0,.4)"}}>
              <div style={{height:"100%", width:`${course.progress||0}%`, background:(course.progress||0)===100?G.green:G.gold, transition:"width 1.5s ease", position:"relative", overflow:"hidden"}}>
                <div style={{position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)", animation:"shimmer 2.5s ease-in-out infinite"}} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{padding:"16px 18px 18px", display:"flex", flexDirection:"column", gap:10, position:"relative", zIndex:2}}>
        {/* Category */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <span style={{fontSize:".65rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:course.accent}}>{course.category}</span>
          <span style={{fontSize:".72rem", color:T.text3}}>{course.duration} · {course.lessons} lessons</span>
        </div>
        
        {/* Title */}
        <div className="ff" style={{fontSize:".95rem", fontWeight:800, letterSpacing:"-.03em", lineHeight:1.3, color:T.text, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"}}>{course.title}</div>
        
        {/* Instructor */}
        <div style={{display:"flex", alignItems:"center", gap:9}}>
          <div className="av" style={{background:`linear-gradient(135deg,${course.accent}33,${course.accent}55)`, border:`1px solid ${course.accent}44`, color:course.accent, fontSize:".65rem"}}>{course.instructorAvatar}</div>
          <div>
            <div style={{fontSize:".78rem", fontWeight:600, color:T.text}}>{course.instructor}</div>
            <div style={{fontSize:".68rem", color:T.text3}}>{course.instructorTitle}</div>
          </div>
        </div>
        
        {/* Rating */}
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <span style={{fontSize:".82rem", fontWeight:800, color:T.gold}}>{course.rating}</span>
          <Stars rating={course.rating} />
          <span style={{fontSize:".72rem", color:T.text3}}>({course.reviews.toLocaleString()})</span>
          <span style={{marginLeft:"auto", fontSize:".72rem", color:T.text3}}>{(course.students/1000).toFixed(0)}k students</span>
        </div>
        
        {/* Tags */}
        <div style={{display:"flex", gap:5, flexWrap:"wrap"}}>
          {course.tags.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
          {course.tags.length > 3 && <span className="tag" style={{color:T.text3}}>+{course.tags.length-3}</span>}
        </div>
        
        {/* Divider */}
        <div style={{height:1, background:T.bord, margin:"2px 0"}} />
        
        {/* Price + Action */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10}}>
          {enrolled ? (
            <div style={{display:"flex", flexDirection:"column", gap:1}}>
              <span style={{fontSize:".68rem", color:T.text3, fontWeight:600}}>{(course.progress||0)===100?"Completed ✓":`${course.progress||0}% complete`}</span>
              <span style={{fontSize:".72rem", color:T.text2}}>{(course.progress||0)<100&&`Next: ${course.nextLesson}`}</span>
            </div>
          ) : (
            <div style={{display:"flex", alignItems:"baseline", gap:6}}>
              <span className="ff" style={{fontSize:"1.15rem", fontWeight:900, color:T.gold}}>₹{course.price.toLocaleString()}</span>
              <span style={{fontSize:".75rem", color:T.text3, textDecoration:"line-through"}}>₹{course.originalPrice.toLocaleString()}</span>
              <span style={{fontSize:".68rem", fontWeight:800, color:T.green, background:"rgba(74,222,128,.1)", padding:"1px 6px", borderRadius:4}}>{disc}% off</span>
            </div>
          )}
          <button
            className={course.enrolled?(course.progress===100?"btn-ghost btn-prim":"btn-prim"):"btn-teal"}
            style={{fontSize:".76rem", padding:"8px 16px", flexShrink:0}}
            onClick={e => { e.stopPropagation(); if(course.enrolled) navigate(`/learn/${course.id}`); else onOpen(course); }}>
            <span className="sh" />
            {course.enrolled?(course.progress===100?"View Cert":"Continue →"):"Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
COURSE MODAL COMPONENT
══════════════════════════════════════ */
function CourseModal({course, onClose, enrolled: isEnrolled}) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const disc = course.originalPrice > course.price ? Math.round((1 - course.price / course.originalPrice) * 100) : 0;

  const handleEnroll = () => {
    onClose();
    navigate(`/enroll/${course.id}`);
  };

  const handleWishlist = () => {
    const list = JSON.parse(localStorage.getItem("wishlist_courses") || "[]");
    const idx = list.indexOf(String(course.id));
    if (idx === -1) list.push(String(course.id)); else list.splice(idx, 1);
    localStorage.setItem("wishlist_courses", JSON.stringify(list));
    setWishlisted(idx === -1);
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Hero */}
        <div style={{height:200, background:course.gradient, position:"relative", overflow:"hidden", borderRadius:"24px 24px 0 0"}}>
          {course.thumbnail && <img src={course.thumbnail} alt={course.title} style={{position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0}}/>}
          <div style={{position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 80% at 30% 50%,${course.accentGlow},transparent)`, zIndex:1}} />
          <div style={{position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.75))", zIndex:1}} />
          {!course.thumbnail && <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1}}>
            <span style={{fontSize:"5rem", opacity:.12, filter:"blur(2px)"}}>{course.icon}</span>
          </div>}
          <div style={{position:"absolute", bottom:20, left:24, zIndex:2}}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
              <span style={{fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:course.accent, background:`${course.accent}22`, padding:"3px 9px", borderRadius:6, border:`1px solid ${course.accent}44`}}>{course.category}</span>
              <BadgeChip text={course.badge} />
              <span style={{fontSize:".68rem", padding:"3px 8px", borderRadius:6, background:"rgba(0,0,0,.5)", color:T.text2, border:"1px solid rgba(255,255,255,.08)"}}>{course.level}</span>
            </div>
            <div className="ff" style={{fontSize:"1.35rem", fontWeight:900, letterSpacing:"-.04em", lineHeight:1.2, color:T.text, maxWidth:500}}>{course.title}</div>
          </div>
          <button onClick={onClose} style={{position:"absolute", top:16, right:16, zIndex:3, width:36, height:36, borderRadius:10, border:"1px solid rgba(255,255,255,.18)", background:"rgba(0,0,0,.5)", color:T.text, cursor:"pointer", backdropFilter:"blur(8px)", fontSize:"1rem", display:"grid", placeItems:"center", transition:"all .2s"}}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.12)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,.5)"}>✕</button>
        </div>

        {/* Content */}
        <div style={{padding:24, display:"flex", flexDirection:"column", gap:20}}>
          {/* Stats row */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.bord, borderRadius:13, overflow:"hidden"}}>
            {[
              {l:"Rating", v:`${course.rating} ★`, col:T.gold},
              {l:"Reviews", v:course.reviews?.toLocaleString?.() || "0", col:T.text},
              {l:"Students", v:`${((course.students||0)/1000).toFixed(0)}k`, col:T.teal},
              {l:"Duration", v:course.duration || "—", col:T.text}
            ].map(({l, v, col}) => (
              <div key={l} style={{padding:"12px 14px", background:T.card, textAlign:"center"}}>
                <div className="ff" style={{fontSize:"1.1rem", fontWeight:900, color:col}}>{v}</div>
                <div style={{fontSize:".62rem", textTransform:"uppercase", letterSpacing:".08em", color:T.text3, marginTop:3, fontWeight:700}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div style={{display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:14, background:"rgba(255,255,255,.025)", border:`1px solid ${T.bord}`}}>
            <div className="av" style={{width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${course.accent}33,${course.accent}55)`, border:`1px solid ${course.accent}44`, color:course.accent, fontSize:".85rem", fontWeight:900}}>{course.instructorAvatar || "AD"}</div>
            <div>
              <div style={{fontSize:".9rem", fontWeight:700}}>{course.instructor}</div>
              <div style={{fontSize:".75rem", color:T.text3, marginTop:2}}>{course.instructorTitle}</div>
            </div>
            <div style={{marginLeft:"auto", textAlign:"right"}}>
              <div style={{fontSize:".75rem", color:T.text2}}>Updated: {course.updated}</div>
              <div style={{fontSize:".72rem", color:T.text3, marginTop:2}}>{course.lang}</div>
            </div>
          </div>

          {/* Description */}
          {course.description && <div>
            <div style={{fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:9}}>About This Course</div>
            <div style={{fontSize:".86rem", color:T.text2, lineHeight:1.7}}>{course.description}</div>
          </div>}

          {/* Outcomes */}
          {course.outcomes?.filter(Boolean).length > 0 && <div>
            <div style={{fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10}}>What You'll Learn</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
              {course.outcomes.filter(Boolean).map((o, i) => (
                <div key={i} style={{display:"flex", alignItems:"flex-start", gap:9, padding:"9px 12px", borderRadius:10, background:"rgba(255,255,255,.025)", border:`1px solid ${T.bord}`}}>
                  <span style={{color:T.green, flexShrink:0, marginTop:1}}>✓</span>
                  <span style={{fontSize:".8rem", color:T.text2}}>{o}</span>
                </div>
              ))}
            </div>
          </div>}

          {/* Tags */}
          {course.tags?.length > 0 && <div>
            <div style={{fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:9}}>Skills You'll Gain</div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
              {course.tags.map(tag => <span key={tag} className="tag" style={{fontSize:".74rem", padding:"4px 11px"}}>{tag}</span>)}
            </div>
          </div>}

          {/* CTA */}
          {isEnrolled ? (
            <div style={{padding:"16px 18px", borderRadius:14, background:`linear-gradient(135deg,${course.accent}0d,rgba(0,0,0,0))`, border:`1px solid ${course.accent}33`}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
                <div style={{fontSize:".85rem", fontWeight:700}}>Your Progress</div>
                <div className="ff" style={{fontSize:"1rem", fontWeight:900, color:course.progress===100?T.green:T.gold}}>{course.progress}%</div>
              </div>
              <ProgressBar pct={course.progress} gradient={course.progress===100?G.green:G.gold} h={7} />
              <button className="btn-prim" style={{marginTop:14, width:"100%", justifyContent:"center"}} onClick={() => { onClose(); navigate(`/learn/${course.id}`); }}>
                ▶ Continue Learning
              </button>
            </div>
          ) : (
            <div style={{padding:"18px", borderRadius:14, background:"rgba(240,165,0,.05)", border:"1px solid rgba(240,165,0,.18)"}}>
              <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:14}}>
                <div className="ff" style={{fontSize:"1.6rem", fontWeight:900, color:T.gold}}>{course.price===0?"FREE":`₹${course.price.toLocaleString()}`}</div>
                {course.originalPrice > course.price && <>
                  <div style={{fontSize:".85rem", color:T.text3, textDecoration:"line-through"}}>₹{course.originalPrice.toLocaleString()}</div>
                  <span style={{padding:"3px 9px", borderRadius:6, background:"rgba(74,222,128,.12)", color:T.green, fontSize:".72rem", fontWeight:800}}>{disc}% OFF</span>
                </>}
              </div>
              <div style={{display:"flex", gap:10}}>
                <button className="btn-prim" style={{flex:1, justifyContent:"center"}} onClick={handleEnroll}>
                  <span className="sh"/>🚀 {course.price===0?"Enroll Free":"Enroll Now"}
                </button>
                <button onClick={handleWishlist} style={{padding:"9px 16px", borderRadius:11, border:`1px solid ${wishlisted?"rgba(240,32,121,.4)":"rgba(255,255,255,.1)"}`, background:wishlisted?"rgba(240,32,121,.1)":"transparent", color:wishlisted?"#f02079":T.text2, cursor:"pointer", fontSize:".82rem", transition:"all .2s", fontFamily:"'Satoshi',sans-serif"}}>
                  {wishlisted?"♥ Saved":"♡ Wishlist"}
                </button>
              </div>
              <div style={{fontSize:".72rem", color:T.text3, marginTop:10, textAlign:"center"}}>30-day money-back guarantee · Lifetime access · Certificate included</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
MAIN COURSES PAGE COMPONENT
══════════════════════════════════════ */
export default function CoursesPage() {
  const bgRef = useRef(null);
  const navigate = useNavigate();
  useBg(bgRef);

  const [activeNav, setActiveNav] = useState("courses");
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [showEnrolled, setShowEnrolled] = useState("enrolled");
  const [modal, setModal] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  // Fetch real enrolled IDs from DB
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    enrollmentAPI.getMyEnrollments()
      .then(res => {
        const ids = new Set((res.data?.data || []).map(e => String(e.course?._id || e.courseId)));
        setEnrolledIds(ids);
      })
      .catch(() => {});
  }, []);

  // Fetch courses from student panel backend
  useEffect(() => {
    fetch("http://localhost:5001/api/courses")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.length > 0) {
          const adminCourses = d.data
            .filter(c => c.status === "published")
            .map(c => ({
              id:           c._id,
              title:        c.title,
              instructor:   typeof c.instructor === "object" ? c.instructor?.name || "Admin" : "Admin",
              instructorAvatar: "AD",
              instructorTitle: "Development · Expert Instructor",
              category:     c.category || "Development",
              level:        c.level || "Beginner",
              duration:     c.duration || "—",
              lessons:      c.curriculum?.reduce((a,s) => a + (s.lessons?.length||0), 0) || 0,
              rating:       c.rating || 0,
              reviews:      0,
              students:     c.enrolledStudents || 0,
              price:        c.price || 0,
              originalPrice: c.originalPrice || c.price || 0,
              tags:         Array.isArray(c.tags) ? c.tags : [],
              description:  c.description || "",
              thumbnail:    c.thumbnail || "",
              gradient:     c.bg || "linear-gradient(135deg,#0a1830,#130840)",
              accentGlow:   c.accentGlow || "rgba(124,47,255,.28)",
              accent:       c.accent || "#7c2fff",
              icon:         c.emoji || "📘",
              badge:        c.badge || "New",
              progress:     0,
              nextLesson:   "",
              certificate:  false,
              outcomes:     Array.isArray(c.outcomes) ? c.outcomes : [],
              updated:      new Date(c.updatedAt).toLocaleDateString("en-IN", {month:"short", year:"numeric"}),
              lang:         c.language || "Hindi + English",
            }));
          setAllCourses([...adminCourses]);
        }
      })
      .catch(() => {});
  }, []);

  const visible = allCourses.filter(c => {
    const isEnrolled = enrolledIds.has(String(c.id));
    if (search && (!c.title.toLowerCase().includes(search.toLowerCase()) &&
        !c.instructor.toLowerCase().includes(search.toLowerCase()) &&
        !c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))) return false;
    if (cat !== "All" && c.category !== cat) return false;
    if (level !== "All Levels" && c.level !== level) return false;
    if (showEnrolled === "enrolled" && !isEnrolled) return false;
    if (showEnrolled === "explore" && isEnrolled) return false;
    return true;
  });

  const enrolled = allCourses.filter(c => enrolledIds.has(String(c.id)));
  const inProgress = enrolled.filter(c => c.progress > 0 && c.progress < 100);
  const completed = enrolled.filter(c => c.progress === 100);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: T.bg,
      color: T.text,
      fontFamily: "Satoshi,sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>
      <style>{CSS}</style>
      <Cursor />

      {/* BG Canvas */}
      <canvas ref={bgRef} style={{position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none"}} />

      {/* Noise */}
      <div style={{
        position: "fixed",
        inset: "-50%",
        zIndex: 1,
        pointerEvents: "none",
        opacity: .018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        animation: "noise 8s steps(10) infinite"
      }} />

      {/* SIDEBAR */}
      <div style={{position: "relative", zIndex: 50, flexShrink: 0}}>
        <Sidebar collapsed={sideCollapsed} setCollapsed={setSideCollapsed} />
      </div>

      {/* MAIN */}
      <div style={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 10}}>
        <TopBar
          title={<>My <em style={{ fontStyle: "italic", color: T.gold }}>Courses</em></>}
          collapsed={sideCollapsed}
          setCollapsed={setSideCollapsed}
        >
          <div className="search-wrap">
            <span style={{color: T.text3, fontSize: ".9rem", flexShrink: 0}}>🔍</span>
            <input className="search-inp" placeholder="Search courses, instructors, topics…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <span style={{cursor: "pointer", color: T.text3, fontSize: ".8rem"}} onClick={() => setSearch("")}>✕</span>}
          </div>
          <div style={{display: "flex", gap: 4}}>
            <button className={`v-btn${view === "grid" ? " on" : ""}`} onClick={() => setView("grid")}>⊞</button>
            <button className={`v-btn${view === "list" ? " on" : ""}`} onClick={() => setView("list")}>☰</button>
          </div>
        </TopBar>

        {/* SCROLLABLE CONTENT */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          scrollbarWidth: "thin",
          scrollbarColor: "#0f1e38 transparent",
          position: "relative",
          zIndex: 1
        }}>
          {/* STATS STRIP */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
            marginBottom: 24,
            animation: "fadeUp .6s .05s both"
          }}>
            {[
              {ico: "📚", val: COURSES.length, lbl: "Total Courses", sub: "Across all categories", col: T.gold, g: G.gold},
              {ico: "▶", val: inProgress.length, lbl: "In Progress", sub: "Keep going!", col: T.teal, g: G.teal},
              {ico: "🏅", val: completed.length, lbl: "Completed", sub: "+1 certificate", col: T.green, g: G.green},
              {ico: "⭐", val: "4.85", lbl: "Avg Rating", sub: "Based on your courses", col: T.purple, g: G.purple},
            ].map(({ico, val, lbl, sub, col, g}) => (
              <div 
                key={lbl} 
                style={{
                  background: T.card,
                  border: `1px solid ${T.bord}`,
                  borderRadius: 16,
                  padding: "16px 18px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color .3s,transform .25s",
                  cursor: "pointer"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(240,165,0,.18)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.bord;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(circle,${col}18,transparent 70%)`,
                  pointerEvents: "none"
                }} />
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${col}18`,
                  border: `1px solid ${col}33`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1rem",
                  marginBottom: 10
                }}>{ico}</div>
                <div className="ff" style={{fontSize: "1.7rem", fontWeight: 900, letterSpacing: "-.06em", lineHeight: 1, color: col}}>{val}</div>
                <div style={{fontSize: ".72rem", fontWeight: 700, color: T.text, marginTop: 4}}>{lbl}</div>
                <div style={{fontSize: ".68rem", color: T.text3, marginTop: 2}}>{sub}</div>
                <div style={{position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: g, opacity: .6}} />
              </div>
            ))}
          </div>

          {/* CONTINUE LEARNING */}
          {inProgress.length > 0 && (
            <div style={{marginBottom: 24, animation: "fadeUp .6s .1s both"}}>
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14}}>
                <div className="ff" style={{fontSize: "1rem", fontWeight: 800, letterSpacing: "-.04em"}}>Continue Learning</div>
                <button className="btn-ghost" style={{fontSize: ".75rem", padding: "6px 14px"}}>View all →</button>
              </div>
              <div style={{display: "grid", gridTemplateColumns: `repeat(${Math.min(inProgress.length, 3)}, 1fr)`, gap: 14}}>
                {inProgress.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setModal(c)} 
                    style={{
                      background: `linear-gradient(135deg, ${T.card}, ${c.accent}0d)`,
                      border: `1px solid ${c.accent}33`,
                      borderRadius: 16,
                      padding: "16px",
                      cursor: "pointer",
                      transition: "all .25s",
                      display: "flex",
                      gap: 14,
                      alignItems: "center"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.borderColor = `${c.accent}55`;
                      e.currentTarget.style.boxShadow = "0 14px 35px rgba(0,0,0,.5)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.borderColor = `${c.accent}33`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      width: 50,
                      height: 50,
                      borderRadius: 13,
                      background: c.gradient,
                      display: "grid",
                      placeItems: "center",
                      fontSize: "1.5rem",
                      flexShrink: 0
                    }}>{c.icon}</div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: ".83rem", fontWeight: 700, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{c.title}</div>
                      <div style={{fontSize: ".7rem", color: T.text3, marginBottom: 7}}>Next: {c.nextLesson}</div>
                      <ProgressBar pct={c.progress} gradient={G.gold} h={4} />
                      <div style={{display: "flex", justifyContent: "space-between", fontSize: ".68rem", color: T.text3, marginTop: 4}}>
                        <span style={{color: T.gold, fontWeight: 700}}>{c.progress}% complete</span>
                        <span>{c.duration}</span>
                      </div>
                    </div>
                    <button className="btn-prim" style={{fontSize: ".72rem", padding: "8px 12px", flexShrink: 0}}>
                      <span className="sh" />
                      ▶
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILTERS BAR */}
          <div style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 18,
            animation: "fadeUp .6s .15s both"
          }}>
            {/* Enrolled filter */}
            <div style={{display: "flex", gap: 5, background: T.card, padding: "5px", borderRadius: 11, border: `1px solid ${T.bord}`}}>
              {[
                {v: "all", l: "All Courses"},
                {v: "enrolled", l: "My Enrolled"},
                {v: "explore", l: "Explore New"}
              ].map(({v, l}) => (
                <button 
                  key={v} 
                  className={`f-pill${showEnrolled === v ? " on" : ""}`} 
                  style={{padding: "5px 14px", borderRadius: 8}} 
                  onClick={() => setShowEnrolled(v)}
                >
                  {l}
                </button>
              ))}
            </div>

            <div style={{width: 1, height: 28, background: T.bord}} />

            {/* Category */}
            <div style={{display: "flex", gap: 5, flexWrap: "wrap"}}>
              {CATEGORIES.map(c => (
                <button 
                  key={c} 
                  className={`f-pill${cat === c ? " on" : ""}`} 
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* LEVEL + SORT */}
          <div style={{display: "flex", gap: 10, alignItems: "center", marginBottom: 20, animation: "fadeUp .6s .2s both"}}>
            <div style={{display: "flex", gap: 5}}>
              {LEVELS.map(l => (
                <button 
                  key={l} 
                  className={`f-pill${level === l ? " on" : ""}`} 
                  style={{padding: "5px 12px", fontSize: ".74rem"}} 
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
            <div style={{flex: 1}} />
            {/* Results count */}
            <div style={{fontSize: ".78rem", color: T.text3, whiteSpace: "nowrap"}}>
              {visible.length} course{visible.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* COURSES GRID */}
          {visible.length === 0 ? (
            <div style={{textAlign: "center", padding: "60px 20px", animation: "fadeIn .5s ease both"}}>
              <div style={{fontSize: "3rem", marginBottom: 12, opacity: .4}}>{showEnrolled==="enrolled"?"📚":"🔍"}</div>
              <div className="ff" style={{fontSize: "1.2rem", fontWeight: 800, color: T.text2, marginBottom: 8}}>
                {showEnrolled==="enrolled" ? "No enrolled courses yet" : "No courses found"}
              </div>
              <div style={{fontSize: ".85rem", color: T.text3, marginBottom: 20}}>
                {showEnrolled==="enrolled" ? "Go to Explore and enroll in a course to get started!" : "Try adjusting your filters or search term"}
              </div>
              {showEnrolled==="enrolled" ? (
                <button className="btn-prim" onClick={() => navigate("/explore")}>
                  <span className="sh"/>🔍 Explore Courses
                </button>
              ) : (
                <button className="btn-ghost" onClick={() => { setSearch(""); setCat("All"); setLevel("All Levels"); setShowEnrolled("enrolled"); }}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 18,
              animation: "fadeIn .4s ease both"
            }}>
              {visible.map((c, i) => (
                <CourseCard key={c.id} course={c} idx={i} onOpen={setModal} enrolled={enrolledIds.has(String(c.id))} />
              ))}
            </div>
          )}

          {/* Recommended For You */}
          {showEnrolled !== "explore" && (
            <div style={{marginTop: 36, animation: "fadeUp .6s .3s both"}}>
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16}}>
                <div>
                  <div className="ff" style={{fontSize: "1rem", fontWeight: 800, letterSpacing: "-.04em"}}>Recommended For You</div>
                  <div style={{fontSize: ".75rem", color: T.text3, marginTop: 2}}>Based on your learning history</div>
                </div>
                <button className="btn-ghost" style={{fontSize: ".75rem", padding: "6px 14px"}}>Browse all →</button>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14}}>
                {COURSES.filter(c => !c.enrolled).slice(0, 3).map((c, i) => (
                  <div 
                    key={c.id} 
                    onClick={() => setModal(c)} 
                    style={{
                      background: T.card,
                      border: `1px solid ${T.bord}`,
                      borderRadius: 16,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all .28s",
                      animation: `fadeUp .5s ${i * .08}s both`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(240,165,0,.2)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 18px 45px rgba(0,0,0,.5)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = T.bord;
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{height: 80, background: c.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
                      <div style={{position: "absolute", inset: 0, background: `radial-gradient(circle, ${c.accentGlow}, transparent)`}} />
                      <span style={{fontSize: "2rem", position: "relative", zIndex: 1}}>{c.icon}</span>
                      <div style={{position: "absolute", top: 8, right: 8}}>
                        <BadgeChip text={c.badge} />
                      </div>
                    </div>
                    <div style={{padding: "13px 15px"}}>
                      <div style={{fontSize: ".6rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: c.accent, marginBottom: 5}}>{c.category}</div>
                      <div className="ff" style={{fontSize: ".88rem", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.3, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"}}>{c.title}</div>
                      <div style={{display: "flex", alignItems: "center", gap: 6, marginBottom: 10}}>
                        <Stars rating={c.rating} />
                        <span style={{fontSize: ".7rem", color: T.text3}}>{c.rating} ({c.reviews.toLocaleString()})</span>
                      </div>
                      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <div className="ff" style={{fontSize: "1rem", fontWeight: 900, color: T.gold}}>₹{c.price.toLocaleString()}</div>
                        <button className="btn-teal" style={{fontSize: ".72rem", padding: "6px 13px"}}>Enroll</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{height: 40}} />
        </div>
      </div>

      {/* MODAL */}
      {modal && <CourseModal course={modal} onClose={() => setModal(null)} enrolled={enrolledIds.has(String(modal.id))} />}
    </div>
  );
}
