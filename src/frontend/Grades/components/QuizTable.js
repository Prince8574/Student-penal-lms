import { useState } from "react";

const gradeColor = g =>
  g.startsWith("A") ? "#22d38a" : g.startsWith("B") ? "#3b9eff" : g.startsWith("C") ? "#f5a020" : "#ff6b6b";

export default function QuizTable({ data = [] }) {
  const [filter, setFilter] = useState("all");

  const rows =
    filter === "all"  ? data :
    filter === "pass" ? data.filter(q => q.pass) :
                        data.filter(q => !q.pass);

  return (
    <div className="quiz-wrap">
      <div className="qt-header">
        <span className="qt-title">📝 Assignment Grade History</span>
        <div className="qt-filters">
          {[["all","All"],["pass","Passed"],["fail","Needs Work"]].map(([v, l]) => (
            <button key={v} className={`qt-btn${filter === v ? " active" : ""}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="g-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Course</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{q.name}</td>
                <td style={{ color: "#9ca3af" }}>{q.course}</td>
                <td style={{ fontWeight: 700, color: gradeColor(q.grade) }}>{q.score}/{q.total}</td>
                <td>
                  <span className="td-grade-pill" style={{ background: gradeColor(q.grade) + "22", color: gradeColor(q.grade) }}>
                    {q.grade}
                  </span>
                </td>
                <td style={{ color: "#6b7280" }}>{q.date}</td>
                <td>
                  <span className="td-status-pill"
                    style={{ background: q.pass ? "rgba(34,211,138,.1)" : "rgba(255,107,107,.1)", color: q.pass ? "#22d38a" : "#ff6b6b" }}>
                    {q.pass ? "✓ Pass" : "✗ Retry"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
