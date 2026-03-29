import { useEffect, useRef } from "react";

export default function PerformanceChart({ grades = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = 180;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Build last-6-months data from real grades
    const now = new Date();
    const monthLabels = [];
    const monthScores = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en-IN", { month: "short" });
      monthLabels.push(label);

      // Average score for that month
      const monthGrades = grades.filter(g => {
        if (!g.gradedAt) return false;
        const gd = new Date(g.gradedAt);
        return gd.getMonth() === d.getMonth() && gd.getFullYear() === d.getFullYear();
      });

      if (monthGrades.length > 0) {
        const avg = monthGrades.reduce((s, g) => s + Math.round((g.score / (g.maxScore || 100)) * 100), 0) / monthGrades.length;
        monthScores.push(Math.round(avg));
      } else {
        // No data — use previous or 0
        monthScores.push(monthScores.length > 0 ? monthScores[monthScores.length - 1] : 0);
      }
    }

    const padL = 40, padR = 20, padT = 20, padB = 36;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const minVal = Math.max(0, Math.min(...monthScores) - 10);
    const maxVal = 100;
    const range  = maxVal - minVal;

    // Grid lines
    [minVal, minVal + range * 0.25, minVal + range * 0.5, minVal + range * 0.75, maxVal].forEach(v => {
      const y = padT + chartH - ((v - minVal) / range) * chartH;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "11px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(v), padL - 8, y + 4);
    });

    const pts = monthScores.map((s, i) => ({
      x: padL + i * (chartW / (monthScores.length - 1)),
      y: padT + chartH - ((s - minVal) / range) * chartH,
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
    grad.addColorStop(0, "rgba(245,160,32,0.22)");
    grad.addColorStop(1, "rgba(245,160,32,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      if (i > 0) { const prev = pts[i - 1]; const cpx = (prev.x + p.x) / 2; ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y); }
    });
    ctx.lineTo(pts[pts.length - 1].x, H - padB);
    ctx.lineTo(pts[0].x, H - padB);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      if (i > 0) { const prev = pts[i - 1]; const cpx = (prev.x + p.x) / 2; ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y); }
    });
    ctx.strokeStyle = "#f5a020";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots + labels
    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fillStyle = "#f5a020"; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = "#07080f"; ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "11px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(monthLabels[i], p.x, H - 8);
      if (monthScores[i] > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
        ctx.fillText(monthScores[i] + "%", p.x, p.y - 10);
      }
    });
  }, [grades]);

  return (
    <div className="perf-box">
      <div className="perf-box-header">
        <span className="perf-box-title">📈 Performance Overview</span>
        <span style={{ fontSize: ".78rem", color: "#6b7280" }}>Last 6 months</span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 180, display: "block" }} />
    </div>
  );
}
