import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const T = {
  sidebar: "#0B0F1A",
  bord: "rgba(255,255,255,0.07)",
  gold: "#F0A500",
  text: "#F0F6FF",
  text2: "#8899B8",
  text3: "#3A4F6E",
  red: "#EF4444",
  green: "#4ADE80",
};
const G = { gold: "linear-gradient(135deg,#F0A500,#FF7A30)" };

const NAV = [
  {
    g: "MAIN",
    items: [
      { i: "⊞",  l: "Dashboard",    id: "dash",        route: "/" },
      { i: "📚", l: "My Courses",   id: "courses",     route: "/my-courses", badge: 4 },
      { i: "🔍", l: "Explore",      id: "explore",     route: "/explore" },
      { i: "📝", l: "Assignments",  id: "assign",      route: "/assignments", badge: 3 },
      { i: "🏅", l: "Grades",       id: "grades",  route: "/grades" },
    ],
  },
  {
    g: "COMMUNITY",
    items: [
      { i: "🔔", l: "Notifications", id: "notif",  badge: 5, route: "/notifications" },
      { i: "👥", l: "Community",     id: "comm", route: "/community" },
    ],
  },
  {
    g: "ACCOUNT",
    items: [
      { i: "👤", l: "Profile",  id: "profile",  route: "/profile" },
      { i: "⚙️", l: "Settings", id: "settings", route: "/settings" },
    ],
  },
];

// Map route → nav id
const ROUTE_MAP = {
  "/":            "dash",
  "/explore":     "explore",
  "/my-courses":  "courses",
  "/assignments": "assign",
  "/grades":          "grades",
  "/notifications":   "notif",
  "/profile":         "profile",
  "/settings":    "settings",
  "/community":   "comm",
};

// Dynamic route matching (for /course/:id, /learn/:id etc)
function getActiveId(pathname) {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];
  if (pathname.startsWith("/course/") || pathname.startsWith("/learn/") || pathname.startsWith("/enroll/")) return "courses";
  if (pathname.startsWith("/edit-profile")) return "profile";
  return "dash";
}

const RED_IDS = ["assign", "notif"];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout }  = useAuth();

  const userName     = user?.name || "Student";
  const userEmail    = user?.email || "";
  const userInitials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarUrl    = user?.avatar || null;

  const handleLogout = async () => {
    await logout();
    navigate('/auth', { replace: true });
  };

  // Derive active from current route
  const activeId = getActiveId(location.pathname);
  const w = collapsed ? 68 : 242;

  return (
    <aside style={{
      width: w, minWidth: w, height: "100vh",
      background: T.sidebar, borderRight: `1px solid ${T.bord}`,
      display: "flex", flexDirection: "column",
      flexShrink: 0, zIndex: 50,
      transition: "width .3s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
    }}>

      {/* Logo */}
      <div style={{
        padding: collapsed ? "16px 14px" : "20px 18px",
        borderBottom: `1px solid ${T.bord}`,
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0, cursor: "pointer",
      }} onClick={() => navigate("/")}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: G.gold, display: "grid", placeItems: "center",
          fontSize: ".95rem", flexShrink: 0,
          boxShadow: "0 0 16px rgba(240,165,0,.35)",
        }}>🎓</div>
        {!collapsed && (
          <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-.03em", whiteSpace: "nowrap", color: T.text }}>
            Learn<b style={{ color: T.gold }}>Verse</b>
          </span>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: "auto", padding: collapsed ? "10px 8px" : "12px 10px", scrollbarWidth: "none" }}>
        {NAV.map(({ g, items }) => (
          <div key={g} style={{ marginBottom: 6 }}>
            {!collapsed && (
              <div style={{ fontSize: ".58rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: T.text3, padding: "8px 12px 4px" }}>
                {g}
              </div>
            )}
            {items.map(item => {
              const isActive = activeId === item.id;
              return (
                <div key={item.id}
                  onClick={() => item.route && navigate(item.route)}
                  style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: collapsed ? "10px" : "10px 14px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 11, marginBottom: 2, cursor: item.route ? "pointer" : "default",
                    background: isActive ? "rgba(240,165,0,.09)" : "transparent",
                    color: isActive ? T.gold : T.text2,
                    border: `1px solid ${isActive ? "rgba(240,165,0,.18)" : "transparent"}`,
                    transition: "all .18s",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.color = T.text; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text2; } }}
                >
                  {isActive && (
                    <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "58%", background: G.gold, borderRadius: "0 2px 2px 0" }} />
                  )}
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.i}</span>
                  {!collapsed && <span style={{ flex: 1, whiteSpace: "nowrap", fontSize: ".82rem", fontWeight: isActive ? 700 : 500 }}>{item.l}</span>}
                  {!collapsed && item.badge && (
                    <span style={{
                      fontSize: ".6rem", fontWeight: 800, padding: "2px 7px", borderRadius: 20,
                      background: RED_IDS.includes(item.id) ? "rgba(239,68,68,.14)" : "rgba(74,222,128,.12)",
                      color: RED_IDS.includes(item.id) ? T.red : T.green,
                    }}>{item.badge}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Profile + Logout */}
      <div style={{
        padding: collapsed ? "10px 8px" : "10px 12px",
        borderTop: `1px solid ${T.bord}`,
        display: "flex", alignItems: "center", gap: 9,
        flexShrink: 0,
      }}>
        {/* Avatar */}
        <div onClick={() => navigate('/profile')} style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: avatarUrl ? 'transparent' : G.gold,
          display: "grid", placeItems: "center", cursor: "pointer",
          overflow: "hidden", boxShadow: "0 0 10px rgba(240,165,0,.2)",
        }}>
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: ".75rem", fontWeight: 800, color: "#fff" }}>{userInitials}</span>
          }
        </div>

        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => navigate('/profile')}>
            <div style={{ fontSize: ".8rem", fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
            <div style={{ fontSize: ".58rem", color: T.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "monospace" }}>{userEmail}</div>
          </div>
        )}

        {!collapsed && (
          <span
            title="Logout"
            onClick={handleLogout}
            style={{ color: "#ff6b9d", cursor: "pointer", fontSize: "1rem", padding: "4px 6px", borderRadius: 6, transition: "background .2s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,157,.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >⏻</span>
        )}
      </div>

    </aside>
  );
}
