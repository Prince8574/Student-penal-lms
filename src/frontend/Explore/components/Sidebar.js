import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { T, G } from "../utils/designTokens";

const SIDENAV = [
  {
    g: "MAIN",
    items: [
      { i: "⊞", l: "Dashboard", id: "dash" },
      { i: "📚", l: "My Courses", id: "courses", badge: 4 },
      { i: "🔍", l: "Explore", id: "explore", on: true },
      { i: "📝", l: "Assignments", id: "assign", badge: 3 },
      { i: "🏅", l: "Grades", id: "grades" },
      { i: "📅", l: "Schedule", id: "sched" },
    ]
  },
  {
    g: "COMMUNITY",
    items: [
      { i: "💬", l: "Messages", id: "msg", badge: 2 },
      { i: "🔔", l: "Notifications", id: "notif", badge: 5 },
      { i: "🏆", l: "Leaderboard", id: "leader" },
      { i: "👥", l: "Community", id: "comm" },
    ]
  },
  {
    g: "ACCOUNT",
    items: [
      { i: "👤", l: "Profile", id: "profile", route: "/profile" },
      { i: "⚙️", l: "Settings", id: "settings", route: "/settings" },
    ]
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name || 'Student';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  // const location = useLocation();
  const [active, setActive] = useState("explore");
  const w = collapsed ? 68 : 242;

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
        height: "100vh",
        background: T.sidebar,
        borderRight: `1px solid ${T.bord}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 50,
        transition: "width .3s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden"
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "16px 14px" : "20px 18px",
          borderBottom: `1px solid ${T.bord}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: G.gold,
            display: "grid",
            placeItems: "center",
            fontSize: ".95rem",
            flexShrink: 0,
            boxShadow: "0 0 16px rgba(240,165,0,.35)"
          }}
        >
          🎓
        </div>
        {!collapsed && (
          <span
            style={{
              fontFamily: "Fraunces,serif",
              fontSize: "1.05rem",
              fontWeight: 800,
              letterSpacing: "-.04em",
              whiteSpace: "nowrap",
              animation: "slideL .3s ease both"
            }}
          >
            Learn<b style={{ color: T.gold }}>Verse</b>
          </span>
        )}
      </div>

      {/* Nav */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "10px 8px" : "12px 10px",
          scrollbarWidth: "none"
        }}
      >
        {SIDENAV.map(({ g, items }) => (
          <div key={g} style={{ marginBottom: 6 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: ".58rem",
                  fontWeight: 800,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: T.text3,
                  padding: "8px 12px 4px"
                }}
              >
                {g}
              </div>
            )}
            {items.map(item => (
              <div
                key={item.id}
                className={`sb-link${active === item.id || (item.on && active === "explore") ? " on" : ""}`}
                onClick={() => {
                  setActive(item.id);
                  // Navigate to different pages based on item id
                  if (item.id === "courses") {
                    navigate('/my-courses');
                  } else if (item.id === "profile") {
                    navigate('/profile');
                  } else if (item.id === "dash") {
                    navigate('/');
                  } else if (item.id === "explore") {
                    navigate('/explore');
                  } else if (item.id === "assign") {
                    navigate('/assignments');
                  } else if (item.id === "grades") {
                    console.log('Grades page coming soon');
                  } else if (item.id === "sched") {
                    console.log('Schedule page coming soon');
                  } else if (item.id === "msg") {
                    console.log('Messages page coming soon');
                  } else if (item.id === "notif") {
                    console.log('Notifications page coming soon');
                  } else if (item.id === "leader") {
                    console.log('Leaderboard page coming soon');
                  } else if (item.id === "comm") {
                    console.log('Community page coming soon');
                  } else if (item.id === "settings") {
                    navigate('/settings');
                  }
                }}
                style={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "10px" : "10px 14px"
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.i}</span>
                {!collapsed && <span style={{ flex: 1, whiteSpace: "nowrap" }}>{item.l}</span>}
                {!collapsed && item.badge && (
                  <span
                    style={{
                      fontSize: ".6rem",
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: 20,
                      background: item.id === "assign" || item.id === "notif" || item.id === "msg"
                        ? "rgba(239,68,68,.14)"
                        : "rgba(74,222,128,.12)",
                      color: item.id === "assign" || item.id === "notif" || item.id === "msg"
                        ? T.red
                        : T.green
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* User */}
      <div
    </aside>
  );
}


