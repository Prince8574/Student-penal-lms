import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import API_BASE from '../../config/api';
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import GradeCard from "./components/GradeCard";
import PerformanceChart from "./components/PerformanceChart";
import CertificateCard from "./components/CertificateCard";
import CertModal from "./components/CertModal";
import QuizTable from "./components/QuizTable";
import "./Grades.css";

gsap.registerPlugin(ScrollTrigger);

const API = `${API_BASE}/api`;

/* ── Grade letter helper ── */
function getGradeLetter(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "D";
}

function getGradeClass(pct) {
  if (pct >= 80) return "grade-a";
  if (pct >= 60) return "grade-b";
  return "grade-c";
}

function getGradeColor(pct) {
  if (pct >= 80) return "#22d38a";
  if (pct >= 60) return "#3b9eff";
  return "#f5a020";
}

/* ── Toast ── */
function Toast({ msg }) {
  return (
    <div className={`g-toast${msg ? " show" : ""}`}>
      <span style={{ fontSize: "1.1rem" }}>
        {msg?.startsWith("⏳") ? "⏳" : msg?.startsWith("❌") ? "❌" : "✅"}
      </span>
      <span className="g-toast-msg">{msg}</span>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "3rem", marginBottom: 14, opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#9ca3af", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: ".84rem", color: "#6b7280" }}>{sub}</div>
    </div>
  );
}

