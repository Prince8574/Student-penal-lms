import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";
import "./Assignments.css";
import { T, COURSES_FILTER } from "./utils/constants";
import { useBg } from "./hooks/useBackground";
import Cursor from "./components/Cursor";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import AssignCard from "./components/AssignCard";
import RightPanel from "./components/RightPanel";
import API_BASE from '../../config/api';

const API_URL = `${API_BASE}/api`;

/* ══════════════════════════════CSS══════════════════════════════ */
const CSS = `
.cur-d{pointer-events:none;position:fixed;z-index:9999;border-radius:50%;transform:translate(-50%,-50%)}
.cur-r{pointer-events:none;position:fixed;z-index:9998;border-radius:50%;transform:translate(-50%,-50%)}
`;

/* ══════════════════════════════MAIN PAGE══════════════════════════════ */
export default function AssignmentsPage() {
  const bgRef      = useRef(null);
  const statsRef   = useRef(null);
  const filterRef  = useRef(null);
  const listRef    = useRef(null);
  const rightRef   = useRef(null);
  const topBarRef  = useRef(null);

  useBg(bgRef);
  const [collapsed, setCollapsed] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [sortBy, setSortBy] = useState("Due Date");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  // GSAP entrance — runs once after data loads
  useEffect(function() {
    if (loading) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (statsRef.current)
      tl.fromTo(statsRef.current.children,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0);
    if (filterRef.current)
      tl.fromTo(filterRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 }, 0.3);
    if (rightRef.current)
      tl.fromTo(rightRef.current,
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.55 }, 0.1);
  }, [loading]);

  // GSAP re-animate list on filter change
  useEffect(function() {
    if (!listRef.current || loading) return;
    var cards = listRef.current.children;
    if (!cards.length) return;
    gsap.fromTo(cards,
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.38, stagger: 0.055, ease: "power2.out" });
  }, [filter, courseFilter, search, loading]);

  // Fetch assignments from backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to view assignments');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/assignments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const COURSE_COLORS = ["#f0a500","#00d4aa","#a78bfa","#3b82f6","#4ade80","#f472b6","#60a5fa","#f59e0b"];
          const COURSE_ICONS  = {
            "Data Structures & Algorithms":"🧮","Machine Learning Fundamentals":"🤖",
            "Database Management Systems":"🗄️","Operating Systems":"💻","Computer Networks":"🌐",
            "Full Stack Web Development":"🌍","AWS Solutions Architect":"☁️","UI/UX Design":"🎨",
          };
          const COURSES_LIST = Object.keys(COURSE_ICONS);
          const enriched = response.data.data.map((a, i) => {
            const course = a.course || '';
            const ci = COURSES_LIST.indexOf(course);
            return Object.assign({}, a, {
              course,
              courseColor:   a.courseColor   || COURSE_COLORS[ci >= 0 ? ci : i % COURSE_COLORS.length],
              courseIcon:    a.courseIcon    || COURSE_ICONS[course] || '📋',
              status:        a.status        || 'pending',
              type:          a.type          || 'Assignment',
              title:         a.title         || 'Untitled',
              desc:          a.desc          || a.description || '',
              points:        a.points        || 100,
              dueDate:       a.dueDate       || '',
              dueTime:       a.dueTime       || '11:59 PM',
              requirements:  Array.isArray(a.requirements) ? a.requirements : [],
              rubric:        Array.isArray(a.rubric)        ? a.rubric        : [],
              allowedTypes:  Array.isArray(a.allowedTypes)  ? a.allowedTypes  : ['.pdf', '.zip', '.docx'],
              estimatedTime: a.estimatedTime || '—',
            });
          });
          setAssignments(enriched);
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(err.response?.data?.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleOpen = (a) => {
    // kept for compatibility — AssignCard now navigates directly
  };

  const handleSubmit = async (id, files) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await axios.post(
        `${API_URL}/submissions/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: "submitted",
                  submittedAt: new Date().toLocaleString("en-IN"),
                  feedback: "Under review — results expected in 2 days",
                }
              : a
          )
        );
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert(err.response?.data?.message || 'Failed to submit assignment');
    }
  };

  const filtered = assignments
    .filter((a) => {
      if (filter === "pending" && a.status !== "pending") return false;
      if (filter === "submitted" && a.status !== "submitted") return false;
      if (filter === "graded" && a.status !== "graded") return false;
      if (filter === "overdue" && a.status !== "overdue") return false;
      if (courseFilter !== "All Courses" && a.course !== courseFilter) return false;
      if (
        search &&
        !a.title.toLowerCase().includes(search.toLowerCase()) &&
        !a.course?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Due Date") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "Points") return b.points - a.points;
      if (sortBy === "Course") return (a.course || "").localeCompare(b.course || "");
      return 0;
    });

  const counts = {
    all: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: T.bg,
        color: T.text,
        fontFamily: "Satoshi,sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{CSS}</style>
      <Cursor />
      {/* Background */}
      <canvas
        ref={bgRef}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />
      <div
        style={{
          position: "fixed",
          inset: "-50%",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.018,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: "noise 8s steps(10) infinite",
        }}
      />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 100,
          minWidth: 0,
        }}
      >
        {/* TOPBAR */}
        <TopBar
          title={<>My <em style={{ fontStyle: "italic", color: T.gold }}>Assignments</em></>}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        >
          {/* Search */}
          <div style={{ maxWidth: 360, flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.04)", border: `1px solid rgba(255,255,255,.07)`, borderRadius: 11, padding: "8px 13px" }}>
            <span style={{ color: T.text3, fontSize: ".85rem", flexShrink: 0 }}>🔍</span>
            <input placeholder="Search assignments…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: T.text, fontFamily: "inherit", fontSize: ".84rem", flex: 1 }} />
          </div>
          {/* Sort */}
          <div style={{ position: "relative" }}>
            <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".78rem" }} onClick={() => setSortOpen(s => !s)}>
              Sort: {sortBy} <span style={{ fontSize: ".6rem", opacity: 0.6 }}>▼</span>
            </button>
            {sortOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#0b1628", border: `1px solid rgba(255,255,255,.08)`, borderRadius: 12, padding: 5, zIndex: 100, minWidth: 160 }}>
                {["Due Date", "Points", "Course"].map(o => (
                  <div key={o} style={{ padding: "8px 12px", borderRadius: 8, fontSize: ".78rem", cursor: "pointer", color: sortBy === o ? T.gold : T.text2, fontWeight: sortBy === o ? 700 : 400 }}
                    onClick={() => { setSortBy(o); setSortOpen(false); }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {sortBy === o && "✓ "}{o}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TopBar>
        {/* BODY */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
          {/* MAIN SCROLL AREA */}
          <div className="main-scroll" style={{ flex: 1, padding: "22px 24px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontSize: "2.8rem", marginBottom: 12, opacity: 0.3 }}>⏳</div>
                <div className="ff" style={{ fontSize: "1.15rem", fontWeight: 800, color: T.text2 }}>
                  Loading assignments...
                </div>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontSize: "2.8rem", marginBottom: 12, opacity: 0.3 }}>⚠️</div>
                <div className="ff" style={{ fontSize: "1.15rem", fontWeight: 800, color: T.red, marginBottom: 6 }}>
                  {error}
                </div>
                <button className="btn-outline" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            ) : (
              <>
            {/* STATS */}
            <div
              ref={statsRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 13,
                marginBottom: 20,
              }}
            >
              {[
                {
                  ico: "📝",
                  val: counts.all,
                  lbl: "Total",
                  col: T.text2,
                  bg: "rgba(255,255,255,.04)",
                  bord: T.bord,
                },
                {
                  ico: "⏳",
                  val: counts.pending,
                  lbl: "Pending",
                  col: T.blue2,
                  bg: "rgba(59,130,246,.07)",
                  bord: "rgba(59,130,246,.18)",
                },
                {
                  ico: "✅",
                  val: counts.submitted,
                  lbl: "Submitted",
                  col: T.teal,
                  bg: "rgba(0,212,170,.07)",
                  bord: "rgba(0,212,170,.18)",
                },
                {
                  ico: "🏅",
                  val: counts.graded,
                  lbl: "Graded",
                  col: T.green,
                  bg: "rgba(74,222,128,.07)",
                  bord: "rgba(74,222,128,.18)",
                },
                {
                  ico: "⚠️",
                  val: counts.overdue,
                  lbl: "Overdue",
                  col: T.red,
                  bg: "rgba(239,68,68,.07)",
                  bord: "rgba(239,68,68,.18)",
                },
              ].map(({ ico, val, lbl, col, bg, bord }) => (
                <div
                  key={lbl}
                  style={{
                    background: bg,
                    border: `1px solid ${bord}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "transform .2s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  <div style={{ fontSize: "1rem", marginBottom: 7 }}>{ico}</div>
                  <div
                    className="ff"
                    style={{
                      fontSize: "1.7rem",
                      fontWeight: 900,
                      letterSpacing: "-.06em",
                      color: col,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: ".66rem",
                      fontWeight: 700,
                      color: T.text3,
                      marginTop: 4,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                    }}
                  >
                    {lbl}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: col,
                      opacity: 0.5,
                    }}
                  />
                </div>
              ))}
            </div>
            {/* FILTERS */}
            <div
              ref={filterRef}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  background: T.card,
                  padding: "5px",
                  borderRadius: 12,
                  border: `1px solid ${T.bord}`,
                }}
              >
                {[
                  { v: "all", l: "All" },
                  { v: "pending", l: "Pending" },
                  { v: "submitted", l: "Submitted" },
                  { v: "graded", l: "Graded" },
                  { v: "overdue", l: "⚠ Overdue" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    className={`f-pill${filter === v ? " on" : ""}`}
                    style={{ padding: "5px 14px", borderRadius: 8 }}
                    onClick={() => setFilter(v)}
                  >
                    {l}
                    {counts[v] > 0 && (
                      <span style={{ marginLeft: 5, fontSize: ".62rem", opacity: 0.7 }}>
                        ({counts[v]})
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {/* Course filter */}
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                style={{
                  background: T.card,
                  border: `1px solid ${T.bord}`,
                  borderRadius: 10,
                  padding: "7px 32px 7px 12px",
                  color: courseFilter !== "All Courses" ? T.gold : T.text2,
                  fontSize: ".78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Satoshi,sans-serif",
                  outline: "none",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233a4f6e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                {COURSES_FILTER.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <div style={{ fontSize: ".76rem", color: T.text3, marginLeft: "auto" }}>
                {filtered.length} assignment{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>
            {/* ASSIGNMENTS LIST */}
            {filtered.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "50px 20px" }}
              >
                <div style={{ fontSize: "2.8rem", marginBottom: 12, opacity: 0.3 }}>📝</div>
                <div
                  className="ff"
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: T.text2,
                    marginBottom: 6,
                  }}
                >
                  No assignments found
                </div>
                <div style={{ fontSize: ".84rem", color: T.text3, marginBottom: 16 }}>
                  Try a different filter
                </div>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                    setCourseFilter("All Courses");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                ref={listRef}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                }}
              >
                {filtered.map((a, i) => (
                  <AssignCard key={a.id} a={a} idx={i} onOpen={handleOpen} />
                ))}
              </div>
            )}
              </>
            )}
            <div style={{ height: 32 }} />
          </div>
          {/* RIGHT PANEL */}
          <div ref={rightRef} style={{ height: "100%", overflowY: "auto", scrollbarWidth: "none" }}>
            <RightPanel assignments={assignments} counts={counts} />
          </div>
        </div>
      </div>
    </div>
  );
}


