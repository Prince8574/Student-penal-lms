import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { ANum, SectionLabel } from "./UIElements";
import { T } from "../utils/designTokens";
import "./ExploreCategories.css";

const API = "http://localhost:5001/api";

// Category color map
const CAT_COLORS = {
  "Web Development":        T.blue,
  "Web Dev":                T.blue,
  "AI & Machine Learning":  T.purple,
  "AI / ML":                T.purple,
  "Cloud & DevOps":         T.cyan,
  "Cloud":                  T.cyan,
  "UI/UX Design":           T.pink,
  "Design":                 T.pink,
  "DSA & Algorithms":       T.lime,
  "DSA":                    T.lime,
  "Data Science":           T.gold,
  "Mobile Dev":             T.blue,
  "Cybersecurity":          T.rose,
  "DevOps":                 T.cyan,
};

const getColor = (name) =>
  CAT_COLORS[name] || T.purple;

const STAT_META = [
  { ico: "📚", lbl: "Total Courses",       col: T.gold,   glow: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240,165,0,.08), transparent)",   bar: "linear-gradient(90deg,#F59E0B,#F97316)", decimals: 0, suffix: "+" },
  { ico: "👨‍🏫", lbl: "Expert Instructors", col: T.teal,   glow: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,181,170,.08), transparent)",  bar: "linear-gradient(90deg,#0EB5AA,#4F6EF7)", decimals: 0, suffix: "+" },
  { ico: "🏅", lbl: "Certificates",        col: T.purple, glow: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,.08), transparent)",  bar: "linear-gradient(90deg,#A855F7,#F472B6)", decimals: 0, suffix: "+" },
  { ico: "⭐", lbl: "Avg Rating",          col: T.gold,   glow: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240,165,0,.08), transparent)",   bar: "linear-gradient(90deg,#F59E0B,#F97316)", decimals: 1, suffix: "" },
];