/* ── Main Page ── */
export default function GradesPage() {
  const heroRef = useRef(null);
  const tabsRef = useRef(null);

  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab]             = useState("grades");
  const [modalId, setModalId]     = useState(null);
  const [toast, setToast]         = useState("");

  // Real data from API
  const [grades, setGrades]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  /* ── Fetch grades from backend ── */
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { setError("Please login to view grades"); setLoading(false); return; }

        const res = await axios.get(`${API}/student/assignments/grades`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setGrades(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError(err.response?.data?.message || "Failed to load grades");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  /* ── Hero entrance + counters ── */
  useEffect(() => {
    if (loading) return;
    gsap.fromTo(heroRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(tabsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.4, ease: "power2.out" });

    const certsCount = grades.filter(g => g.certificateId).length;
    const avgPct = grades.length
      ? (grades.reduce((s, g) => s + (g.score / (g.maxScore || 100)) * 100, 0) / grades.length)
      : 0;
    const gpa = ((avgPct / 100) * 10).toFixed(1);

    [
      { id: "gh-gpa",     val: parseFloat(gpa), dec: 1, suffix: "/10" },
      { id: "gh-certs",   val: certsCount,       dec: 0, suffix: "" },
      { id: "gh-courses", val: grades.length,    dec: 0, suffix: "" },
    ].forEach(({ id, val, dec, suffix }) => {
      setTimeout(() => {
        gsap.to({ v: 0 }, {
          v: val, duration: 1.8, ease: "power2.out",
          onUpdate: function () {
            const el = document.getElementById(id);
            if (el) el.textContent = (dec ? this.targets()[0].v.toFixed(dec) : Math.round(this.targets()[0].v)) + suffix;
          },
        });
      }, 500);
    });
  }, [loading, grades]);

  /* ── Toast auto-hide ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── PDF Download — browser-side generation ── */
  const handleDownload = async (certId) => {
    const cert = certCards.find(c => c.id === certId);
    if (!cert) { setToast("❌ Certificate not found"); return; }

    setToast("⏳ Preparing certificate…");

    // Build cert HTML into a hidden div
    const { buildCertHTML } = await import("./components/CertModal");
    const studentName = user?.name || "Student";

    const area = document.createElement("div");
    area.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;";
    area.innerHTML = buildCertHTML(cert, studentName);
    document.body.appendChild(area);

    const certEl = area.querySelector("#certificate-render");
    if (!certEl) { document.body.removeChild(area); setToast("❌ Render failed"); return; }

    await new Promise(r => setTimeout(r, 500));

    try {
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;

      if (!html2canvas || !jsPDF) {
        // Fallback — open print dialog
        document.body.removeChild(area);
        setToast("❌ PDF library not loaded — try printing instead");
        return;
      }

      const canvas = await html2canvas(certEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pW = 297, pH = 210;
      const ratio = Math.min(pW / canvas.width, pH / canvas.height) * 0.92;
      const dW = canvas.width * ratio, dH = canvas.height * ratio;
      pdf.addImage(imgData, "PNG", (pW - dW) / 2, (pH - dH) / 2, dW, dH);
      pdf.save(`LearnVerse_Certificate_${cert.title.replace(/\s+/g, "_")}.pdf`);

      setToast("✅ Certificate downloaded!");
    } catch (e) {
      console.error(e);
      setToast("❌ Download failed: " + e.message);
    } finally {
      document.body.removeChild(area);
    }
  };

  const handleShare = (certId) => {
    navigator.clipboard.writeText(`https://learnverse.io/verify/${certId}`).catch(() => {});
    setToast("✅ Certificate link copied!");
  };

  /* ── Derived data ── */
  // Only graded submissions with a certificateId get a certificate card
  const certsData = grades.filter(g => g.certificateId);

  // Map grades to GradeCard format
  const gradeCards = grades.map(g => {
    const pct = Math.round((g.score / (g.maxScore || 100)) * 100);
    return {
      id: g._id,
      emoji: "📋",
      title: g.assignmentTitle,
      instructor: g.courseName,
      score: pct,
      total: 100,
      grade: getGradeLetter(pct),
      color: getGradeColor(pct),
      bgClass: getGradeClass(pct),
      tag: g.courseName,
      completed: g.gradedAt ? new Date(g.gradedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—",
    };
  });

  // Map certs to CertificateCard format
  const certCards = certsData.map(g => {
    const pct = Math.round((g.score / (g.maxScore || 100)) * 100);
    const grade = getGradeLetter(pct);
    const THEMES = [
      { bg: "linear-gradient(135deg,#0d1b2a,#162a46)", accent: "#3b9eff", text: "#c8e6ff" },
      { bg: "linear-gradient(135deg,#0f0a2a,#1e1050)", accent: "#a78bfa", text: "#e0d4ff" },
      { bg: "linear-gradient(135deg,#0a1a10,#0f2e18)", accent: "#22d38a", text: "#c6f6e0" },
      { bg: "linear-gradient(135deg,#1a0d2e,#2d1b4a)", accent: "#f5a020", text: "#fde8b0" },
    ];
    return {
      id: g.certificateId,
      emoji: "🏆",
      title: g.assignmentTitle,
      issued: g.gradedAt ? new Date(g.gradedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—",
      score: pct,
      grade,
      courseName: g.courseName,
      theme: THEMES[Math.floor(Math.random() * THEMES.length)],
    };
  });

  // Quiz history — all graded submissions
  const quizRows = grades.map(g => {
    const pct = Math.round((g.score / (g.maxScore || 100)) * 100);
    return {
      name: g.assignmentTitle,
      course: g.courseName,
      score: g.score,
      total: g.maxScore || 100,
      grade: getGradeLetter(pct),
      date: g.gradedAt ? new Date(g.gradedAt).toLocaleDateString("en-IN") : "—",
      pass: pct >= 50,
    };
  });

  return (
    <div className="grades-page">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 10 }}>
        <TopBar
          title={<>My <em style={{ fontStyle: "italic", color: "#f5a020" }}>Grades</em></>}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="grades-scroll">
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12, opacity: 0.3 }}>⏳</div>
              <div style={{ color: "#9ca3af", fontWeight: 700 }}>Loading your grades…</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12, opacity: 0.3 }}>⚠️</div>
              <div style={{ color: "#ff6b6b", fontWeight: 700, marginBottom: 8 }}>{error}</div>
              <button className="btn-dl" style={{ width: "auto", padding: "10px 22px" }} onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <>
              {/* HERO */}
              <div ref={heroRef} className="gh-hero" style={{ opacity: 0 }}>
                <div>
                  <h1>🏆 My Grades & Certificates</h1>
                  <p>Track your progress, showcase your achievements</p>
                </div>
                <div className="gh-stats">
                  {[
                    { id: "gh-gpa",     label: "Overall GPA" },
                    { id: "gh-certs",   label: "Certificates" },
                    { id: "gh-courses", label: "Graded" },
                  ].map(({ id, label }) => (
                    <div key={id} style={{ textAlign: "center" }}>
                      <div id={id} className="gh-stat-num">--</div>
                      <div className="gh-stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TABS */}
              <div ref={tabsRef} className="g-tabs" style={{ opacity: 0 }}>
                {[
                  ["grades", `📊 Grades (${gradeCards.length})`],
                  ["certs",  `🎓 Certificates (${certCards.length})`],
                  ["quiz",   `📝 History (${quizRows.length})`],
                ].map(([v, l]) => (
                  <button key={v} className={`g-tab${tab === v ? " active" : ""}`} onClick={() => setTab(v)}>{l}</button>
                ))}
              </div>

              {/* GRADES PANEL */}
              <div className={`g-panel${tab === "grades" ? " active" : ""}`}>
                {gradeCards.length > 0 ? (
                  <>
                    <PerformanceChart grades={grades} />
                    <div className="grades-grid">
                      {gradeCards.map((g, i) => <GradeCard key={g.id} g={g} idx={i} />)}
                    </div>
                  </>
                ) : (
                  <EmptyState icon="📊" title="No grades yet" sub="Submit assignments and wait for your instructor to grade them." />
                )}
              </div>

              {/* CERTS PANEL */}
              <div className={`g-panel${tab === "certs" ? " active" : ""}`}>
                {certCards.length > 0 ? (
                  <>
                    <div className="certs-header">
                      <div>
                        <h2>Your Certificates</h2>
                        <p>Only graded assignments generate certificates</p>
                      </div>
                    </div>
                    <div className="certs-grid">
                      {certCards.map((c, i) => (
                        <CertificateCard key={c.id} c={c} idx={i}
                          onPreview={() => setModalId(c.id)}
                          onDownload={() => handleDownload(c.id)} />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon="🎓"
                    title="No certificates yet"
                    sub="Certificates are generated automatically when your instructor grades your submitted assignment."
                  />
                )}
              </div>

              {/* QUIZ PANEL */}
              <div className={`g-panel${tab === "quiz" ? " active" : ""}`}>
                {quizRows.length > 0
                  ? <QuizTable data={quizRows} />
                  : <EmptyState icon="📝" title="No history yet" sub="Your graded assignments will appear here." />
                }
              </div>
            </>
          )}
        </div>
      </div>

      {/* CERT MODAL */}
      {modalId && (
        <CertModal
          certId={modalId}
          certsData={certCards}
          onClose={() => setModalId(null)}
          onDownload={() => handleDownload(modalId)}
          onShare={() => handleShare(modalId)}
        />
      )}

      <Toast msg={toast} />
    </div>
  );
}
