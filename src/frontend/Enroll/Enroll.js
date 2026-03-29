import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "../../services/api";
import { T } from "../Explore/utils/designTokens";
import { useEnrollment } from "./hooks/useEnrollment";
import EnrollCourseCard from "./components/CourseCard";
import PaymentStep from "./components/PaymentStep";
import "./Enroll.css";

const STEPS = ["Details", "Payment", "Done"];

export default function EnrollPage() {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const { enroll, isEnrolled, goToLearn, loading, error, setError } = useEnrollment();

  const [course,  setCourse]  = useState(null);
  const [fetching, setFetching] = useState(true);
  const [step,    setStep]    = useState(0);

  useEffect(() => {
    if (!courseId) return;
    courseAPI.getOne(courseId)
      .then(r => {
        const c = r.data.data;
        setCourse({
          id:            c._id,
          title:         c.title,
          instructor:    typeof c.instructor === "object" ? c.instructor?.name || "Admin" : "Admin",
          category:      c.category || "Course",
          level:         c.level || "Beginner",
          duration:      c.duration || "—",
          price:         c.price || 0,
          originalPrice: c.originalPrice || c.price || 0,
          thumbnail:     c.thumbnail || "",
          gradient:      c.bg || `linear-gradient(135deg,${T.s3},${T.s4})`,
          accent:        c.accent || T.p,
          icon:          c.emoji || "📘",
          badge:         c.badge || "New",
          tags:          Array.isArray(c.tags) ? c.tags : [],
          description:   c.description || "",
          outcomes:      Array.isArray(c.outcomes) ? c.outcomes : [],
        });
      })
      .catch(() => setCourse(null))
      .finally(() => setFetching(false));
  }, [courseId]);

  const alreadyEnrolled = course ? isEnrolled(course.id) : false;
  const isFree = course?.price === 0;

  const handleProceed = () => {
    setError(null);
    if (isFree) handlePay({ confirmed: true, paymentMethod: "Free", transactionId: `FREE-${Date.now()}`, amount: 0, gst: 0 });
    else setStep(1);
  };

  const handlePay = async (paymentData) => {
    if (!paymentData?.confirmed) return;
    setError(null);
    const res = await enroll(course.id, paymentData);
    if (res.ok) {
      goToLearn(course.id);
    }
    // if res.ok is false, error is already set in useEnrollment
  };

  /* ── Loading ── */
  if (fetching) return (
    <div className="enroll-page">
      <div style={{ textAlign: "center", color: T.t2 }}>
        <div style={{ fontSize: "2rem", marginBottom: 12, opacity: .3 }}>⏳</div>
        Loading course…
      </div>
    </div>
  );

  /* ── Not found ── */
  if (!course) return (
    <div className="enroll-page">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12, opacity: .2 }}>🔍</div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: T.t0, marginBottom: 8 }}>Course not found</div>
        <button className="enroll-btn-ghost" onClick={() => navigate("/explore")}>← Back to Explore</button>
      </div>
    </div>
  );

  return (
    <div className="enroll-page">

      {/* ── STEP 1: Payment — PaymentStep handles its own full layout ── */}
      {step === 1 && (
        <div style={{ width: "100%", maxWidth: 920 }}>
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#EF4444", fontSize: ".8rem", marginBottom: 12 }}>
              ⚠ {error}
            </div>
          )}
          <PaymentStep course={course} onPay={handlePay} onBack={() => setStep(0)} loading={loading} />
        </div>
      )}

      {/* ── STEP 0 & 2: Card layout ── */}
      {step !== 1 && (
      <div className="enroll-card">

        {/* Hero thumbnail */}
        <div className="enroll-hero" style={{ background: course.gradient }}>
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "5rem", opacity: .1 }}>{course.icon}</span>
              </div>
          }
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.7))" }} />
          {/* Back button */}
          <button onClick={() => navigate(-1)}
            style={{ position: "absolute", top: 14, left: 14, width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", background: "rgba(0,0,0,.5)", color: "#fff", cursor: "pointer", fontSize: ".8rem", display: "grid", placeItems: "center", backdropFilter: "blur(6px)", transition: "all .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,.5)"}>
            ←
          </button>
          <div style={{ position: "absolute", bottom: 14, left: 18, zIndex: 2 }}>
            <div style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: course.accent || T.p, marginBottom: 4 }}>{course.category}</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#F0F4FF", lineHeight: 1.25, maxWidth: 420 }}>{course.title}</div>
          </div>
        </div>

        <div className="enroll-body">

          {/* Step bar */}
          <div className="enroll-step-bar">
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="enroll-step-dot"
                  style={{ background: i < step ? T.green : i === step ? T.p : T.s3, color: i <= step ? "#fff" : T.t3, border: `1px solid ${i < step ? T.green : i === step ? T.p : T.b0}` }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: ".72rem", color: i === step ? T.t0 : T.t3, fontWeight: i === step ? 600 : 400 }}>{s}</span>
                {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < step ? T.green : T.b0, transition: "background .3s" }} />}
              </div>
            ))}
          </div>

          <div className="enroll-divider" />

          {/* ── STEP 0: Details ── */}
          {step === 0 && (
            <>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: T.t0, letterSpacing: "-.02em" }}>
                {alreadyEnrolled ? "You're already enrolled" : "Confirm Enrollment"}
              </div>

              <EnrollCourseCard course={course} />

              <div className="enroll-feature-grid">
                {[
                  { icon: "♾️", text: "Lifetime access" },
                  { icon: "🏅", text: "Certificate included" },
                  { icon: "📱", text: "Mobile & desktop" },
                  { icon: "↩️", text: "30-day refund" },
                ].map(({ icon, text }) => (
                  <div key={text} className="enroll-feature-item">
                    <span style={{ fontSize: ".95rem" }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>

              {!alreadyEnrolled && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900, color: T.t0 }}>
                    {isFree ? "FREE" : `₹${course.price.toLocaleString()}`}
                  </span>
                  {course.originalPrice > course.price && (
                    <>
                      <span style={{ fontSize: ".8rem", color: T.t3, textDecoration: "line-through" }}>₹{course.originalPrice.toLocaleString()}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 5, background: `${T.green}12`, color: T.green, fontSize: ".68rem", fontWeight: 700 }}>
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              )}

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 9, background: `${T.red}12`, border: `1px solid ${T.red}30`, color: T.red, fontSize: ".8rem" }}>
                  ⚠ {error}
                </div>
              )}

              {alreadyEnrolled ? (
                <button className="enroll-btn-primary" onClick={() => goToLearn(course.id)}>
                  ▶ Continue Learning
                </button>
              ) : (
                <button className="enroll-btn-primary" onClick={handleProceed}>
                  {isFree ? "🚀 Enroll Free" : "Proceed to Payment →"}
                </button>
              )}

              <button className="enroll-btn-ghost" style={{ alignSelf: "center" }} onClick={() => navigate("/explore")}>
                ← Back to Explore
              </button>
            </>
          )}

          {/* ── STEP 2: Success ── */}
          {step === 2 && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div className="enroll-success-icon" style={{ background: `${T.green}18`, border: `2px solid ${T.green}40` }}>
                ✓
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: T.t0, marginBottom: 8 }}>You're enrolled!</div>
              <div style={{ fontSize: ".85rem", color: T.t2, lineHeight: 1.65, marginBottom: 24 }}>
                Welcome to <strong style={{ color: T.t0 }}>{course.title}</strong>.<br />
                Start learning right now.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="enroll-btn-primary" style={{ maxWidth: 200 }} onClick={() => goToLearn(course.id)}>
                  ▶ Start Learning
                </button>
                <button className="enroll-btn-ghost" onClick={() => navigate("/explore")}>
                  Explore More
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      )}
    </div>
  );
}
