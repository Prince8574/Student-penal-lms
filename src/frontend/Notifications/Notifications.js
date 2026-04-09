import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useBg } from "../Assignments/hooks/useBackground";
import { T } from "../Assignments/utils/constants";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import "../Assignments/Assignments.css";
import API_BASE from '../../config/api';

var API = `${API_BASE}/api`;

var TYPE_META = {
  assignment: { label:"Assignment", color:"#4F6EF7", bg:"rgba(79,110,247,.08)",  bord:"rgba(79,110,247,.2)"  },
  grade:      { label:"Grade",      color:"#A855F7", bg:"rgba(168,85,247,.08)",  bord:"rgba(168,85,247,.2)"  },
  course:     { label:"Course",     color:"#00d4aa", bg:"rgba(0,212,170,.08)",   bord:"rgba(0,212,170,.2)"   },
  deadline:   { label:"Deadline",   color:"#ef4444", bg:"rgba(239,68,68,.08)",   bord:"rgba(239,68,68,.2)"   },
  system:     { label:"System",     color:"#f0a500", bg:"rgba(240,165,0,.08)",   bord:"rgba(240,165,0,.2)"   },
};

function buildTime(dateStr) {
  if (!dateStr) return "—";
  var d = new Date(dateStr);
  var now = new Date();
  var diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff/3600000) + "h ago";
  if (diff < 604800000) return Math.floor(diff/86400000) + "d ago";
  return d.toLocaleDateString();
}

async function fetchNotifications(token) {
  var headers = { Authorization: "Bearer " + token };
  var notifs = [];

  try {
    var r1 = await fetch(API + "/student/assignments", { headers: headers });
    var d1 = await r1.json();
    var assignments = d1.data || [];
    assignments.forEach(function(a) {
      var isOverdue = a.dueDate && new Date(a.dueDate) < new Date() && a.status !== "submitted" && a.status !== "graded";
      var isDueSoon = a.dueDate && !isOverdue && (new Date(a.dueDate) - new Date()) < 3 * 24 * 60 * 60 * 1000;
      if (isOverdue) {
        notifs.push({ id:"overdue-"+a._id, type:"deadline", title:"Overdue Assignment",
          body:'"'+a.title+'" is overdue', time:buildTime(a.dueDate), read:false,
          course:a.courseName||null, icon:"!", link:"/assignments/"+a._id, createdAt:a.dueDate||a.createdAt });
      } else if (isDueSoon) {
        notifs.push({ id:"due-"+a._id, type:"deadline", title:"Due Soon",
          body:'"'+a.title+'" is due soon', time:buildTime(a.dueDate), read:false,
          course:a.courseName||null, icon:"~", link:"/assignments/"+a._id, createdAt:a.dueDate||a.createdAt });
      } else {
        notifs.push({ id:"assign-"+a._id, type:"assignment", title:"Assignment Posted",
          body:'"'+a.title+'" is available', time:buildTime(a.createdAt), read:true,
          course:a.courseName||null, icon:"A", link:"/assignments/"+a._id, createdAt:a.createdAt });
      }
    });
  } catch(_) {}

  try {
    var r2 = await fetch(API + "/student/assignments/grades", { headers: headers });
    var d2 = await r2.json();
    var grades = d2.data || [];
    grades.forEach(function(g) {
      var pct = Math.round((g.score / (g.maxScore || 100)) * 100);
      notifs.push({ id:"grade-"+g._id, type:"grade", title:"Assignment Graded",
        body:'"'+g.assignmentTitle+'" — '+g.score+"/"+(g.maxScore||100)+" ("+pct+"%)",
        time:buildTime(g.gradedAt), read:false, course:g.courseName||null,
        icon:"G", link:"/grades", createdAt:g.gradedAt });
      if (g.certificateId) {
        notifs.push({ id:"cert-"+g._id, type:"system", title:"Certificate Ready",
          body:'Certificate issued for "'+g.assignmentTitle+'"',
          time:buildTime(g.gradedAt), read:false, course:g.courseName||null,
          icon:"C", link:"/grades", createdAt:g.gradedAt });
      }
    });
  } catch(_) {}

  try {
    var r3 = await fetch(API + "/enrollments/my-courses", { headers: headers });
    var d3 = await r3.json();
    var enrollments = d3.data || [];
    enrollments.forEach(function(e) {
      var course = e.course || e;
      var title = course.title || (typeof course === "string" ? course : "a course");
      notifs.push({ id:"enroll-"+e._id, type:"course", title:"Course Enrolled",
        body:'You enrolled in "' + title + '"',
        time:buildTime(e.enrolledAt || e.createdAt), read:true, course:title,
        icon:"E", link:"/my-courses", createdAt:e.enrolledAt || e.createdAt });
    });
  } catch(_) {}

  notifs.sort(function(a, b) { return new Date(b.createdAt||0) - new Date(a.createdAt||0); });

  if (notifs.length === 0) {
    notifs.push({ id:"welcome", type:"system", title:"Welcome to LearnVerse",
      body:"Your account is set up. Start exploring courses!", time:"Now",
      read:true, course:null, icon:"*", link:"/explore", createdAt:new Date() });
  }
  return notifs;
}