export default function ExploreCategories() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Real data state
  const [stats, setStats] = useState({ totalCourses: 0, instructors: 0, certificates: 0, avgRating: 0 });
  const [catBreakdown, setCatBreakdown] = useState([]);
  const [enrollments, setEnrollments] = useState({ total: 0, completionRate: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      // Student backend courses
      fetch(`${API}/courses`).then(r => r.json()).catch(() => ({ success: false, data: [] })),
      // Enrollments
      fetch(`${API}/enrollments`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
    ]).then(([studentCourses, enrollData]) => {
      const allCourses = (studentCourses.success && studentCourses.data)
        ? studentCourses.data.filter(c => c.status === "published")
        : [];

      // Total courses
      const totalCourses = allCourses.length;

      // Unique instructors
      const instructorSet = new Set();
      allCourses.forEach(c => {
        if (c.instructor) {
          const key = typeof c.instructor === "object"
            ? (c.instructor._id || c.instructor.name || JSON.stringify(c.instructor))
            : String(c.instructor);
          instructorSet.add(key);
        }
      });

      // Certificates = published courses with certificate flag
      const certificates = allCourses.filter(c => c.certificate !== false).length;

      // Avg rating
      const rated = allCourses.filter(c => c.rating > 0);
      const avgRating = rated.length
        ? (rated.reduce((s, c) => s + Number(c.rating), 0) / rated.length)
        : 0;

      setStats({
        totalCourses,
        instructors: instructorSet.size,
        certificates,
        avgRating: parseFloat(avgRating.toFixed(1)),
      });

      // Category breakdown — count courses per category
      const catMap = {};
      allCourses.forEach(c => {
        const cat = typeof c.category === "object"
          ? (c.category?.name || "Other")
          : (c.category || "Other");
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      const breakdown = Object.entries(catMap)
        .map(([label, count]) => ({ label, count, col: getColor(label) }))
        .sort((a, b) => b.count - a.count);
      setCatBreakdown(breakdown);

      // Enrollments
      const enrData = (enrollData.success && enrollData.data) ? enrollData.data : [];
      const completed = enrData.filter(e => e.status === "completed" || e.progress >= 100).length;
      setEnrollments({
        total: enrData.length,
        completionRate: enrData.length ? Math.round((completed / enrData.length) * 100) : 0,
      });

      setLoading(false);
    });
  }, []);

  const statValues = [
    stats.totalCourses,
    stats.instructors,
    stats.certificates,
    stats.avgRating,
  ];

  return (
    <div className="sako-wrap">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="sako-main">
        <TopBar
          title={<>Explore <em style={{ fontStyle: "italic", color: T.gold }}>Categories</em></>}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="sako-scroll">
          {/* Hero */}
          <div className="sako-hero">
            <h1>LearnVerse <em style={{ fontStyle: "italic", color: T.gold }}>by the numbers</em></h1>
            <p>Live platform stats — courses, instructors, certificates and more.</p>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="sako-stats">
              {STAT_META.map(({ lbl }) => (
                <div key={lbl} className="sako-stat-card sako-skeleton" />
              ))}
            </div>
          ) : (
            <div className="sako-stats">
              {STAT_META.map(({ ico, lbl, col, glow, bar, decimals, suffix }, i) => (
                <div key={lbl} className="sako-stat-card" style={{ "--glow": glow, animationDelay: `${i * 0.1}s` }}>
                  <span className="sako-stat-icon">{ico}</span>
                  <div className="sako-stat-val" style={{ color: col }}>
                    <ANum target={statValues[i]} decimals={decimals} suffix={suffix} />
                  </div>
                  <div className="sako-stat-lbl">{lbl}</div>
                  <div className="sako-stat-bar" style={{ background: bar }} />
                </div>
              ))}
            </div>
          )}

          {/* Breakdown */}
          <div style={{ maxWidth: 900, margin: "0 auto 16px" }}>
            <SectionLabel>BREAKDOWN</SectionLabel>
          </div>

          <div className="sako-details">
            {/* Courses by Category */}
            <div className="sako-detail-card" style={{ animationDelay: ".15s" }}>
              <h3>📂 Courses by Category</h3>
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="sako-skeleton" style={{ height: 32, borderRadius: 8, marginBottom: 4 }} />)
              ) : catBreakdown.length === 0 ? (
                <div style={{ fontSize: ".82rem", color: T.text3, padding: "12px 0" }}>No courses found</div>
              ) : (
                catBreakdown.map(({ label, count, col }) => (
                  <div key={label} className="sako-detail-row">
                    <span>{label}</span>
                    <span style={{ color: col }}>{count} course{count !== 1 ? "s" : ""}</span>
                  </div>
                ))
              )}
            </div>

            {/* Platform Facts */}
            <div className="sako-detail-card" style={{ animationDelay: ".2s" }}>
              <h3>🌐 Platform Facts</h3>
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="sako-skeleton" style={{ height: 32, borderRadius: 8, marginBottom: 4 }} />)
              ) : (
                [
                  { label: "Total Courses",      val: stats.totalCourses },
                  { label: "Instructors",         val: stats.instructors },
                  { label: "Enrolled Students",   val: enrollments.total },
                  { label: "Completion Rate",     val: `${enrollments.completionRate}%` },
                  { label: "Certificates",        val: stats.certificates },
                  { label: "Avg Rating",          val: stats.avgRating > 0 ? `${stats.avgRating} ⭐` : "—" },
                ].map(({ label, val }) => (
                  <div key={label} className="sako-detail-row">
                    <span>{label}</span>
                    <span>{val}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Browse by Topic */}
          <div style={{ maxWidth: 900, margin: "32px auto 0", paddingBottom: 48 }}>
            <SectionLabel>BROWSE BY TOPIC</SectionLabel>
            <div className="ff" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.04em", color: T.text, marginBottom: 20 }}>
              Explore <em style={{ fontStyle: "italic", color: T.gold }}>Categories</em>
            </div>

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="sako-skeleton" style={{ height: 80, borderRadius: 16 }} />
                ))}
              </div>
            ) : catBreakdown.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: T.text3, fontSize: ".9rem" }}>
                No categories found
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {catBreakdown.map(({ label, count, col }, i) => (
                  <div
                    key={label}
                    onClick={() => navigate("/explore")}
                    style={{
                      background: "rgba(8,12,28,.97)",
                      border: `1px solid ${col}22`,
                      borderRadius: 16,
                      padding: "18px 20px",
                      cursor: "pointer",
                      transition: "all .25s",
                      animationDelay: `${i * 0.07}s`,
                      animation: "cardIn .55s both",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = `${col}55`;
                      e.currentTarget.style.background = `${col}0a`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.borderColor = `${col}22`;
                      e.currentTarget.style.background = "rgba(8,12,28,.97)";
                    }}
                  >
                    <div style={{ fontSize: ".88rem", fontWeight: 800, color: T.text, marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: col, background: `${col}12`, padding: "2px 8px", borderRadius: 5, border: `1px solid ${col}28`, display: "inline-block" }}>
                      {count} course{count !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
