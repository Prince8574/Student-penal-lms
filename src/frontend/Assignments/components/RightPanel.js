import { T } from "../utils/constants";
import { getDaysLeft } from "../utils/helpers";
import MiniCalendar from "./MiniCalendar";

/* ══════════════════════════════RIGHT PANEL══════════════════════════════ */
export default function RightPanel({ assignments, counts }) {
  const totalPts = assignments
    .filter((a) => a.status === "graded" && a.grade != null)
    .reduce((s, a) => s + a.grade, 0);
  const maxPts = assignments
    .filter((a) => a.status === "graded" && a.grade != null)
    .reduce((s, a) => s + a.points, 0);
  const avgScore = maxPts ? Math.round((totalPts / maxPts) * 100) : 0;

  return (
    <div
      style={{
        width: 290,
        flexShrink: 0,
        padding: "22px 20px 22px 0",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        overflowY: "auto",
        scrollbarWidth: "none",
        animation: "slideR .6s .15s both",
      }}
    >
      {/* Performance card */}
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.bord}`,
          borderRadius: 16,
          padding: "16px 18px",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="ff"
          style={{ fontSize: ".9rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 14 }}
        >
          Performance
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
            <svg width={64} height={64} viewBox="0 0 64 64">
              <circle
                cx={32}
                cy={32}
                r={26}
                fill="none"
                stroke="rgba(255,255,255,.06)"
                strokeWidth={5}
              />
              <circle
                cx={32}
                cy={32}
                r={26}
                fill="none"
                stroke={avgScore >= 75 ? T.green : avgScore >= 60 ? T.gold : T.red}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={163.4}
                strokeDashoffset={163.4 - (avgScore / 100) * 163.4}
                transform="rotate(-90 32 32)"
                style={{
                  transition: "stroke-dashoffset 1.4s ease",
                  filter: `drop-shadow(0 0 5px ${avgScore >= 75 ? T.green : T.gold})`,
                }}
              />
              <text
                x={32}
                y={28}
                textAnchor="middle"
                fill={avgScore >= 75 ? T.green : T.gold}
                fontFamily="Fraunces,serif"
                fontSize={12}
                fontWeight={900}
              >
                {avgScore}%
              </text>
              <text
                x={32}
                y={39}
                textAnchor="middle"
                fill={T.text3}
                fontFamily="Satoshi,sans-serif"
                fontSize={7}
              >
                avg
              </text>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".76rem",
                marginBottom: 5,
              }}
            >
              <span style={{ color: T.text2 }}>Total Earned</span>
              <span style={{ fontWeight: 700, color: T.gold }}>{totalPts} pts</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".76rem",
                marginBottom: 5,
              }}
            >
              <span style={{ color: T.text2 }}>Max Possible</span>
              <span style={{ fontWeight: 700 }}>{maxPts} pts</span>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between", fontSize: ".76rem" }}
            >
              <span style={{ color: T.text2 }}>Completion</span>
              <span style={{ fontWeight: 700, color: T.teal }}>
                {Math.round((counts.graded / counts.all) * 100)}%
              </span>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: T.bord, margin: "0 0 12px" }} />
        {[
          { l: "On Time Rate", v: "92%", col: T.green },
          { l: "Avg Submission", v: "1.4d early", col: T.teal },
          { l: "Streak", v: "7 submitted", col: T.gold },
        ].map(({ l, v, col }) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              fontSize: ".76rem",
            }}
          >
            <span style={{ color: T.text2 }}>{l}</span>
            <span style={{ fontWeight: 700, color: col }}>{v}</span>
          </div>
        ))}
      </div>
      {/* Mini Calendar */}
      <MiniCalendar assignments={assignments} />
      {/* Upcoming deadlines */}
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.bord}`,
          borderRadius: 16,
          padding: "16px 18px",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="ff"
          style={{ fontSize: ".9rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 14 }}
        >
          Upcoming Deadlines
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {assignments
            .filter((a) => a.status === "pending" || a.status === "overdue")
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 4)
            .map((a, i, arr) => {
              const dl = getDaysLeft(a.dueDate, a.dueTime);
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    paddingBottom: i < arr.length - 1 ? 12 : 0,
                    marginBottom: i < arr.length - 1 ? 12 : 0,
                    borderBottom: i < arr.length - 1 ? `1px solid ${T.bord}` : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      paddingTop: 3,
                    }}
                  >
                    <div
                      className="timeline-dot"
                      style={{
                        background: dl.past ? T.red : dl.days <= 1 ? T.amber : a.courseColor,
                        boxShadow: `0 0 6px ${
                          dl.past ? T.red : dl.days <= 1 ? T.amber : a.courseColor
                        }55`,
                      }}
                    />
                    {i < arr.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: ".8rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        marginBottom: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {a.title}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: ".67rem",
                          color: dl.past ? T.red : dl.days <= 1 ? T.amber : T.text3,
                          fontWeight: dl.days <= 1 || dl.past ? 700 : 400,
                        }}
                      >
                        {dl.past ? "Overdue" : dl.label}
                      </span>
                      <span style={{ fontSize: ".65rem", color: T.text3 }}>·</span>
                      <span
                        style={{
                          fontSize: ".65rem",
                          fontWeight: 700,
                          color: a.courseColor,
                          background: `${a.courseColor}12`,
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {a.points}pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* Quick tips */}
      <div
        style={{
          background: "linear-gradient(135deg,rgba(240,165,0,.07),rgba(255,122,48,.04))",
          border: "1px solid rgba(240,165,0,.18)",
          borderRadius: 16,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: ".68rem",
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: T.gold,
            marginBottom: 10,
          }}
        >
          💡 Tips
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Submit early for partial credit on late policies",
            "Use the note field to explain your approach",
            "Check rubric before submitting",
          ].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: ".75rem",
                color: T.text2,
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: T.gold, flexShrink: 0, marginTop: 2 }}>✦</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
