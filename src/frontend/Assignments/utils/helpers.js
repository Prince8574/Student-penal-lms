import { T } from "./constants";

/* ══════════════════════════════UTILS══════════════════════════════ */
export function getDaysLeft(dateStr, timeStr) {
  const due = new Date(`${dateStr} ${timeStr || "23:59"}`);
  const now = new Date();
  const diff = due - now;
  if (diff < 0) return { days: 0, hours: 0, past: true, label: "Overdue" };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return {
    days,
    hours,
    past: false,
    label: days === 0 ? `${hours}h left` : days === 1 ? "Tomorrow" : `${days} days left`,
  };
}

export function fmtDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function urgencyColor(status, daysLeft) {
  if (status === "graded") return T.green;
  if (status === "submitted") return T.teal;
  if (status === "overdue") return T.red;
  if (daysLeft.days === 0) return T.red;
  if (daysLeft.days <= 2) return T.amber;
  return T.blue2;
}
