import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { enrollmentAPI } from "../../services/api";
import { T, G } from "../Explore/utils/designTokens";
import { Stars, BadgePill } from "../Explore/components/UIElements";
import { useBg } from "../Explore/hooks/useBackground";
import "../Explore/Explore.css";

// ── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({ pct, size, stroke, color }) {
  var r = (size - stroke) / 2;
  var circ = 2 * Math.PI * r;
  var dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={dash + " " + circ} strokeLinecap="round"
        style={{ transition: "stroke-dasharray .6s ease" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fill: T.t0, fontSize: size * 0.24, fontWeight: 800,
          transform: "rotate(90deg)", transformOrigin: "center" }}>
        {pct}%
      </text>
    </svg>
  );
}

// ── My Course Card — same design as Explore CourseCard + progress bar ─────────
function MyCoursesCard({ enrollment, idx }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(function() {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        setTimeout(function() { setVis(true); }, idx * 55);
        obs.disconnect();
      }
    }, { threshold: 0.07 });
    if (ref.current) obs.observe(ref.current);
    return function() { obs.disconnect(); };
  }, [idx]);

  var raw      = enrollment.course || {};
  var pct      = Math.round(enrollment.progress || 0);
  var accentMap = { "Web Dev":"#4F6EF7","AI / ML":"#A855F7","Cloud":"#38BDF8","Design":"#F472B6","DSA":"#34D399","Data Science":"#FBBF24","Mobile Dev":"#60A5FA","DevOps":"#0EB5AA" };
  var accent   = accentMap[raw.category] || "#4F6EF7";
  var title    = raw.title || "Untitled Course";
  var instructorName = typeof raw.instructor === "object" ? (raw.instructor?.name || "Instructor") : (raw.instructor || "Instructor");
  var initials = instructorName.split(" ").map(function(n){return n[0];}).join("").slice(0,2).toUpperCase();
  var category = raw.category || "Course";
  var level    = raw.level || "Beginner";
  var duration = raw.duration || "—";
  var lessons  = raw.curriculum ? raw.curriculum.reduce(function(a,s){return a+(s.lessons?.length||0);},0) : 0;
  var rating   = raw.rating || 0;
  var reviews  = raw.reviews || 0;
  var students = raw.enrolledStudents || 0;
  var tags     = Array.isArray(raw.tags) ? raw.tags.map(function(t){return typeof t==="object"?(t.name||""):String(t);}) : [];
  var thumbnail = raw.thumbnail || "";
  var bg       = raw.bg || ("linear-gradient(135deg,"+accent+"18,"+accent+"06)");
  var icon     = raw.emoji || "📘";
  var courseId = raw._id || enrollment.courseId;

  return (
    <div ref={ref} className="course-card"
      onClick={function() { navigate("/learn/"+courseId); }}
      style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(22px)", transition:"opacity .55s "+(idx*0.06)+"s, transform .55s "+(idx*0.06)+"s cubic-bezier(.4,0,.2,1)" }}>

      {/* Thumbnail */}
      <div style={{ height:168, background:bg, position:"relative", overflow:"hidden" }}>
        {thumbnail
          ? <img src={thumbnail} alt={title} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0 }}/>
          : <>
              <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 65% 80% at 30% 40%,"+accent+"28,transparent)" }}/>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:"3.2rem",opacity:.16,filter:"blur(1px)" }}>{icon}</span>
              </div>
              <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)",width:58,height:58,borderRadius:15,background:"linear-gradient(135deg,"+accent+"1a,"+accent+"36)",border:"1.5px solid "+accent+"44",display:"grid",placeItems:"center",backdropFilter:"blur(8px)",zIndex:2 }}>
                <span style={{ fontSize:"1.7rem" }}>{icon}</span>
              </div>
            </>
        }
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 35%,rgba(0,0,0,.7))",zIndex:1 }}/>
        {/* Progress bar at bottom */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,zIndex:3 }}>
          <div style={{ height:3,background:"rgba(0,0,0,.4)" }}>
            <div style={{ height:"100%",width:pct+"%",background:pct===100?"linear-gradient(90deg,#22c55e,#00d4aa)":"linear-gradient(90deg,#f0a500,#ff9d45)",transition:"width 1.5s ease" }}/>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:"15px 16px 17px",display:"flex",flexDirection:"column",gap:9,position:"relative",zIndex:2 }}>
        {/* Category + badges */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontSize:".62rem",fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",color:accent }}>{category}</span>
          <div style={{ display:"flex",gap:5,alignItems:"center" }}>
            <span style={{ padding:"2px 7px",borderRadius:5,background:"rgba(0,0,0,.35)",fontSize:".62rem",color:"#8899b8",border:"1px solid rgba(255,255,255,.08)" }}>{level}</span>
            <span style={{ fontSize:".68rem",color:"#3a4f6e" }}>— · {lessons||"—"} lessons</span>
          </div>
        </div>

        {/* Title */}
        <div className="ff" style={{ fontSize:".93rem",fontWeight:800,letterSpacing:"-.03em",lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{title}</div>

        {/* Instructor with avatar */}
        <div style={{ display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,"+accent+"33,"+accent+"55)",border:"1px solid "+accent+"44",display:"grid",placeItems:"center",fontSize:".65rem",fontWeight:900,color:accent,flexShrink:0 }}>{initials}</div>
          <div>
            <div style={{ fontSize:".78rem",fontWeight:600,color:"#f0f6ff" }}>{instructorName}</div>
            <div style={{ fontSize:".68rem",color:"#3a4f6e" }}>{category} · Expert Instructor</div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display:"flex",alignItems:"center",gap:7 }}>
          <span style={{ fontSize:".8rem",fontWeight:800,color:T.gold }}>{rating}</span>
          <Stars r={rating}/>
          <span style={{ fontSize:".7rem",color:T.text3 }}>({reviews.toLocaleString()})</span>
          <span style={{ marginLeft:"auto",fontSize:".68rem",color:T.text3 }}>{(students/1000).toFixed(0)}k</span>
        </div>

        {/* Tags */}
        <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
          {tags.slice(0,3).map(function(t){return <span key={t} className="tag">{t}</span>;})}
          {tags.length>3&&<span className="tag" style={{ color:T.text3 }}>+{tags.length-3}</span>}
        </div>

        <div style={{ height:1,background:T.bord,margin:"2px 0" }}/>

        {/* Progress ring + bar */}
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <ProgressRing pct={pct} size={46} stroke={4} color={pct===100?T.green:accent}/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:".75rem",color:T.t1,fontWeight:600,marginBottom:6 }}>
              {pct===100?"Course completed!":pct>0?"Keep going!":"Start learning"}
            </div>
            <div style={{ height:4,background:"rgba(255,255,255,.07)",borderRadius:10,overflow:"hidden" }}>
              <div style={{ height:"100%",width:pct+"%",background:pct===100?"linear-gradient(90deg,"+T.green+","+T.teal+")":"linear-gradient(90deg,"+accent+","+accent+"88)",borderRadius:10,transition:"width .6s ease" }}/>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <button onClick={function(e){e.stopPropagation();navigate("/learn/"+courseId);}}
          style={{ width:"100%",padding:"12px 0",borderRadius:50,border:"none",cursor:"pointer",
            background:pct===100?"linear-gradient(135deg,#22C55E,#0EB5AA)":"linear-gradient(135deg,#0EB5AA,#38BDF8)",
            color:"#030810",fontSize:".84rem",fontWeight:800,letterSpacing:".01em",transition:"all .18s" }}
          onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(14,181,170,.35)";}}
          onMouseLeave={function(e){e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
          {pct===100?"🏅 View Certificate":pct>0?"▶ Continue Course":"▶ Start Course"}
        </button>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  var navigate = useNavigate();
  return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:"3.5rem", marginBottom:16, opacity:.25 }}>
        {filter === "completed" ? "🏅" : filter === "in-progress" ? "▶" : "📚"}
      </div>
      <div style={{ fontSize:"1.05rem", fontWeight:800, color:T.t1, marginBottom:8 }}>
        {filter === "completed"   ? "No completed courses yet"   :
         filter === "in-progress" ? "No courses in progress"     : "You haven't enrolled yet"}
      </div>
      <div style={{ fontSize:".84rem", color:T.t2, marginBottom:24 }}>
        {filter === "all"
          ? "Explore our catalog and start your learning journey."
          : "Switch to 'All' to see all enrollments."}
      </div>
      {filter === "all" && (
        <button onClick={function() { navigate("/explore"); }}
          style={{ padding:"10px 24px", borderRadius:11, border:"none", cursor:"pointer",
            background:G.teal, color:"#030810", fontSize:".84rem", fontWeight:800 }}>
          Explore Courses →
        </button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyCourses() {
  var [collapsed, setCollapsed]     = useState(false);
  var [enrollments, setEnrollments] = useState([]);
  var [loading, setLoading]         = useState(true);
  var [filter, setFilter]           = useState("all");
  var [search, setSearch]           = useState("");

  var bgRef      = useRef(null);
  var headerRef  = useRef(null);
  var statsRef   = useRef(null);
  var gridRef    = useRef(null);

  // Three.js background
  try { useBg(bgRef); } catch(e) {}

  // GSAP entrance
  useEffect(function() {
    if (loading) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (statsRef.current) tl.fromTo(statsRef.current,  { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55 }, 0);
    if (gridRef.current)  tl.fromTo(gridRef.current,   { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6  }, 0.15);
  }, [loading]);

  useEffect(function() {
    enrollmentAPI.getMyEnrollments()
      .then(function(res) { setEnrollments(res.data && res.data.data ? res.data.data : []); })
      .catch(function() { setEnrollments([]); })
      .finally(function() { setLoading(false); });
  }, []);

  var filtered = enrollments.filter(function(e) {
    var p = e.progress || 0;
    var title = (e.course?.title || "").toLowerCase();
    var instructor = (typeof e.course?.instructor === "object" ? e.course?.instructor?.name : e.course?.instructor || "").toLowerCase();
    if (search && !title.includes(search.toLowerCase()) && !instructor.includes(search.toLowerCase())) return false;
    if (filter === "completed")   return p === 100;
    if (filter === "in-progress") return p > 0 && p < 100;
    return true;
  });

  var total     = enrollments.length;
  var completed = enrollments.filter(function(e) { return (e.progress || 0) === 100; }).length;
  var inProg    = enrollments.filter(function(e) { var p = e.progress||0; return p > 0 && p < 100; }).length;
  var avgPct    = total ? Math.round(enrollments.reduce(function(s,e) { return s + (e.progress||0); }, 0) / total) : 0;

  var stats = [
    { ico:"📚", val:total,          lbl:"Enrolled",     color:"#4F6EF7", glow:"rgba(79,110,247,.1)"  },
    { ico:"▶",  val:inProg,         lbl:"In Progress",  color:T.amber,   glow:"rgba(245,158,11,.1)"  },
    { ico:"🏅", val:completed,      lbl:"Completed",    color:T.green,   glow:"rgba(34,197,94,.1)"   },
    { ico:"📈", val:avgPct + "%",   lbl:"Avg Progress", color:T.teal,    glow:"rgba(14,181,170,.1)"  },
  ];

  var tabs = [
    { id:"all",          label:"All (" + total + ")"          },
    { id:"in-progress",  label:"In Progress (" + inProg + ")" },
    { id:"completed",    label:"Completed (" + completed + ")" },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", width:"100vw", background:T.bg,
      color:T.t0, fontFamily:"Satoshi,sans-serif", overflow:"hidden", position:"relative" }}>

      {/* Three.js background */}
      <canvas ref={bgRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, position:"relative", zIndex:10 }}>
        <TopBar
          title={<>My <em style={{ fontStyle:"italic", color:T.gold }}>Courses</em></>}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        >
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"7px 14px", minWidth:240 }}>
            <span style={{ color:"rgba(255,255,255,.3)", fontSize:".85rem" }}>🔍</span>
            <input
              value={search}
              onChange={function(e) { setSearch(e.target.value); }}
              placeholder="Search courses…"
              style={{ background:"none", border:"none", outline:"none", color:"#f0f6ff", fontFamily:"Satoshi,sans-serif", fontSize:".82rem", flex:1, minWidth:0 }}
            />
            {search && <span onClick={function(){setSearch("");}} style={{ cursor:"pointer", color:"rgba(255,255,255,.3)", fontSize:".75rem" }}>✕</span>}
          </div>
        </TopBar>

        <div style={{ flex:1, overflowY:"auto", padding:"28px 28px 60px", scrollbarWidth:"none" }}>

          {/* Stats strip */}
          <div ref={statsRef} style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:32 }}>
            {stats.map(function(s) {
              return (
                <div key={s.lbl} style={{ background:T.s1, border:"1px solid " + T.b0, borderRadius:16,
                  padding:"18px 20px", position:"relative", overflow:"hidden", transition:"border-color .2s" }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = s.color + "33"; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = T.b0; }}
                >
                  <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80,
                    borderRadius:"50%", background:s.glow, pointerEvents:"none" }} />
                  <div style={{ fontSize:"1.2rem", marginBottom:8 }}>{s.ico}</div>
                  <div style={{ fontSize:"1.6rem", fontWeight:900, color:s.color, letterSpacing:"-.04em", lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:".68rem", fontWeight:700, color:T.t3, textTransform:"uppercase",
                    letterSpacing:".08em", marginTop:5 }}>{s.lbl}</div>
                </div>
              );
            })}
          </div>

          {/* Filter tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            {tabs.map(function(tab) {
              var active = filter === tab.id;
              return (
                <button key={tab.id} onClick={function() { setFilter(tab.id); }}
                  style={{ padding:"8px 18px", borderRadius:10, cursor:"pointer", transition:"all .18s",
                    border:"1px solid " + (active ? T.teal : T.b1),
                    background: active ? "rgba(14,181,170,.1)" : "transparent",
                    color: active ? T.teal : T.t2,
                    fontSize:".8rem", fontWeight: active ? 700 : 500 }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Course grid */}
          {loading ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:18 }}>
              {[0,1,2,3,4,5].map(function(i) {
                return <div key={i} style={{ height:360, borderRadius:18, background:T.s1,
                  animation:"pulse 1.5s ease-in-out infinite", opacity:.5 }} />;
              })}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div ref={gridRef} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:18 }}>
              {filtered.map(function(e, i) {
                return <MyCoursesCard key={e._id || i} enrollment={e} idx={i} />;
              })}
            </div>
          )}
        </div>
      </div>

      <style>{"\n@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:.25} }\n"}</style>
    </div>
  );
}
