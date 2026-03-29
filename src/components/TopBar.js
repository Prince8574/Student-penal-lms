import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const S = {
  bord: "rgba(255,255,255,0.07)",
  gold: "#F0A500",
  text: "#F0F6FF",
  text3: "#3A4F6E",
  red: "#EF4444",
  bg: "#06080F",
};

/**
 * Common TopBar for all student pages.
 *
 * Props:
 *  - title: JSX or string shown as page title
 *  - collapsed: sidebar collapsed state
 *  - setCollapsed: toggle sidebar
 *  - children: optional extra content (search bar, filters, etc.)
 */
export default function TopBar({ title, collapsed, setCollapsed, children }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName     = user?.name || "Student";
  const userInitials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header style={{
      height: 62,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 26px",
      background: "rgba(2,6,15,.75)",
      backdropFilter: "blur(24px)",
      borderBottom: `1px solid ${S.bord}`,
      flexShrink: 0,
      position: "relative",
      zIndex: 100,
      animation: "fadeUp .5s ease both",
    }}>

      {/* Sidebar toggle */}
      <button onClick={() => setCollapsed?.(s => !s)}
        style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${S.bord}`, background: "transparent", color: S.text3, cursor: "pointer", fontSize: ".8rem", display: "grid", placeItems: "center", transition: "all .18s", flexShrink: 0 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(240,165,0,.3)"; e.currentTarget.style.color = S.gold; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = S.bord; e.currentTarget.style.color = S.text3; }}>
        {collapsed ? "▶" : "◀"}
      </button>

      {/* Page title */}
      {title && (
        <div style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-.03em", whiteSpace: "nowrap", color: S.text }}>
          {title}
        </div>
      )}

      {/* Extra content (search, filters, etc.) */}
      {children}

      <div style={{ flex: 1 }} />

      {/* Notification bell */}
      <button style={{ position: "relative", width: 36, height: 36, borderRadius: 10, border: `1px solid ${S.bord}`, background: "none", cursor: "pointer", display: "grid", placeItems: "center", fontSize: "1rem", color: S.text3, transition: "all .18s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(240,165,0,.3)"; e.currentTarget.style.color = S.gold; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = S.bord; e.currentTarget.style.color = S.text3; }}>
        🔔
        <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: S.red, border: `2px solid ${S.bg}` }} />
      </button>

      {/* User avatar — click → profile */}
      <div onClick={() => navigate("/profile")}
        title={userName}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,rgba(240,165,0,.22),rgba(255,122,48,.14))",
          border: "1px solid rgba(240,165,0,.22)",
          display: "grid", placeItems: "center",
          fontSize: ".68rem", fontWeight: 900, color: S.gold,
          cursor: "pointer", flexShrink: 0, transition: "all .18s",
          position: "relative",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(240,165,0,.35),rgba(255,122,48,.25))"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(240,165,0,.22),rgba(255,122,48,.14))"; }}>
        {userInitials}
      </div>
    </header>
  );
}
