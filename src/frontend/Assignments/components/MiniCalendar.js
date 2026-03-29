import { T } from "../utils/constants";

/* ══════════════════════════════CALENDAR MINI══════════════════════════════ */
export default function MiniCalendar({ assignments }) {
  const now = new Date();
  const year = now.getFullYear(),
    month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleString("default", { month: "long" });
  const dueDates = new Set(
    assignments
      .filter((a) => a.status === "pending" || a.status === "overdue")
      .map((a) => new Date(a.dueDate).getDate())
  );
  const overDates = new Set(
    assignments.filter((a) => a.status === "overdue").map((a) => new Date(a.dueDate).getDate())
  );

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.bord}`,
        borderRadius: 16,
        padding: "16px 16px 12px",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          className="ff"
          style={{ fontSize: ".9rem", fontWeight: 800, letterSpacing: "-.03em" }}
        >
          {monthName} {year}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="icon-btn"
            style={{ width: 28, height: 28, borderRadius: 8, fontSize: ".7rem" }}
          >
            ‹
          </button>
          <button
            className="icon-btn"
            style={{ width: 28, height: 28, borderRadius: 8, fontSize: ".7rem" }}
          >
            ›
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
          marginBottom: 6,
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: ".6rem",
              fontWeight: 700,
              color: T.text3,
              padding: "3px 0",
              letterSpacing: ".06em",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {Array(startDay)
          .fill(null)
          .map((_, i) => (
            <div key={`e${i}`} />
          ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1,
            isToday = d === now.getDate(),
            hasDue = dueDates.has(d),
            isOver = overDates.has(d);
          return (
            <div
              key={d}
              style={{
                textAlign: "center",
                padding: "4px 2px",
                borderRadius: 7,
                fontSize: ".72rem",
                fontWeight: isToday ? 900 : hasDue ? 700 : 400,
                background: isToday
                  ? "rgba(240,165,0,.15)"
                  : isOver
                  ? "rgba(239,68,68,.1)"
                  : hasDue
                  ? "rgba(59,130,246,.1)"
                  : "transparent",
                color: isToday ? T.gold : isOver ? T.red : hasDue ? T.blue2 : T.text3,
                border: isToday
                  ? `1px solid rgba(240,165,0,.3)`
                  : isOver
                  ? `1px solid rgba(239,68,68,.22)`
                  : hasDue
                  ? `1px solid rgba(59,130,246,.2)`
                  : "1px solid transparent",
                cursor: "pointer",
                transition: "all .18s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isToday) e.currentTarget.style.background = "rgba(255,255,255,.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isToday
                  ? "rgba(240,165,0,.15)"
                  : isOver
                  ? "rgba(239,68,68,.1)"
                  : hasDue
                  ? "rgba(59,130,246,.1)"
                  : "transparent";
              }}
            >
              {d}
              {hasDue && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: isOver ? T.red : T.gold,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { col: T.gold, l: "Due date" },
          { col: T.red, l: "Overdue" },
          { col: T.gold + "44", l: "Today" },
        ].map(({ col, l }) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: ".65rem",
              color: T.text3,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

