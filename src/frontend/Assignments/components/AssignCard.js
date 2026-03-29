import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { T, G } from "../utils/constants";
import { getDaysLeft, fmtDate } from "../utils/helpers";
import StatusBadge from "./StatusBadge";
import GradeRing from "./GradeRing";
import Countdown from "./Countdown";

/* ══════════════════════════════ASSIGNMENT CARD══════════════════════════════ */
export default function AssignCard({ a, idx, onOpen }) {
  const navigate = useNavigate();
  const [vis, setVis] = useState(false);
  function goToDetail(e) {
    if (e) e.stopPropagation();
    navigate("/assignments/" + (a.id || a._id), { state: { assignment: a } });
  }

  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVis(true), idx * 55);
          obs.disconnect();
        }
      },
      { threshold: 0.07 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [idx]);
  const dl = getDaysLeft(a.dueDate, a.dueTime);
  const onMM = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--mx",
      ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%"
    );
    ref.current.style.setProperty(
      "--my",
      ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%"
    );
  };
  return (
    <div
      ref={ref}
      className={`a-card${a.status === "overdue" ? " overdue" : ""}`}
      onClick={() => goToDetail()}
      onMouseMove={onMM}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .55s ${idx * 0.06}s,transform .55s ${
          idx * 0.06
        }s cubic-bezier(.4,0,.2,1)`,
        borderColor:
          a.status === "overdue" ? "rgba(239,68,68,.25)" : T.bord,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: a.courseColor,
          borderRadius: "18px 0 0 18px",
          opacity: 0.7,
        }}
      />
      <div style={{ padding: "18px 18px 16px 20px", position: "relative", zIndex: 2 }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 99,
                  background: `${a.courseColor}12`,
                  border: `1px solid ${a.courseColor}28`,
                }}
              >
                <span style={{ fontSize: ".78rem" }}>{a.courseIcon}</span>
                <span
                  style={{
                    fontSize: ".65rem",
                    fontWeight: 800,
                    color: a.courseColor,
                    letterSpacing: ".05em",
                  }}
                >
                  {(a.course || "").split(" ").slice(0, 3).join(" ")}
                </span>
              </div>
              <StatusBadge status={a.status} />
              <span
                style={{
                  fontSize: ".65rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 5,
                  background: "rgba(255,255,255,.04)",
                  color: T.text3,
                  border: `1px solid ${T.bord}`,
                }}
              >
                {a.type}
              </span>
            </div>
            <div
              className="ff"
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "-.03em",
                lineHeight: 1.25,
                marginBottom: 4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {a.title}
            </div>
            <div
              style={{
                fontSize: ".78rem",
                color: T.text2,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {a.desc}
            </div>
          </div>
          {/* Grade ring or points */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            {a.status === "graded" && a.grade != null ? (
              <GradeRing grade={a.grade} max={a.points} size={64} />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: `${a.courseColor}0e`,
                  border: `1px solid ${a.courseColor}28`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <div
                  className="ff"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 900,
                    color: a.courseColor,
                    lineHeight: 1,
                  }}
                >
                  {a.points}
                </div>
                <div
                  style={{
                    fontSize: ".6rem",
                    fontWeight: 700,
                    color: T.text3,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                  }}
                >
                  pts
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: a.status === "graded" && a.feedback ? 10 : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: ".76rem",
              color:
                dl.past && a.status !== "submitted" && a.status !== "graded"
                  ? T.red
                  : T.text2,
            }}
          >
            <span style={{ fontSize: ".8rem" }}>
              {dl.past && a.status !== "submitted" && a.status !== "graded"
                ? "🔴"
                : "📅"}
            </span>
            Due:{" "}
            <strong
              style={{
                color:
                  dl.past && a.status !== "submitted" && a.status !== "graded"
                    ? T.red
                    : T.text,
              }}
            >
              {fmtDate(a.dueDate)}, {a.dueTime}
            </strong>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: ".76rem",
              color: T.text2,
            }}
          >
            <span>⏱</span>
            {a.estimatedTime}
          </div>
          {a.status === "submitted" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: ".76rem",
                color: T.teal,
              }}
            >
              <span>✅</span>Submitted {fmtDate(a.submittedAt?.split(" ")[0])}
            </div>
          )}
          {(a.status === "pending" || a.status === "overdue") && !dl.past && (
            <Countdown dueDate={a.dueDate} dueTime={a.dueTime} />
          )}
          <div style={{ marginLeft: "auto" }}>
            {a.status === "pending" ? (
              <button
                className="btn-prim"
                style={{ fontSize: ".74rem", padding: "7px 16px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetail(e);
                }}
              >
                <span className="sh" />
                Submit →
              </button>
            ) : a.status === "overdue" ? (
              <button
                className="btn-prim"
                style={{
                  fontSize: ".74rem",
                  padding: "7px 16px",
                  background: G.red,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetail(e);
                }}
              >
                <span className="sh" />
                Late Submit
              </button>
            ) : a.status === "submitted" ? (
              <span
                style={{
                  fontSize: ".74rem",
                  color: T.teal,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>⏳</span>Under Review
              </span>
            ) : (
              <button
                className="btn-outline"
                style={{ fontSize: ".74rem", padding: "7px 16px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetail(e);
                }}
              >
                View Feedback
              </button>
            )}
          </div>
        </div>
        {/* Feedback preview */}
        {a.status === "graded" && a.feedback && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 13px",
              borderRadius: 10,
              background: "rgba(74,222,128,.05)",
              border: "1px solid rgba(74,222,128,.15)",
              fontSize: ".77rem",
              color: T.text2,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: T.green, fontWeight: 700, marginRight: 6 }}>
              💬 Instructor:
            </span>
            {a.feedback.length > 120 ? a.feedback.slice(0, 120) + "…" : a.feedback}
          </div>
        )}
        {a.status === "submitted" && a.feedback && (
          <div
            style={{
              marginTop: 8,
              padding: "9px 12px",
              borderRadius: 10,
              background: "rgba(0,212,170,.05)",
              border: "1px solid rgba(0,212,170,.15)",
              fontSize: ".76rem",
              color: T.text2,
            }}
          >
            <span style={{ color: T.teal, fontWeight: 700, marginRight: 6 }}>📌</span>
            {a.feedback}
          </div>
        )}
      </div>
      {/* Urgency bar */}
      {(a.status === "pending" || a.status === "overdue") && (
        <div className="urgency-bar">
          <div
            className="urgency-fill"
            style={{
              width: `${
                a.status === "overdue"
                  ? 100
                  : Math.min(100, 100 - (dl.days / 14) * 100)
              }%`,
              background:
                a.status === "overdue"
                  ? G.red
                  : dl.days <= 2
                  ? G.amber
                  : G.teal,
            }}
          />
        </div>
      )}
    </div>
  );
}
