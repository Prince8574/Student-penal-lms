import { useState, useEffect } from "react";
import { T } from "../../Explore/utils/designTokens";
import { useEnrollment } from "../hooks/useEnrollment";
import EnrollCourseCard from "./CourseCard";
import PaymentStep from "./PaymentStep";

/* ── Animations ── */
const CSS = `
@keyframes enrollOverlayIn{from{opacity:0}to{opacity:1}}
@keyframes enrollModalIn{from{opacity:0;transform:scale(.94) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes enrollSuccess{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
`;

const STEPS = ["Details", "Payment", "Done"];

export default function EnrollModal({ course, onClose, onEnrolled }) {
  const [step, setStep] = useState(0); // 0=details, 1=payment, 2=success
  const { enroll, isEnrolled, goToLearn, loading, error, setError } = useEnrollment();
  const alreadyEnrolled = isEnrolled(course.id);

  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  // If free course skip payment step
  const isFree = course.price === 0;

  const handleProceed = () => {
    setError(null);
    if (isFree) handlePay();
    else setStep(1);
  };

  const handlePay = async () => {
    const res = await enroll(course.id);
    if (res.ok) {
      setStep(2);
      onEnrolled?.();
    }
  };

  const disc = course.originalPrice > course.price
    ? Math.round((1 - course.price / course.originalPrice) * 100) : 0;

  return (
    <>
      <style>{CSS}</style>
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.78)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "enrollOverlayIn .22s ease both", backdropFilter: "blur(14px)" }}>

        <div style={{ background: T.s1, border: `1px solid ${T.b1}`, borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", animation: "enrollModalIn .3s cubic-bezier(.34,1.2,.64,1) both", scrollbarWidth: "thin", scrollbarColor: `${T.s4} transparent` }}>

          {/* Header */}
          <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: ".6rem", fontWeight: 700, background: i < step ? T.green : i === step ? T.p : T.s3, color: i <= step ? "#fff" : T.t3, border: `1px solid ${i < step ? T.green : i === step ? T.p : T.b0}`, transition: "all .3s" }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: ".7rem", color: i === step ? T.t0 : T.t3, fontWeight: i === step ? 600 : 400 }}>{s}</span>
                  {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step ? T.green : T.b0, transition: "background .3s" }} />}
                </div>
              ))}
            </div>
            <button onClick={onClose}
              style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${T.b1}`, background: "transparent", color: T.t2, cursor: "pointer", fontSize: ".8rem", display: "grid", placeItems: "center", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = T.s3; e.currentTarget.style.color = T.t0; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.t2; }}>
              ✕
            </button>
          </div>

          <div style={{ padding: "16px 20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ── STEP 0: Details ── */}
            {step === 0 && (
              <>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: T.t0, letterSpacing: "-.02em" }}>
                  {alreadyEnrolled ? "Already Enrolled" : "Enroll in Course"}
                </div>

                <EnrollCourseCard course={course} />

                {/* What you get */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon: "♾️", text: "Lifetime access" },
                    { icon: "🏅", text: "Certificate included" },
                    { icon: "📱", text: "Mobile & desktop" },
                    { icon: "↩️", text: "30-day refund" },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 9, background: T.s3, border: `1px solid ${T.b0}` }}>
                      <span style={{ fontSize: ".9rem" }}>{icon}</span>
                      <span style={{ fontSize: ".76rem", color: T.t1 }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                {!alreadyEnrolled && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: 900, color: T.t0 }}>
                      {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString()}`}
                    </span>
                    {disc > 0 && (
                      <>
                        <span style={{ fontSize: ".8rem", color: T.t3, textDecoration: "line-through" }}>₹{course.originalPrice.toLocaleString()}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 5, background: `${T.green}12`, color: T.green, fontSize: ".68rem", fontWeight: 700 }}>{disc}% OFF</span>
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
                  <button onClick={() => goToLearn(course.id)}
                    style={{ padding: "12px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${T.p},#6B85F8)`, color: "#fff", fontSize: ".88rem", fontWeight: 700, cursor: "pointer" }}>
                    ▶ Continue Learning
                  </button>
                ) : (
                  <button onClick={handleProceed}
                    style={{ padding: "12px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${T.p},#6B85F8)`, color: "#fff", fontSize: ".88rem", fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    {isFree ? "🚀 Enroll Free" : "Proceed to Payment →"}
                  </button>
                )}
              </>
            )}

            {/* ── STEP 1: Payment ── */}
            {step === 1 && (
              <>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: T.t0, letterSpacing: "-.02em" }}>Complete Payment</div>
                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: 9, background: `${T.red}12`, border: `1px solid ${T.red}30`, color: T.red, fontSize: ".8rem" }}>
                    ⚠ {error}
                  </div>
                )}
                <PaymentStep course={course} onPay={handlePay} onBack={() => setStep(0)} loading={loading} />
              </>
            )}

            {/* ── STEP 2: Success ── */}
            {step === 2 && (
              <div style={{ textAlign: "center", padding: "20px 0", animation: "enrollSuccess .4s cubic-bezier(.34,1.4,.64,1) both" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${T.green}18`, border: `2px solid ${T.green}40`, display: "grid", placeItems: "center", margin: "0 auto 16px", fontSize: "2rem" }}>
                  ✓
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: T.t0, marginBottom: 8 }}>You're enrolled!</div>
                <div style={{ fontSize: ".84rem", color: T.t2, marginBottom: 22, lineHeight: 1.6 }}>
                  Welcome to <strong style={{ color: T.t0 }}>{course.title}</strong>.<br />Start learning right now.
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => goToLearn(course.id)}
                    style={{ padding: "11px 24px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${T.p},#6B85F8)`, color: "#fff", fontSize: ".85rem", fontWeight: 700, cursor: "pointer" }}>
                    ▶ Start Learning
                  </button>
                  <button onClick={onClose}
                    style={{ padding: "11px 18px", borderRadius: 11, border: `1px solid ${T.b1}`, background: "transparent", color: T.t2, fontSize: ".85rem", fontWeight: 600, cursor: "pointer" }}>
                    Later
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