function NotifCard(props) {
  var n = props.n;
  var onRead = props.onRead;
  var onDelete = props.onDelete;
  var navigate = useNavigate();
  var meta = TYPE_META[n.type] || TYPE_META.system;

  function handleClick() {
    if (!n.read) onRead(n.id);
    navigate(n.link || "/");
  }

  return (
    <div onClick={handleClick}
      style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px 18px",
        borderRadius:14, cursor:"pointer",
        background: n.read ? "rgba(255,255,255,.015)" : "rgba(255,255,255,.035)",
        border:"1px solid " + (n.read ? T.bord : meta.bord),
        transition:"all .2s", position:"relative", overflow:"hidden" }}
      onMouseEnter={function(e) {
        e.currentTarget.style.background = "rgba(255,255,255,.05)";
        e.currentTarget.style.borderColor = meta.color + "44";
        e.currentTarget.style.transform = "translateX(3px)";
      }}
      onMouseLeave={function(e) {
        e.currentTarget.style.background = n.read ? "rgba(255,255,255,.015)" : "rgba(255,255,255,.035)";
        e.currentTarget.style.borderColor = n.read ? T.bord : meta.bord;
        e.currentTarget.style.transform = "none";
      }}>
      {!n.read && <div style={{ position:"absolute", top:14, right:14, width:7, height:7, borderRadius:"50%", background:meta.color, boxShadow:"0 0 6px "+meta.color }} />}
      {!n.read && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:meta.color, borderRadius:"14px 0 0 14px", opacity:.8 }} />}
      <div style={{ width:42, height:42, borderRadius:12, flexShrink:0, background:meta.bg, border:"1px solid "+meta.bord, display:"grid", placeItems:"center", fontSize:".82rem", fontWeight:800, color:meta.color }}>
        {n.icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
          <span style={{ fontSize:".84rem", fontWeight:n.read?600:800, color:n.read?T.text2:T.text, lineHeight:1.3 }}>{n.title}</span>
          {n.course && <span style={{ fontSize:".62rem", fontWeight:700, padding:"2px 8px", borderRadius:5, background:meta.bg, color:meta.color, border:"1px solid "+meta.bord, flexShrink:0 }}>{n.course}</span>}
        </div>
        <div style={{ fontSize:".78rem", color:T.text3, lineHeight:1.5, marginBottom:6 }}>{n.body}</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:".68rem", color:T.text3 }}>{n.time}</span>
          <span style={{ fontSize:".65rem", fontWeight:700, color:meta.color, textTransform:"uppercase", letterSpacing:".06em" }}>{meta.label}</span>
        </div>
      </div>
      <button onClick={function(e) { e.stopPropagation(); onDelete(n.id); }}
        style={{ width:28, height:28, borderRadius:8, border:"1px solid "+T.bord, background:"transparent", color:T.text3, cursor:"pointer", fontSize:".7rem", display:"grid", placeItems:"center", flexShrink:0, transition:"all .18s", alignSelf:"center" }}
        onMouseEnter={function(e) { e.currentTarget.style.borderColor="rgba(239,68,68,.4)"; e.currentTarget.style.color="#ef4444"; }}
        onMouseLeave={function(e) { e.currentTarget.style.borderColor=T.bord; e.currentTarget.style.color=T.text3; }}>
        x
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  var collapsed = useState(false);
  var setCollapsed = collapsed[1];
  collapsed = collapsed[0];
  var notifsState = useState([]);
  var notifs = notifsState[0];
  var setNotifs = notifsState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var tabState = useState("all");
  var tab = tabState[0];
  var setTab = tabState[1];

  var bgRef    = useRef(null);
  var statsRef = useRef(null);
  var listRef  = useRef(null);

  try { useBg(bgRef); } catch(e) {}

  useEffect(function() {
    var token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    fetchNotifications(token)
      .then(function(data) { setNotifs(data); })
      .catch(function() { setNotifs([]); })
      .finally(function() { setLoading(false); });
  }, []);

  useEffect(function() {
    if (loading) return;
    var tl = gsap.timeline({ defaults:{ ease:"power3.out" } });
    if (statsRef.current && statsRef.current.children.length)
      tl.fromTo(statsRef.current.children, { opacity:0, y:24 }, { opacity:1, y:0, duration:0.45, stagger:0.07 }, 0);
    if (listRef.current && listRef.current.children.length)
      tl.fromTo(listRef.current.children, { opacity:0, x:-16 }, { opacity:1, x:0, duration:0.38, stagger:0.05 }, 0.2);
  }, [loading]);

  useEffect(function() {
    if (!listRef.current) return;
    var cards = listRef.current.children;
    if (!cards.length) return;
    gsap.fromTo(cards, { opacity:0, x:-14 }, { opacity:1, x:0, duration:0.32, stagger:0.045, ease:"power2.out" });
  }, [tab]);

  function markRead(id) { setNotifs(function(p) { return p.map(function(n) { return n.id===id ? Object.assign({},n,{read:true}) : n; }); }); }
  function markAllRead() { setNotifs(function(p) { return p.map(function(n) { return Object.assign({},n,{read:true}); }); }); }
  function deleteNotif(id) { setNotifs(function(p) { return p.filter(function(n) { return n.id!==id; }); }); }
  function clearAll() { setNotifs([]); }

  var unread = notifs.filter(function(n) { return !n.read; }).length;
  var filtered = notifs.filter(function(n) {
    if (tab==="unread")     return !n.read;
    if (tab==="assignment") return n.type==="assignment";
    if (tab==="grade")      return n.type==="grade";
    if (tab==="course")     return n.type==="course";
    if (tab==="deadline")   return n.type==="deadline";
    return true;
  });
  var counts = {
    all:        notifs.length,
    unread:     notifs.filter(function(n){return !n.read;}).length,
    assignment: notifs.filter(function(n){return n.type==="assignment";}).length,
    grade:      notifs.filter(function(n){return n.type==="grade";}).length,
    course:     notifs.filter(function(n){return n.type==="course";}).length,
    deadline:   notifs.filter(function(n){return n.type==="deadline";}).length,
  };
  var stats = [
    { ico:"All",  val:notifs.length,    lbl:"Total",      col:T.text2,   bg:"rgba(255,255,255,.04)", bord:T.bord },
    { ico:"New",  val:unread,           lbl:"Unread",      col:"#ef4444", bg:"rgba(239,68,68,.07)",   bord:"rgba(239,68,68,.18)" },
    { ico:"Asgn", val:counts.assignment,lbl:"Assignments", col:"#4F6EF7", bg:"rgba(79,110,247,.07)",  bord:"rgba(79,110,247,.18)" },
    { ico:"Grd",  val:counts.grade,     lbl:"Grades",      col:"#A855F7", bg:"rgba(168,85,247,.07)",  bord:"rgba(168,85,247,.18)" },
    { ico:"Due",  val:counts.deadline,  lbl:"Deadlines",   col:"#ef4444", bg:"rgba(239,68,68,.07)",   bord:"rgba(239,68,68,.18)" },
  ];
  var tabs = [
    { id:"all",        l:"All ("+counts.all+")"         },
    { id:"unread",     l:"Unread ("+counts.unread+")"   },
    { id:"assignment", l:"Assignments"                  },
    { id:"grade",      l:"Grades"                       },
    { id:"course",     l:"Courses"                      },
    { id:"deadline",   l:"Deadlines"                    },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", width:"100vw", background:T.bg, color:T.text, fontFamily:"Satoshi,sans-serif", overflow:"hidden", position:"relative" }}>
      <canvas ref={bgRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", zIndex:100, minWidth:0 }}>
        <TopBar
          title={
            <span>
              Notifications
              {unread > 0 && (
                <span style={{ marginLeft:10, fontSize:".65rem", fontWeight:800, padding:"2px 9px", borderRadius:20, background:"rgba(239,68,68,.15)", color:"#ef4444", border:"1px solid rgba(239,68,68,.25)", verticalAlign:"middle" }}>
                  {unread} new
                </span>
              )}
            </span>
          }
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div className="main-scroll" style={{ flex:1, padding:"22px 24px", overflowY:"auto" }}>
          <div ref={statsRef} style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:13, marginBottom:24 }}>
            {stats.map(function(s) {
              return (
                <div key={s.lbl} style={{ background:s.bg, border:"1px solid "+s.bord, borderRadius:14, padding:"14px 16px", position:"relative", overflow:"hidden", transition:"transform .2s", cursor:"pointer" }}
                  onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={function(e){e.currentTarget.style.transform="none";}}>
                  <div style={{ fontSize:".62rem", fontWeight:800, color:s.col, marginBottom:7, letterSpacing:".08em", textTransform:"uppercase" }}>{s.ico}</div>
                  <div className="ff" style={{ fontSize:"1.7rem", fontWeight:900, letterSpacing:"-.06em", color:s.col, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:".66rem", fontWeight:700, color:T.text3, marginTop:4, textTransform:"uppercase", letterSpacing:".08em" }}>{s.lbl}</div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:s.col, opacity:.5 }} />
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:5, background:T.card, padding:5, borderRadius:12, border:"1px solid "+T.bord, flex:1, flexWrap:"wrap" }}>
              {tabs.map(function(t) {
                var on = tab===t.id;
                return (
                  <button key={t.id} className={"f-pill"+(on?" on":"")} style={{ padding:"5px 14px", borderRadius:8 }} onClick={function(){setTab(t.id);}}>
                    {t.l}
                  </button>
                );
              })}
            </div>
            {unread > 0 && (
              <button className="btn-outline" style={{ fontSize:".76rem", padding:"7px 14px", whiteSpace:"nowrap" }} onClick={markAllRead}>
                Mark all read
              </button>
            )}
            {notifs.length > 0 && (
              <button className="btn-outline" style={{ fontSize:".76rem", padding:"7px 14px", whiteSpace:"nowrap", borderColor:"rgba(239,68,68,.25)", color:"#ef4444" }}
                onClick={clearAll}
                onMouseEnter={function(e){e.currentTarget.style.background="rgba(239,68,68,.07)";}}
                onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                Clear all
              </button>
            )}
          </div>
          {loading ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:T.text3 }}>Loading notifications...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"70px 20px" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:16, opacity:.2 }}>!</div>
              <div className="ff" style={{ fontSize:"1.05rem", fontWeight:800, color:T.text2, marginBottom:8 }}>
                {tab==="unread" ? "All caught up!" : "No notifications here"}
              </div>
              <div style={{ fontSize:".84rem", color:T.text3 }}>
                {tab==="unread" ? "You have read everything." : "Switch to All to see all notifications."}
              </div>
            </div>
          ) : (
            <div ref={listRef} style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map(function(n) {
                return <NotifCard key={n.id} n={n} onRead={markRead} onDelete={deleteNotif} />;
              })}
            </div>
          )}
          <div style={{ height:40 }} />
        </div>
      </div>
    </div>
  );
}
