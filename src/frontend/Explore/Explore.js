import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentAPI } from "../../services/api";
import { CATEGORIES, PATHS, INSTRUCTORS, TRENDING_TOPICS } from "./data/exploreData";
import { T } from "./utils/designTokens";
import { useBg } from "./hooks/useBackground";
import Cursor from "./components/Cursor";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import CourseModal from "./components/CourseModal";
import PathCard from "./components/PathCard";
import PathModal from "./components/PathModal";
import { Stars, SectionLabel, ANum } from "./components/UIElements";
import "./Explore.css";

function ExploreCard({ course: c, idx, onOpen, enrolledIds }) {
  const navigate = useNavigate();
  const enrolled = enrolledIds.has(String(c.id));
  const disc = c.originalPrice > c.price ? Math.round((1 - c.price / c.originalPrice) * 100) : 0;
  return (
    <div onClick={() => onOpen(c)} style={{ background:"rgba(8,12,28,.97)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, overflow:"hidden", cursor:"pointer", transition:"all .3s", animationDelay:`${idx*.06}s`, animation:"fadeUp .5s ease both" }}
      onMouseOver={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.borderColor="rgba(124,47,255,.25)"; }}
      onMouseOut={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="rgba(255,255,255,.06)"; }}>
      {/* Thumb */}
      <div style={{ height:155, background:c.gradient||"linear-gradient(135deg,#0a1830,#130840)", position:"relative", overflow:"hidden" }}>
        {c.thumbnail
          ? <img src={c.thumbnail} alt={c.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:"3rem", opacity:.15 }}>{c.icon||"📘"}</span></div>
        }
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.7))" }}/>
        <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:5 }}>
          <span style={{ padding:"2px 8px", borderRadius:5, background:"rgba(124,47,255,.2)", border:"1px solid rgba(124,47,255,.35)", fontSize:".6rem", fontWeight:800, color:"#9d7fff" }}>{c.badge||"New"}</span>
        </div>
        <div style={{ position:"absolute", top:10, right:10, padding:"2px 7px", borderRadius:5, background:"rgba(0,0,0,.55)", fontSize:".62rem", color:"#8899b8", border:"1px solid rgba(255,255,255,.08)" }}>{c.level}</div>
      </div>
      {/* Body */}
      <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:".6rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:c.accent||"#7c2fff" }}>{c.category}</span>
          <span style={{ fontSize:".68rem", color:"#3a4f6e" }}>{c.duration} · {c.lessons||0} lessons</span>
        </div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:".92rem", fontWeight:900, letterSpacing:"-.03em", lineHeight:1.3, color:"#f0f6ff", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{c.title}</div>
        <div style={{ fontSize:".76rem", color:"#8899b8" }}>{c.instructor}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:".78rem", fontWeight:800, color:"#f0a500" }}>{c.rating||0}</span>
          <span style={{ fontSize:".68rem", color:"#3a4f6e" }}>({c.reviews||0})</span>
          <span style={{ marginLeft:"auto", fontSize:".68rem", color:"#3a4f6e" }}>{((c.students||0)/1000).toFixed(0)}k</span>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {(c.tags||[]).slice(0,3).map((t,i) => { const tag = typeof t === "object" ? (t.name||t.label||JSON.stringify(t)) : String(t); return <span key={i} style={{ padding:"2px 7px", borderRadius:5, fontSize:".62rem", background:"rgba(255,255,255,.05)", color:"#8899b8", border:"1px solid rgba(255,255,255,.06)" }}>{tag}</span>; })}
        </div>
        <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"2px 0" }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:"1rem", fontWeight:900, color:"#f0a500" }}>{c.price===0?"FREE":`₹${c.price.toLocaleString()}`}</span>
            {disc > 0 && <span style={{ fontSize:".68rem", color:"#3a4f6e", textDecoration:"line-through", marginLeft:6 }}>₹{c.originalPrice.toLocaleString()}</span>}
            {disc > 0 && <span style={{ fontSize:".62rem", fontWeight:800, color:"#4ade80", background:"rgba(74,222,128,.1)", padding:"1px 5px", borderRadius:4, marginLeft:4 }}>{disc}%</span>}
          </div>
          <button onClick={e => { e.stopPropagation(); if(enrolled) navigate(`/learn/${c.id}`); else navigate(`/enroll/${c.id}`); }}
            style={{ padding:"7px 14px", borderRadius:9, border:"none", background:enrolled?"linear-gradient(135deg,#7c2fff,#8b5cf6)":"linear-gradient(135deg,#00d4aa,#3b82f6)", color:"#030810", fontSize:".74rem", fontWeight:800, cursor:"pointer" }}>
            {enrolled ? "▶ Continue" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  console.log('🎯 Explore Page Rendering...');
  const navigate = useNavigate();
  
  const bgRef = useRef(null);
  
  // Background ko safely load karo
  try {
    useBg(bgRef);
  } catch (error) {
    console.error('Background loading error:', error);
  }

  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort] = useState("Most Popular");
  const [modal, setModal] = useState(null);
  const [pathModal, setPathModal] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [COURSES, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  // Fetch enrolled course IDs for current user
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

  // Fetch published courses from student panel backend
  useEffect(() => {
    fetch("http://localhost:5001/api/courses")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.length > 0) {
          const mapped = d.data
            .filter(c => c.status === "published" || c.isPublished === true)
            .map(c => ({
              id:               c._id,
              title:            c.title,
              instructor:       typeof c.instructor === "object" ? c.instructor?.name || "Admin" : "Admin",
              instructorAvatar: "AD",
              instructorTitle:  (c.category || "Development") + " · Expert Instructor",
              category:         c.category || "Development",
              level:            c.level || "Beginner",
              duration:         c.duration || "—",
              lessons:          c.curriculum?.reduce((a,s) => a + (s.lessons?.length||0), 0) || 0,
              rating:           c.rating || 0,
              reviews:          0,
              students:         c.enrolledStudents || 0,
              price:            c.price || 0,
              originalPrice:    c.originalPrice || c.price || 0,
              tags:             Array.isArray(c.tags) ? c.tags : [],
              description:      c.description || "",
              thumbnail:        c.thumbnail || "",
              gradient:         c.bg || "linear-gradient(135deg,#0a1830,#130840)",
              accentGlow:       c.accentGlow || "rgba(124,47,255,.28)",
              accent:           c.accent || "#7c2fff",
              icon:             c.emoji || "📘",
              badge:            c.badge || "New",
              progress:         0,
              nextLesson:       "",
              certificate:      false,
              outcomes:         Array.isArray(c.outcomes) ? c.outcomes : [],
              updated:          new Date(c.updatedAt).toLocaleDateString("en-IN",{month:"short",year:"numeric"}),
              lang:             c.language || "Hindi + English",
            }));
          setCourses([...mapped]);
        }
      })
      .catch(() => {});
  }, []);

  console.log('✅ Explore Page State Initialized');

  const SORT_OPTS = ["Most Popular", "Highest Rated", "Newest", "Price: Low to High"];

  const filteredCourses = COURSES.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) &&
        !c.instructor.toLowerCase().includes(search.toLowerCase()) &&
        !c.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCat !== "All" && c.category !== activeCat) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "Highest Rated") return b.rating - a.rating;
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Newest") return b.id - a.id;
    return b.students - a.students;
  });

  const suggestions = search
    ? COURSES.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: T.bg, color: T.text, fontFamily: "Satoshi,sans-serif", overflow: "hidden", position: "relative" }}>
      <Cursor />

      {/* BG */}
      <canvas ref={bgRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <div style={{
        position: "fixed",
        inset: "-50%",
        zIndex: 1,
        pointerEvents: "none",
        opacity: .018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        animation: "noise 8s steps(10) infinite"
      }} />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 100, minWidth: 0 }}>

        <TopBar
          title={<>Explore <em style={{ fontStyle: "italic", color: T.gold }}>Courses</em></>}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        >
          <div style={{ maxWidth: 360, flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.04)", border: `1px solid rgba(255,255,255,.07)`, borderRadius: 11, padding: "8px 13px" }}>
            <span style={{ color: T.text3, fontSize: ".85rem", flexShrink: 0 }}>🔍</span>
            <input placeholder="Quick search…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: T.text, fontFamily: "inherit", fontSize: ".84rem", flex: 1 }} />
          </div>
        </TopBar>

        {/* SCROLLABLE */}
        <div className="main-scroll">
          {/* HERO SECTION - Simplified for brevity */}
          <div style={{ position: "relative", overflow: "hidden", padding: "52px 28px 44px" }}>
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
              <h1 className="ff" style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-.06em", lineHeight: 1.12, marginBottom: 14 }}>
                Discover your next<br />
                <em style={{ fontStyle: "italic", color: T.gold }}>skill</em> to master
              </h1>
              <p style={{ fontSize: ".95rem", color: T.text2, lineHeight: 1.65, marginBottom: 30 }}>
                Explore industry-leading courses taught by experts from Google, Amazon, Microsoft and top startups.
              </p>

              {/* Hero Search */}
              <div style={{ position: "relative" }}>
                <div className="hero-search" style={{ margin: "0 auto" }}>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🔍</span>
                  <input
                    className="hero-inp"
                    placeholder="Search for React, Machine Learning, AWS, Python…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {search && <span onClick={() => setSearch("")} style={{ cursor: "pointer", color: T.text3, flexShrink: 0 }}>✕</span>}
                  <button className="btn-gold" style={{ flexShrink: 0, padding: "9px 20px" }}>
                    <span className="sh" />Search
                  </button>
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(580px,100%)",
                    background: "#0b1628",
                    border: `1px solid rgba(255,255,255,.08)`,
                    borderRadius: 14,
                    padding: 6,
                    zIndex: 100,
                    boxShadow: "0 20px 50px rgba(0,0,0,.6)",
                    animation: "popIn .2s cubic-bezier(.34,1.56,.64,1) both"
                  }}>
                    {suggestions.map(s => (
                      <div
                        key={s.id}
                        className="suggestion"
                        onClick={() => { setSearch(s.title); setShowSuggestions(false); }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ fontSize: ".84rem", fontWeight: 600 }}>{s.title}</div>
                          <div style={{ fontSize: ".7rem", color: T.text3 }}>{s.instructor} · {s.category}</div>
                        </div>
                        <span style={{ fontSize: ".7rem", color: T.text3 }}>{s.rating}★</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trending pills */}
              <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ fontSize: ".75rem", color: T.text3, alignSelf: "center" }}>Trending:</span>
                {TRENDING_TOPICS.slice(0, 6).map(({ t, e }) => (
                  <button key={t} className="topic-pill" onClick={() => setSearch(t)}>{e} {t}</button>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, maxWidth: 800, margin: "40px auto 0" }}>
              {[
                { ico: "📚", val: 1248, lbl: "Total Courses",        col: T.gold,   glow: "rgba(240,165,0,.1)" },
                { ico: "👨‍🏫", val: 186,  lbl: "Expert Instructors",  col: T.teal,   glow: "rgba(14,181,170,.1)" },
                { ico: "🏅", val: 94,   lbl: "Certificates",         col: T.purple, glow: "rgba(168,85,247,.1)" },
                { ico: "⭐", val: 4.8,  lbl: "Avg Rating",           col: T.gold,   glow: "rgba(240,165,0,.1)" },
              ].map(({ ico, val, lbl, col, glow }) => (
                <div key={lbl} className="stat-c" style={{ "--glow": glow }}>
                  <div style={{ fontSize: "1.1rem", marginBottom: 8 }}>{ico}</div>
                  <div className="ff" style={{ fontSize: "1.55rem", fontWeight: 900, letterSpacing: "-.06em", color: col, lineHeight: 1 }}>
                    <ANum target={typeof val === "number" ? val : 0} decimals={val % 1 !== 0 ? 1 : 0} suffix={val % 1 !== 0 ? "" : "+"} />
                  </div>
                  <div style={{ fontSize: ".68rem", fontWeight: 700, color: T.text3, marginTop: 4, textTransform: "uppercase", letterSpacing: ".07em" }}>{lbl}</div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: col, opacity: .5, borderRadius: "0 0 16px 16px" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "0 28px 60px" }}>
            {/* CATEGORIES */}
            <div style={{ marginBottom: 40 }}>
              <div className="sec-head">
                <div>
                  <SectionLabel>BROWSE BY TOPIC</SectionLabel>
                  <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em" }}>
                    Explore <em style={{ fontStyle: "italic", color: T.gold }}>Categories</em>
                  </div>
                </div>
                <button className="btn-outline" style={{ fontSize: ".78rem" }} onClick={() => navigate("/explore/categories")}>View all categories →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                {CATEGORIES.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="cat-card"
                    style={{ background: cat.g, animation: `cardIn .55s ${i * .05}s both`, minHeight: 130, cursor: "pointer" }}
                    onClick={() => setActiveCat(activeCat === cat.label ? "All" : cat.label)}
                  >
                    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 30% 40%,${cat.glow},transparent)`, pointerEvents: "none" }} />
                    <div className="cat-overlay" style={{ background: `linear-gradient(135deg,${cat.color}14,transparent)` }} />
                    {activeCat === cat.label && <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: `2px solid ${cat.color}`, pointerEvents: "none", zIndex: 3 }} />}
                    <div style={{ padding: "16px 14px", position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: 8, animation: "float 4s ease-in-out infinite" }}>{cat.icon}</div>
                      <div style={{ fontSize: ".85rem", fontWeight: 800, marginBottom: 3, lineHeight: 1.2 }}>{cat.label}</div>
                      <div style={{ fontSize: ".7rem", color: T.text2, marginBottom: 6 }}>{cat.desc}</div>
                      <div style={{ fontSize: ".68rem", fontWeight: 700, color: cat.color, background: `${cat.color}12`, padding: "2px 8px", borderRadius: 5, border: `1px solid ${cat.color}28`, display: "inline-block" }}>
                        {cat.count} courses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEARNING PATHS */}
            <div style={{ marginBottom: 40 }}>
              <div className="sec-head">
                <div>
                  <SectionLabel>STRUCTURED ROADMAPS</SectionLabel>
                  <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em" }}>
                    Learning <em style={{ fontStyle: "italic", color: T.gold }}>Paths</em>
                  </div>
                </div>
                <button className="btn-outline" style={{ fontSize: ".78rem" }}>All paths →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {PATHS.map((p, i) => <PathCard key={p.id} p={p} idx={i} onOpen={setPathModal} />)}
              </div>
            </div>

            {/* COURSE FILTER + GRID */}
            <div style={{ marginBottom: 40 }}>
              <div className="sec-head">
                <div>
                  <SectionLabel>ALL COURSES</SectionLabel>
                  <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em" }}>
                    {activeCat === "All" ? "All Courses" : <><em style={{ fontStyle: "italic", color: T.gold }}>{activeCat}</em> Courses</>}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
                  {["All", "Web Dev", "AI / ML", "Cloud", "Design", "DSA", "DevOps", "Data Science", "Mobile Dev"].map(c => (
                    <button key={c} className={`f-pill${activeCat === c ? " on" : ""}`} onClick={() => setActiveCat(c)}>{c}</button>
                  ))}
                </div>

                {/* Sort */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".77rem" }} onClick={() => setSortOpen(s => !s)}>
                    {sort} <span style={{ fontSize: ".6rem", opacity: .6 }}>▼</span>
                  </button>
                  {sortOpen && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      background: "#0b1628",
                      border: `1px solid rgba(255,255,255,.08)`,
                      borderRadius: 12,
                      padding: 5,
                      minWidth: 190,
                      zIndex: 100,
                      animation: "popIn .2s cubic-bezier(.34,1.56,.64,1) both",
                      boxShadow: "0 18px 45px rgba(0,0,0,.6)"
                    }}>
                      {SORT_OPTS.map(o => (
                        <div
                          key={o}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            fontSize: ".78rem",
                            cursor: "pointer",
                            color: sort === o ? T.gold : T.text2,
                            fontWeight: sort === o ? 700 : 400,
                            transition: "all .18s",
                            background: "transparent"
                          }}
                          onClick={() => { setSort(o); setSortOpen(false); }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.05)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {sort === o && "✓ "}{o}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: ".76rem", color: T.text3, flexShrink: 0 }}>
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
                </div>
              </div>

              {filteredCourses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px", animation: "fadeIn .4s ease both" }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 12, opacity: .35 }}>🔍</div>
                  <div className="ff" style={{ fontSize: "1.15rem", fontWeight: 800, color: T.text2, marginBottom: 8 }}>No courses found</div>
                  <div style={{ fontSize: ".84rem", color: T.text3, marginBottom: 18 }}>Try a different category or search term</div>
                  <button className="btn-outline" onClick={() => { setSearch(""); setActiveCat("All"); }}>Clear filters</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
                  {filteredCourses.map((c, i) => <ExploreCard key={c.id} course={c} idx={i} onOpen={setModal} enrolledIds={enrolledIds} />)}
                </div>
              )}
            </div>

            {/* TOP INSTRUCTORS */}
            <div style={{ marginBottom: 40 }}>
              <div className="sec-head">
                <div>
                  <SectionLabel>MEET THE EXPERTS</SectionLabel>
                  <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em" }}>
                    Top <em style={{ fontStyle: "italic", color: T.gold }}>Instructors</em>
                  </div>
                </div>
                <button className="btn-outline" style={{ fontSize: ".78rem" }}>All instructors →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {INSTRUCTORS.map((inst, i) => (
                  <div key={inst.id} className="inst-card" style={{ animation: `cardIn .55s ${i * .07}s both` }}>
                    <div style={{ position: "absolute", top: -16, right: -16, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${inst.color}14,transparent 70%)`, pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, position: "relative", zIndex: 1 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg,${inst.color}28,${inst.color}44)`, border: `1.5px solid ${inst.color}44`, display: "grid", placeItems: "center", fontSize: ".9rem", fontWeight: 900, color: inst.color, flexShrink: 0, letterSpacing: ".02em" }}>
                        {inst.av}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: ".9rem", fontWeight: 800, marginBottom: 2 }}>{inst.name}</div>
                        <div style={{ fontSize: ".72rem", color: T.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inst.title}</div>
                        <div style={{ fontSize: ".68rem", fontWeight: 700, color: inst.color, marginTop: 3 }}>{inst.spec}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: T.bord, borderRadius: 10, overflow: "hidden", marginBottom: 13, position: "relative", zIndex: 1 }}>
                      {[
                        { l: "Courses", v: inst.courses },
                        { l: "Students", v: `${(inst.students / 1000).toFixed(0)}k` },
                        { l: "Rating", v: `${inst.rating}★` }
                      ].map(({ l, v }) => (
                        <div key={l} style={{ padding: "9px 6px", background: "rgba(9,16,36,.95)", textAlign: "center" }}>
                          <div style={{ fontSize: ".88rem", fontWeight: 800, color: T.text }}>{v}</div>
                          <div style={{ fontSize: ".6rem", color: T.text3, textTransform: "uppercase", letterSpacing: ".07em", marginTop: 2, fontWeight: 700 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 1, marginBottom: 13, position: "relative", zIndex: 1 }}>
                      <Stars r={inst.rating} sz=".78rem" />
                    </div>
                    <button
                      className="btn-outline"
                      style={{ width: "100%", fontSize: ".78rem", padding: "8px 0", position: "relative", zIndex: 1 }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${inst.color}44`;
                        e.currentTarget.style.color = inst.color;
                        e.currentTarget.style.background = `${inst.color}0d`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
                        e.currentTarget.style.color = T.text2;
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      View Courses →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TRENDING TOPICS */}
            <div style={{ marginBottom: 40 }}>
              <div className="sec-head">
                <div>
                  <SectionLabel>WHAT'S HOT RIGHT NOW</SectionLabel>
                  <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em" }}>
                    Trending <em style={{ fontStyle: "italic", color: T.gold }}>Topics</em>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TRENDING_TOPICS.map(({ t, e }, i) => (
                  <button key={t} className="topic-pill" style={{ animation: `popIn .45s ${i * .04}s both` }} onClick={() => setSearch(t)}>
                    {e} {t}
                  </button>
                ))}
              </div>
            </div>

            {/* PROMO BANNER */}
            <div style={{
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              padding: "32px 36px",
              background: "linear-gradient(135deg,#0a1830 0%,#130840 50%,#0d1a28 100%)",
              border: "1px solid rgba(255,255,255,.07)",
              animation: "fadeUp .6s ease both",
              marginBottom: 8
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 70% at 15% 50%,rgba(240,165,0,.08),transparent),radial-gradient(ellipse 40% 60% at 85% 30%,rgba(0,212,170,.06),transparent)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: -20, right: 40, fontSize: "5rem", opacity: .06, animation: "float 5s ease-in-out infinite", pointerEvents: "none" }}>🎓</div>
              <div style={{ position: "absolute", bottom: -10, right: 120, fontSize: "3rem", opacity: .05, animation: "float 4s ease-in-out 1s infinite", pointerEvents: "none" }}>⚡</div>
              <div style={{ maxWidth: 540, position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 99, background: "rgba(240,165,0,.1)", border: "1px solid rgba(240,165,0,.2)", fontSize: ".68rem", fontWeight: 700, color: T.gold, marginBottom: 14, letterSpacing: ".06em" }}>
                  🔥 LIMITED TIME OFFER
                </div>
                <div className="ff" style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-.05em", marginBottom: 10, lineHeight: 1.2 }}>
                  Get <em style={{ fontStyle: "italic", color: T.gold }}>Pro Access</em> to all 1,200+ courses
                </div>
                <div style={{ fontSize: ".88rem", color: T.text2, lineHeight: 1.6, marginBottom: 20 }}>
                  Unlimited access to every course, certificate, and learning path. Cancel anytime. No hidden fees.
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn-gold" style={{ fontSize: ".88rem", padding: "12px 28px" }}>
                    <span className="sh" />🚀 Get Pro — ₹999/mo
                  </button>
                  <button className="btn-outline" style={{ fontSize: ".85rem" }}>View all plans →</button>
                  <span style={{ fontSize: ".75rem", color: T.text3 }}>7-day free trial · Cancel anytime</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                  {["✓ All 1,200+ courses", "✓ Offline downloads", "✓ Certificates included", "✓ Priority support"].map(f => (
                    <span key={f} style={{ fontSize: ".75rem", color: T.green, fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && <CourseModal c={modal} onClose={() => setModal(null)} enrolled={enrolledIds.has(String(modal.id))} />}
      {pathModal && <PathModal p={pathModal} onClose={() => setPathModal(null)} />}
    </div>
  );
}

