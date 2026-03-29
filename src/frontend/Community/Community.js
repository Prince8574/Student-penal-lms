import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../context/AuthContext";
/* ─── Design tokens ─────────────────────────────────────────────── */
const T = {
  bg:"#050814", card:"rgba(9,16,36,.93)", bord:"rgba(255,255,255,.06)",
  text:"#f0f6ff", text2:"#8899b8", text3:"#3a4f6e",
  gold:"#f0a500", teal:"#00d4aa", green:"#4ade80", red:"#ef4444", blue:"#60a5fa",
};

const TAG_COL = {
  Question:"#60a5fa", Resource:"#4ade80", "Study Group":"#f0a500",
  Achievement:"#f472b6", Feedback:"#a78bfa", Discussion:"#00d4aa",
};
const REACTIONS = ["❤️","🔥","👏","💡","😂","🎉"];

/* ─── Explore section data ──────────────────────────────────────── */
const EX_MEMBERS = [
  { id:1, name:"Aria Novak",   role:"Lead Designer",     posts:1240, karma:"12.4k", avatar:"AN", color:"#FF2D78", badge:"🏆" },
  { id:2, name:"Dev Rathore",  role:"Full-Stack Dev",    posts: 987, karma:"9.8k",  avatar:"DR", color:"#4DFFCC", badge:"⚡" },
  { id:3, name:"Priya Mehta",  role:"AI Researcher",     posts: 834, karma:"8.3k",  avatar:"PM", color:"#A78BFA", badge:"🔬" },
  { id:4, name:"Kai Okafor",   role:"Community Manager", posts: 672, karma:"6.7k",  avatar:"KO", color:"#FBCF4A", badge:"🌟" },
  { id:5, name:"Lena Fischer", role:"Open Source Eng",   posts: 590, karma:"5.9k",  avatar:"LF", color:"#38BDF8", badge:"🛠" },
  { id:6, name:"Ryu Tanaka",   role:"Security Expert",   posts: 445, karma:"4.4k",  avatar:"RT", color:"#FF7A50", badge:"🔐" },
];
const EX_FEED = [
  { tag:"Discussion", title:"How AI is reshaping open-source contribution workflows",         author:"Priya Mehta",  time:"2h ago", replies:84,  likes:312, color:"#A78BFA", icon:"💬" },
  { tag:"Showcase",   title:"Built a real-time 3D collaboration tool in a weekend hackathon", author:"Dev Rathore",  time:"5h ago", replies:56,  likes:198, color:"#4DFFCC", icon:"🚀" },
  { tag:"Help",       title:"WebGL performance degrading on mobile — any tips?",              author:"Kai Okafor",   time:"8h ago", replies:29,  likes: 67, color:"#FBCF4A", icon:"🙋" },
  { tag:"Announce",   title:"Community v3.0 launching next month — sneak peek inside!",       author:"Aria Novak",   time:"1d ago", replies:143, likes:820, color:"#FF2D78", icon:"📣" },
  { tag:"Project",    title:"Open-sourcing our design system — 200+ components, fully typed", author:"Lena Fischer", time:"2d ago", replies:97,  likes:540, color:"#38BDF8", icon:"🎨" },
];
const EX_STATS = [
  { label:"Members",     value:"48,200+", icon:"👥", change:"+12% this month", c:"#4DFFCC" },
  { label:"Posts Today", value:"1,830",   icon:"📝", change:"+8% vs yesterday", c:"#FF2D78" },
  { label:"Projects",    value:"7,500+",  icon:"🚀", change:"+340 this week",   c:"#A78BFA" },
  { label:"Countries",   value:"112",     icon:"🌍", change:"Worldwide reach",  c:"#FBCF4A" },
];
const EX_CATS = [
  { name:"Design",       count:2840, color:"#FF2D78" },
  { name:"Engineering",  count:4120, color:"#4DFFCC" },
  { name:"AI & ML",      count:1990, color:"#A78BFA" },
  { name:"Open Source",  count:1430, color:"#38BDF8" },
  { name:"DevOps",       count: 870, color:"#FBCF4A" },
];

/* ─── Feed data ─────────────────────────────────────────────────── */
const INIT_POSTS = [
  { id:1, author:"Priya K.", avatar:"PK", color:"#60a5fa", role:"Student", course:"Machine Learning", time:"2m ago",
    content:"Can anyone explain the difference between L1 and L2 regularization? I keep getting confused during assignments.", likes:14, tag:"Question", bookmarked:false,
    reactions:{"❤️":3,"💡":8},
    comments:[
      { id:1, author:"Rahul M.", avatar:"RM", color:"#4ade80", text:"L1 adds absolute value of weights (sparse), L2 adds squared weights (smooth). L1 is better for feature selection!", time:"1m ago", likes:5, replies:[] },
      { id:2, author:"Arjun V.", avatar:"AV", color:"#f472b6", text:"Great question! Check out Andrew Ng's ML course — he explains it really well with visuals.", time:"just now", likes:2, replies:[] },
    ]},
  { id:2, author:"Rahul M.", avatar:"RM", color:"#4ade80", role:"Student", course:"Full Stack Web Dev", time:"18m ago",
    content:"Just finished the React hooks assignment — the useEffect cleanup function finally clicked for me! Sharing my notes if anyone needs.", likes:31, tag:"Resource", bookmarked:true,
    reactions:{"❤️":12,"🔥":7,"👏":5},
    comments:[
      { id:1, author:"Sneha T.", avatar:"ST", color:"#f0a500", text:"Please share! I've been struggling with cleanup functions too.", time:"15m ago", likes:3, replies:[] },
    ]},
  { id:3, author:"Sneha T.", avatar:"ST", color:"#f0a500", role:"Student", course:"Data Structures", time:"1h ago",
    content:"Study group for DSA final exam this Saturday 3PM IST. Drop a reply if you want to join the call! We'll cover trees, graphs and DP.", likes:22, tag:"Study Group", bookmarked:false,
    reactions:{"🎉":9,"👏":6},
    comments:[
      { id:1, author:"Meera S.", avatar:"MS", color:"#a78bfa", text:"I'm in! Will we cover dynamic programming too?", time:"55m ago", likes:1, replies:[] },
    ]},
  { id:4, author:"Arjun V.", avatar:"AV", color:"#f472b6", role:"Student", course:"AWS Solutions", time:"3h ago",
    content:"Got my AWS Solutions Architect cert today! Huge thanks to everyone in this community for the mock Q&A sessions.", likes:87, tag:"Achievement", bookmarked:false,
    reactions:{"🎉":34,"❤️":28,"👏":19,"🔥":12},
    comments:[
      { id:1, author:"Rahul M.", avatar:"RM", color:"#4ade80", text:"Congrats!! You absolutely crushed it. Any tips for the exam?", time:"2h ago", likes:8, replies:[] },
    ]},
];

const MOCK_ROOMS = [
  { id:1, name:"DSA Study Hall",  members:142, active:8,  color:"#60a5fa", ico:"🧮" },
  { id:2, name:"ML Discussion",   members:98,  active:5,  color:"#a78bfa", ico:"🤖" },
  { id:3, name:"Web Dev Lounge",  members:211, active:14, color:"#4ade80", ico:"🌍" },
  { id:4, name:"Design Critique", members:67,  active:3,  color:"#f472b6", ico:"🎨" },
  { id:5, name:"AWS Prep Group",  members:55,  active:2,  color:"#f59e0b", ico:"☁️" },
];

const MOCK_CONVOS = [
  { id:1, name:"Priya K.",  avatar:"PK", color:"#60a5fa", lastMsg:"Can you share your DSA notes?", time:"2m",  unread:2,
    messages:[
      { from:"them", text:"Hey! Can you share your DSA notes from last week?", time:"10:42 AM" },
      { from:"me",   text:"Sure! I'll send them over now.", time:"10:43 AM" },
      { from:"them", text:"Can you share your DSA notes?", time:"10:45 AM" },
    ]},
  { id:2, name:"Rahul M.",  avatar:"RM", color:"#4ade80", lastMsg:"Thanks for the help!", time:"18m", unread:0,
    messages:[
      { from:"me",   text:"Did you finish the React assignment?", time:"9:00 AM" },
      { from:"them", text:"Yes! It was tough but done.", time:"9:05 AM" },
      { from:"them", text:"Thanks for the help!", time:"9:06 AM" },
    ]},
  { id:3, name:"Sneha T.",  avatar:"ST", color:"#f0a500", lastMsg:"Saturday 3PM study group?", time:"1h",  unread:1,
    messages:[{ from:"them", text:"Saturday 3PM study group?", time:"8:30 AM" }]},
  { id:4, name:"Arjun V.",  avatar:"AV", color:"#f472b6", lastMsg:"Got my AWS cert!", time:"3h",  unread:0,
    messages:[
      { from:"them", text:"Got my AWS cert!", time:"7:00 AM" },
      { from:"me",   text:"Congrats! That's amazing!", time:"7:02 AM" },
    ]},
];

/* ─── Three.js particle globe ───────────────────────────────────── */
function ParticleGlobe({ containerRef }) {
  useEffect(function() {
    var el = containerRef.current;
    if (!el) return;
    var W = el.clientWidth, H = el.clientHeight;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch(e) {
      console.warn('[WebGL] Community globe skipped:', e.message);
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    el.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    var count = 3000;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count*3);
    var cols = new Float32Array(count*3);
    var palette = [new THREE.Color("#4DFFCC"), new THREE.Color("#FF2D78"), new THREE.Color("#A78BFA"), new THREE.Color("#38BDF8")];
    for (var i = 0; i < count; i++) {
      var phi = Math.acos(2*Math.random()-1);
      var theta = 2*Math.PI*Math.random();
      var r = 2 + (Math.random()-0.5)*0.25;
      pos[i*3]=r*Math.sin(phi)*Math.cos(theta); pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta); pos[i*3+2]=r*Math.cos(phi);
      var c = palette[Math.floor(Math.random()*palette.length)];
      cols[i*3]=c.r; cols[i*3+1]=c.g; cols[i*3+2]=c.b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
    geo.setAttribute("color", new THREE.BufferAttribute(cols,3));
    var mat = new THREE.PointsMaterial({ size:0.022, vertexColors:true, transparent:true, opacity:0.85, blending:THREE.AdditiveBlending, depthWrite:false });
    var sphere = new THREE.Points(geo, mat);
    scene.add(sphere);
    var icoGeo = new THREE.IcosahedronGeometry(1.2,1);
    var icoMat = new THREE.MeshBasicMaterial({ color:"#4DFFCC", wireframe:true, transparent:true, opacity:0.08 });
    var ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);
    var ringGeo = new THREE.TorusGeometry(2.3,0.006,8,120);
    var ringMat = new THREE.MeshBasicMaterial({ color:"#FF2D78", transparent:true, opacity:0.4 });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI/4;
    scene.add(ring);
    var mx=0, my=0;
    function onMove(e) { mx=(e.clientX/window.innerWidth-0.5)*2; my=(e.clientY/window.innerHeight-0.5)*2; }
    window.addEventListener("mousemove", onMove);
    var frame;
    function animate() {
      frame = requestAnimationFrame(animate);
      var t = performance.now()*0.001;
      sphere.rotation.y=t*0.06+mx*0.3; sphere.rotation.x=t*0.03+my*0.15;
      ico.rotation.y=-t*0.08; ico.rotation.x=t*0.05; ring.rotation.z=t*0.04;
      camera.position.x=Math.sin(t*0.15)*0.3;
      renderer.render(scene, camera);
    }
    animate();
    function onResize() { var nW=el.clientWidth,nH=el.clientHeight; camera.aspect=nW/nH; camera.updateProjectionMatrix(); renderer.setSize(nW,nH); }
    window.addEventListener("resize", onResize);
    return function() { cancelAnimationFrame(frame); window.removeEventListener("mousemove",onMove); window.removeEventListener("resize",onResize); renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);
  return null;
}

/* ─── Explore tab (user's landing page content) ─────────────────── */
const EXPLORE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
.ex-wrap{max-width:1140px;margin:0 auto;padding:64px 40px}
.ex-wrap-tight{max-width:1140px;margin:0 auto;padding:0 40px 64px}
.ex-hero{position:relative;min-height:520px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;text-align:center}
.ex-hero-canvas{position:absolute;inset:0;z-index:0}
.ex-hero-grad{position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse 80% 60% at 50% 60%,transparent 0%,rgba(5,8,20,.7) 65%,#050814 100%)}
.ex-hero-content{position:relative;z-index:2;max-width:780px;padding:0 24px}
.ex-tag{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(77,255,204,.25);padding:6px 18px;border-radius:999px;font-size:.82rem;color:#4DFFCC;margin-bottom:24px;background:rgba(77,255,204,.06);font-weight:500;font-family:'DM Sans',sans-serif}
.ex-tag::before{content:'';width:7px;height:7px;border-radius:50%;background:#4DFFCC;animation:exPulse 2s ease-in-out infinite}
@keyframes exPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
.ex-title{font-family:'DM Serif Display',serif;font-size:clamp(2.4rem,5vw,4.2rem);line-height:1.08;margin-bottom:16px}
.ex-title .t1{display:block;color:#E8EAF6}
.ex-title .t2{display:block;background:linear-gradient(135deg,#4DFFCC,#A78BFA);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic}
.ex-sub{font-size:1rem;color:rgba(232,234,246,.55);max-width:480px;margin:0 auto 32px;line-height:1.75;font-family:'DM Sans',sans-serif}
.ex-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.ex-btn-p{padding:12px 28px;background:#4DFFCC;color:#080B14;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:700;border-radius:10px;transition:all .25s}
.ex-btn-p:hover{background:#fff;transform:translateY(-2px);box-shadow:0 12px 40px rgba(77,255,204,.3)}
.ex-btn-g{padding:12px 28px;background:rgba(255,255,255,.05);color:#E8EAF6;border:1px solid rgba(255,255,255,.12);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;border-radius:10px;transition:all .25s}
.ex-btn-g:hover{background:rgba(255,255,255,.09);transform:translateY(-2px)}
.ex-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:64px}
.ex-stat{background:rgba(17,21,39,.9);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px 20px;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}
.ex-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,var(--sc),transparent);border-radius:16px 16px 0 0}
.ex-stat:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.ex-stat-ico{font-size:1.4rem;margin-bottom:12px;display:block}
.ex-stat-val{font-family:'DM Serif Display',serif;font-size:1.9rem;color:#E8EAF6;display:block}
.ex-stat-lbl{font-size:.85rem;color:rgba(232,234,246,.5);font-weight:500;margin-top:3px;display:block;font-family:'DM Sans',sans-serif}
.ex-stat-chg{font-size:.72rem;color:var(--sc);margin-top:8px;display:block;font-weight:500;font-family:'DM Sans',sans-serif}
.ex-sec-lbl{font-size:.72rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#FF2D78;margin-bottom:6px;font-family:'DM Sans',sans-serif}
.ex-sec-title{font-family:'DM Serif Display',serif;font-size:clamp(1.6rem,2.8vw,2.2rem);line-height:1.2;color:#E8EAF6}
.ex-sec-title em{font-style:italic;color:#4DFFCC}
.ex-sec-row{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;gap:16px;flex-wrap:wrap}
.ex-link{font-size:.84rem;color:#4DFFCC;font-weight:600;cursor:pointer;border:none;background:none;padding:0;font-family:'DM Sans',sans-serif}
.ex-link:hover{opacity:.7}
.ex-cats{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:32px}
.ex-cat{padding:7px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);font-size:.84rem;font-weight:500;cursor:pointer;transition:all .22s;display:flex;align-items:center;gap:7px;font-family:'DM Sans',sans-serif;color:#E8EAF6}
.ex-cat:hover{border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.06);transform:translateY(-2px)}
.ex-cat.on{border-color:var(--cc);background:rgba(255,255,255,.06);color:var(--cc)}
.ex-cat-dot{width:7px;height:7px;border-radius:50%;background:var(--cc);flex-shrink:0}
.ex-cat-n{font-size:.7rem;opacity:.5}
.ex-members{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ex-mc{background:rgba(17,21,39,.9);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:22px;position:relative;overflow:hidden;transition:transform .3s,border-color .3s,box-shadow .3s;cursor:pointer}
.ex-mc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(to right,var(--mc),transparent);transform:scaleX(0);transform-origin:left;transition:transform .4s;border-radius:0 0 16px 16px}
.ex-mc:hover{transform:translateY(-5px);border-color:rgba(255,255,255,.12);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.ex-mc:hover::after{transform:scaleX(1)}
.ex-mc-rank{position:absolute;top:14px;right:14px;font-size:.68rem;font-weight:700;color:rgba(232,234,246,.28);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:7px;padding:2px 7px;font-family:'DM Sans',sans-serif}
.ex-mc-top{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.ex-mc-av{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:.88rem;font-weight:700;flex-shrink:0;font-family:'DM Sans',sans-serif}
.ex-mc-name{font-size:.95rem;font-weight:700;margin-bottom:2px;color:#E8EAF6;font-family:'DM Sans',sans-serif}
.ex-mc-role{font-size:.78rem;color:rgba(232,234,246,.5);font-family:'DM Sans',sans-serif}
.ex-mc-badge{font-size:1rem;margin-left:auto}
.ex-divider{height:1px;background:rgba(255,255,255,.07);margin-bottom:16px}
.ex-mc-stats{display:flex}
.ex-mc-stat{flex:1;text-align:center}
.ex-mc-stat:not(:last-child){border-right:1px solid rgba(255,255,255,.07)}
.ex-mc-val{font-size:1rem;font-weight:700;display:block;margin-bottom:2px;font-family:'DM Sans',sans-serif}
.ex-mc-lbl{font-size:.67rem;color:rgba(232,234,246,.45);text-transform:uppercase;letter-spacing:.08em;font-weight:500;font-family:'DM Sans',sans-serif}
.ex-feed-layout{display:grid;grid-template-columns:1fr 280px;gap:18px;align-items:start}
.ex-feed-list{display:flex;flex-direction:column;gap:10px}
.ex-fi{background:rgba(17,21,39,.9);border:1px solid rgba(255,255,255,.07);border-radius:13px;padding:18px 20px;display:flex;gap:14px;transition:transform .25s,border-color .3s,box-shadow .3s;cursor:pointer;align-items:flex-start}
.ex-fi:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.12);box-shadow:0 14px 40px rgba(0,0,0,.4)}
.ex-fi-ico{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
.ex-fi-tag{font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:2px 9px;border-radius:999px;border:1px solid;font-family:'DM Sans',sans-serif}
.ex-fi-time{font-size:.74rem;color:rgba(232,234,246,.28);margin-left:auto;font-family:'DM Sans',sans-serif}
.ex-fi-title{font-size:.92rem;font-weight:600;line-height:1.55;margin-bottom:10px;color:#E8EAF6;font-family:'DM Sans',sans-serif}
.ex-fi-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.ex-fi-meta{font-size:.78rem;color:rgba(232,234,246,.45);font-family:'DM Sans',sans-serif}
.ex-fi-hot{color:#FF2D78}
.ex-sidebar{display:flex;flex-direction:column;gap:14px}
.ex-sc{background:rgba(17,21,39,.9);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:20px}
.ex-sc-title{font-size:.85rem;font-weight:700;margin-bottom:14px;color:#E8EAF6;font-family:'DM Sans',sans-serif}
.ex-online{display:flex;flex-direction:column;gap:10px}
.ex-ou{display:flex;align-items:center;gap:10px}
.ex-oav-wrap{position:relative;flex-shrink:0}
.ex-oav{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;font-family:'DM Sans',sans-serif}
.ex-odot{position:absolute;bottom:1px;right:1px;width:8px;height:8px;border-radius:50%;background:#22c55e;border:2px solid rgba(17,21,39,.9)}
.ex-oname{font-size:.82rem;font-weight:600;color:#E8EAF6;font-family:'DM Sans',sans-serif}
.ex-orole{font-size:.7rem;color:rgba(232,234,246,.45);font-family:'DM Sans',sans-serif}
.ex-trends{display:flex;flex-direction:column;gap:7px}
.ex-tr{display:flex;align-items:center;gap:9px;padding:6px 7px;border-radius:9px;cursor:pointer;transition:background .2s}
.ex-tr:hover{background:rgba(255,255,255,.04)}
.ex-tr-n{font-size:.7rem;color:rgba(232,234,246,.28);font-weight:700;width:13px;font-family:'DM Sans',sans-serif}
.ex-tr-t{flex:1;font-size:.82rem;font-weight:500;font-family:'DM Sans',sans-serif}
.ex-tr-c{font-size:.7rem;color:rgba(232,234,246,.45);font-family:'DM Sans',sans-serif}
.ex-cta{padding:0 40px 64px;max-width:1140px;margin:0 auto}
.ex-cta-box{background:linear-gradient(135deg,rgba(77,255,204,.05),rgba(167,139,250,.05),rgba(255,45,120,.05));border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:52px 48px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;position:relative;overflow:hidden}
.ex-cta-box::before{content:'';position:absolute;top:-80px;right:-80px;width:300px;height:300px;background:radial-gradient(circle,rgba(77,255,204,.07),transparent 70%);border-radius:50%;pointer-events:none}
.ex-cta-title{font-family:'DM Serif Display',serif;font-size:clamp(1.7rem,2.8vw,2.4rem);line-height:1.2;margin-bottom:12px;color:#E8EAF6}
.ex-cta-title em{font-style:italic;color:#4DFFCC}
.ex-cta-desc{color:rgba(232,234,246,.5);font-size:.93rem;line-height:1.75;margin-bottom:24px;font-family:'DM Sans',sans-serif}
.ex-perks{list-style:none;display:flex;flex-direction:column;gap:9px}
.ex-perk{display:flex;align-items:center;gap:9px;font-size:.88rem;color:rgba(232,234,246,.55);font-family:'DM Sans',sans-serif}
.ex-tick{width:19px;height:19px;border-radius:6px;background:rgba(77,255,204,.1);border:1px solid rgba(77,255,204,.28);display:flex;align-items:center;justify-content:center;font-size:.65rem;color:#4DFFCC;font-weight:700;flex-shrink:0}
.ex-form{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:28px 24px}
.ex-form-title{font-size:1.1rem;font-weight:700;margin-bottom:3px;color:#E8EAF6;font-family:'DM Sans',sans-serif}
.ex-form-sub{font-size:.82rem;color:rgba(232,234,246,.45);margin-bottom:20px;line-height:1.6;font-family:'DM Sans',sans-serif}
.ex-fg{margin-bottom:12px}
.ex-flbl{font-size:.76rem;font-weight:600;color:rgba(232,234,246,.5);display:block;margin-bottom:4px;font-family:'DM Sans',sans-serif}
.ex-finput{width:100%;padding:10px 13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;color:#E8EAF6;font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;transition:border-color .25s}
.ex-finput:focus{border-color:#4DFFCC}
.ex-finput::placeholder{color:rgba(232,234,246,.28)}
.ex-f2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ex-submit{width:100%;padding:12px;background:linear-gradient(135deg,#4DFFCC,#38BDF8);color:#080B14;border:none;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;margin-top:4px;transition:opacity .25s,transform .25s}
.ex-submit:hover{opacity:.88;transform:translateY(-2px)}
.ex-fine{text-align:center;font-size:.7rem;color:rgba(232,234,246,.28);margin-top:10px;font-family:'DM Sans',sans-serif}
@media(max-width:900px){.ex-members{grid-template-columns:repeat(2,1fr)}.ex-feed-layout{grid-template-columns:1fr}.ex-cta-box{grid-template-columns:1fr;gap:28px}.ex-stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.ex-members{grid-template-columns:1fr}.ex-wrap,.ex-wrap-tight{padding:40px 16px}.ex-cta,.ex-cta-box{padding:28px 16px}.ex-f2{grid-template-columns:1fr}}
`;

function ExploreSection({ onJoin }) {
  const canvasRef = useRef(null);
  const [activeCat, setActiveCat] = useState("All");

  return (
    <div style={{ overflowY:"auto", flex:1, background:"#050814" }}>
      <style>{EXPLORE_CSS}</style>

      {/* Hero */}
      <div className="ex-hero">
        <div className="ex-hero-canvas" ref={canvasRef}>
          <ParticleGlobe containerRef={canvasRef}/>
        </div>
        <div className="ex-hero-grad"/>
        <div className="ex-hero-content">
          <div className="ex-tag">🌐 Now 48,000+ members worldwide</div>
          <h1 className="ex-title">
            <span className="t1">Where Builders</span>
            <span className="t2">Converge &amp; Create</span>
          </h1>
          <p className="ex-sub">A community for designers, engineers, and makers. Share projects, find collaborators, and grow alongside the best minds in tech.</p>
          <div className="ex-btns">
            <button className="ex-btn-p" onClick={onJoin}>Join the Community</button>
            <button className="ex-btn-g">Explore Projects</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="ex-wrap">
        <div className="ex-stats-grid">
          {EX_STATS.map(function(s, i) {
            return (
              <div className="ex-stat" key={i} style={{"--sc": s.c}}>
                <span className="ex-stat-ico">{s.icon}</span>
                <span className="ex-stat-val">{s.value}</span>
                <span className="ex-stat-lbl">{s.label}</span>
                <span className="ex-stat-chg">{s.change}</span>
              </div>
            );
          })}
        </div>

        {/* Members */}
        <div className="ex-sec-row">
          <div>
            <p className="ex-sec-lbl">Community Leaders</p>
            <h2 className="ex-sec-title">Top <em>Contributors</em> This Month</h2>
          </div>
          <button className="ex-link">View All Members →</button>
        </div>
        <div className="ex-cats">
          {["All"].concat(EX_CATS.map(function(c) { return c.name; })).map(function(cat) {
            var catData = EX_CATS.find(function(c) { return c.name === cat; });
            var on = activeCat === cat;
            return (
              <button key={cat} className={"ex-cat"+(on?" on":"")}
                style={on && catData ? {"--cc": catData.color} : catData ? {"--cc": catData.color} : {}}
                onClick={function() { setActiveCat(cat); }}>
                {catData && <span className="ex-cat-dot" style={{"--cc": catData.color}}/>}
                {cat}
                {catData && <span className="ex-cat-n">{catData.count.toLocaleString()}</span>}
              </button>
            );
          })}
        </div>
        <div className="ex-members">
          {EX_MEMBERS.map(function(m, i) {
            return (
              <div className="ex-mc" key={m.id} style={{"--mc": m.color}}>
                <span className="ex-mc-rank">#{i+1}</span>
                <div className="ex-mc-top">
                  <div className="ex-mc-av" style={{ background:m.color+"18", color:m.color }}>{m.avatar}</div>
                  <div>
                    <div className="ex-mc-name">{m.name}</div>
                    <div className="ex-mc-role">{m.role}</div>
                  </div>
                  <span className="ex-mc-badge">{m.badge}</span>
                </div>
                <div className="ex-divider"/>
                <div className="ex-mc-stats">
                  {[["Posts", m.posts], ["Karma", m.karma], ["Rating", "★ 4.9"]].map(function(s) {
                    return (
                      <div className="ex-mc-stat" key={s[0]}>
                        <span className="ex-mc-val" style={{ color:m.color }}>{s[1]}</span>
                        <span className="ex-mc-lbl">{s[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feed + Sidebar */}
      <div className="ex-wrap-tight">
        <div className="ex-sec-row">
          <div>
            <p className="ex-sec-lbl">Activity Feed</p>
            <h2 className="ex-sec-title">Trending <em>Discussions</em></h2>
          </div>
          <button className="ex-link">Browse All →</button>
        </div>
        <div className="ex-feed-layout">
          <div className="ex-feed-list">
            {EX_FEED.map(function(f, i) {
              return (
                <div className="ex-fi" key={i}>
                  <div className="ex-fi-ico">{f.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:7, flexWrap:"wrap" }}>
                      <span className="ex-fi-tag" style={{ color:f.color, borderColor:f.color+"55", background:f.color+"10" }}>{f.tag}</span>
                      <span className="ex-fi-time">{f.time}</span>
                    </div>
                    <div className="ex-fi-title">{f.title}</div>
                    <div className="ex-fi-foot">
                      <span className="ex-fi-meta">by {f.author}</span>
                      <span className="ex-fi-meta">💬 {f.replies}</span>
                      <span className={"ex-fi-meta"+(f.likes>300?" ex-fi-hot":"")}>♥ {f.likes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ex-sidebar">
            <div className="ex-sc">
              <div className="ex-sc-title">🟢 Online Now</div>
              <div className="ex-online">
                {EX_MEMBERS.slice(0,4).map(function(m) {
                  return (
                    <div className="ex-ou" key={m.id}>
                      <div className="ex-oav-wrap">
                        <div className="ex-oav" style={{ background:m.color+"18", color:m.color }}>{m.avatar}</div>
                        <div className="ex-odot"/>
                      </div>
                      <div>
                        <div className="ex-oname">{m.name}</div>
                        <div className="ex-orole">{m.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="ex-sc">
              <div className="ex-sc-title">🔥 Trending Tags</div>
              <div className="ex-trends">
                {["#WebGL","#ReactJS","#OpenAI","#TypeScript","#GSAP"].map(function(tag, i) {
                  return (
                    <div className="ex-tr" key={tag}>
                      <span className="ex-tr-n">{i+1}</span>
                      <span className="ex-tr-t" style={{ color: EX_CATS[i] ? EX_CATS[i].color : "#E8EAF6" }}>{tag}</span>
                      <span className="ex-tr-c">{[820,640,510,430,380][i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="ex-cta">
        <div className="ex-cta-box">
          <div>
            <p className="ex-sec-lbl">Get Started Today</p>
            <h2 className="ex-cta-title">Join a community that <em>actually</em> helps you grow</h2>
            <p className="ex-cta-desc">Whether you're a seasoned engineer or just starting out, there's a place here for you. Learn, build, and connect with people who care.</p>
            <ul className="ex-perks">
              {["Access to 7,500+ open-source projects","Weekly live workshops & AMAs","Direct feedback from senior engineers","Private job board with top companies"].map(function(p) {
                return <li className="ex-perk" key={p}><span className="ex-tick">✓</span>{p}</li>;
              })}
            </ul>
          </div>
          <div className="ex-form">
            <div className="ex-form-title">Create your account</div>
            <div className="ex-form-sub">Free forever. No credit card required.</div>
            <div className="ex-f2">
              <div className="ex-fg"><label className="ex-flbl">First Name</label><input className="ex-finput" placeholder="Arjun"/></div>
              <div className="ex-fg"><label className="ex-flbl">Last Name</label><input className="ex-finput" placeholder="Sharma"/></div>
            </div>
            <div className="ex-fg"><label className="ex-flbl">Email Address</label><input className="ex-finput" type="email" placeholder="arjun@example.com"/></div>
            <div className="ex-fg">
              <label className="ex-flbl">I'm primarily a...</label>
              <select className="ex-finput" style={{ cursor:"pointer" }}>
                <option value="">Select your role</option>
                <option>Designer</option><option>Frontend Developer</option><option>Backend Developer</option>
                <option>Full-Stack Developer</option><option>AI / ML Engineer</option><option>Student</option>
              </select>
            </div>
            <button className="ex-submit" onClick={onJoin}>Join the Community →</button>
            <div className="ex-fine">By joining, you agree to our Terms &amp; Privacy Policy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Avatar ─────────────────────────────────────────────── */
function Avatar({ initials, color, size=38 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:Math.round(size*0.28), background:"linear-gradient(135deg,"+color+"44,"+color+"18)", border:"1px solid "+color+"35", display:"grid", placeItems:"center", fontSize:Math.round(size*0.32)+"px", fontWeight:900, color:color, flexShrink:0 }}>
      {initials}
    </div>
  );
}

/* ─── Comment with like + reply ─────────────────────────────────── */
function CommentItem({ c, depth }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(c.likes || 0);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(c.replies || []);

  function submitReply() {
    if (!replyText.trim()) return;
    setReplies(function(p) { return p.concat({ id:Date.now(), author:"You", avatar:"ME", color:"#f0a500", text:replyText.trim(), time:"just now", likes:0, replies:[] }); });
    setReplyText(""); setShowReply(false);
  }

  return (
    <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
      <Avatar initials={c.avatar} color={c.color} size={depth>0?26:32}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ background:"rgba(255,255,255,.05)", borderRadius:14, padding:"8px 12px", display:"inline-block", maxWidth:"100%" }}>
          <div style={{ fontSize:".78rem", fontWeight:700, color:"#e6edf3", marginBottom:2 }}>{c.author}</div>
          <div style={{ fontSize:".83rem", color:"#c9d1d9", lineHeight:1.55 }}>{c.text}</div>
          {c.image && <img src={c.image} alt="" style={{ marginTop:6, maxWidth:"100%", borderRadius:8, maxHeight:140, objectFit:"cover", display:"block" }}/>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, paddingLeft:4, marginTop:4 }}>
          <span style={{ fontSize:".68rem", color:"#6e7681" }}>{c.time}</span>
          <button onClick={function() { setLiked(function(v){return !v;}); setLikes(function(n){return n+(liked?-1:1);}); }}
            style={{ background:"none", border:"none", cursor:"pointer", color:liked?"#ef4444":"#6e7681", fontSize:".72rem", fontWeight:700, padding:0 }}>
            {liked?"❤️":"Like"} {likes > 0 ? likes : ""}
          </button>
          {depth===0 && (
            <button onClick={function() { setShowReply(function(v){return !v;}); }}
              style={{ background:"none", border:"none", cursor:"pointer", color:showReply?"#60a5fa":"#6e7681", fontSize:".72rem", fontWeight:700, padding:0 }}>
              Reply
            </button>
          )}
        </div>
        {replies.length>0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8, paddingLeft:4 }}>
            {replies.map(function(r) { return <CommentItem key={r.id} c={r} depth={1}/>; })}
          </div>
        )}
        {showReply && (
          <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
            <Avatar initials="ME" color="#f0a500" size={26}/>
            <div style={{ flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
              <textarea value={replyText} onChange={function(e){setReplyText(e.target.value);}}
                onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submitReply();}}}
                placeholder="Write a reply..." rows={1}
                style={{ flex:1, background:"none", border:"none", outline:"none", color:"#c9d1d9", fontFamily:"inherit", fontSize:".8rem", resize:"none", lineHeight:1.5 }}/>
              <button onClick={submitReply} disabled={!replyText.trim()}
                style={{ background:"none", border:"none", cursor:replyText.trim()?"pointer":"not-allowed", color:replyText.trim()?"#60a5fa":"#6e7681", fontSize:".8rem", fontWeight:700, padding:0, flexShrink:0 }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Post card ─────────────────────────────────────────────────── */
function PostCard({ post, onLike, onBookmark, onReact, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [comments, setComments] = useState(post.comments || []);
  const commentImgRef = useRef(null);
  const tagColor = TAG_COL[post.tag] || T.text3;

  function submitComment() {
    if (!commentText.trim() && !commentImage) return;
    var nc = { id:Date.now(), author:"You", avatar:"ME", color:"#f0a500", text:commentText.trim(), time:"just now", likes:0, image:commentImage, replies:[] };
    setComments(function(p){return p.concat(nc);});
    setCommentText(""); setCommentImage(null);
    onComment(post.id, nc);
  }

  var S = {
    card:{ background:"#161b22", border:"1px solid #30363d", borderRadius:12, marginBottom:10 },
    header:{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px 8px" },
    name:{ fontSize:".88rem", fontWeight:700, color:"#e6edf3" },
    tag:{ fontSize:".62rem", fontWeight:700, padding:"1px 7px", borderRadius:99, background:tagColor+"20", color:tagColor, border:"1px solid "+tagColor+"40" },
    time:{ fontSize:".7rem", color:"#6e7681" },
    content:{ padding:"0 14px 10px", fontSize:".88rem", color:"#c9d1d9", lineHeight:1.7, whiteSpace:"pre-wrap" },
    divider:{ height:"1px", background:"#21262d", margin:"0" },
    actionsRow:{ display:"flex" },
    actionBtn:function(active, color){ return { flex:1, padding:"9px 4px", background:"none", border:"none", cursor:"pointer", color: active ? color : "#6e7681", fontSize:".78rem", fontWeight:600, transition:"color .15s, background .15s" }; },
    statsRow:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 14px", fontSize:".72rem", color:"#6e7681" },
    commentSection:{ padding:"10px 14px 12px", borderTop:"1px solid #21262d", background:"#0d1117" },
    commentInput:{ display:"flex", gap:8, alignItems:"center", background:"#21262d", borderRadius:20, padding:"7px 12px" },
  };

  return (
    <div style={S.card}>
      {/* Header */}
      <div style={S.header}>
        <Avatar initials={post.avatar} color={post.color} size={38}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
            <span style={S.name}>{post.author}</span>
            <span style={S.tag}>{post.tag}</span>
          </div>
          <span style={S.time}>{post.time}</span>
        </div>
        <button onClick={function(){onBookmark(post.id);}}
          style={{ background:"none", border:"none", cursor:"pointer", color:post.bookmarked?"#f0a500":"#6e7681", fontSize:".85rem", padding:4 }}>
          {post.bookmarked ? "🔖" : "🏷️"}
        </button>
      </div>

      {/* Text content */}
      {post.content ? <div style={S.content}>{post.content}</div> : null}

      {/* Image — full width, max 380px height */}
      {post.image ? (
        <div style={{ borderTop:"1px solid #21262d", borderBottom:"1px solid #21262d" }}>
          <img src={post.image} alt=""
            style={{ display:"block", width:"100%", maxHeight:380, objectFit:"contain", background:"#0d1117" }}/>
        </div>
      ) : null}

      {/* Reaction badges */}
      {Object.keys(post.reactions).length > 0 ? (
        <div style={{ display:"flex", gap:5, padding:"8px 14px 0", flexWrap:"wrap" }}>
          {Object.entries(post.reactions).map(function(e) {
            return (
              <button key={e[0]} onClick={function(){onReact(post.id,e[0]);}}
                style={{ display:"flex", alignItems:"center", gap:3, padding:"2px 8px", borderRadius:99, background:"#21262d", border:"1px solid #30363d", cursor:"pointer", fontSize:".75rem", color:"#8b949e" }}>
                {e[0]} <span style={{ fontWeight:700, color:"#c9d1d9" }}>{e[1]}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Stats */}
      <div style={S.statsRow}>
        <span>{post.likes > 0 ? "❤️ " + post.likes : ""}</span>
        <button onClick={function(){setShowComments(function(v){return !v;});}}
          style={{ background:"none", border:"none", cursor:"pointer", color:"#6e7681", fontSize:".72rem", padding:0 }}>
          {comments.length > 0 ? comments.length + (comments.length === 1 ? " comment" : " comments") : ""}
        </button>
      </div>

      {/* Divider */}
      <div style={S.divider}/>

      {/* Action buttons */}
      <div style={S.actionsRow}>
        <button onClick={function(){onLike(post.id);}}
          style={S.actionBtn(post.liked, "#ef4444")}
          onMouseEnter={function(e){e.currentTarget.style.background="#21262d";e.currentTarget.style.color="#ef4444";}}
          onMouseLeave={function(e){e.currentTarget.style.background="none";e.currentTarget.style.color=post.liked?"#ef4444":"#6e7681";}}>
          {post.liked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <button onClick={function(){setShowReactions(function(v){return !v;});}}
          style={S.actionBtn(showReactions, "#f0a500")}
          onMouseEnter={function(e){e.currentTarget.style.background="#21262d";e.currentTarget.style.color="#f0a500";}}
          onMouseLeave={function(e){e.currentTarget.style.background="none";e.currentTarget.style.color=showReactions?"#f0a500":"#6e7681";}}>
          😊 React
        </button>
        <button onClick={function(){setShowComments(function(v){return !v;});}}
          style={S.actionBtn(showComments, "#60a5fa")}
          onMouseEnter={function(e){e.currentTarget.style.background="#21262d";e.currentTarget.style.color="#60a5fa";}}
          onMouseLeave={function(e){e.currentTarget.style.background="none";e.currentTarget.style.color=showComments?"#60a5fa":"#6e7681";}}>
          💬 Comment
        </button>
        <button style={S.actionBtn(false, "#00d4aa")}
          onMouseEnter={function(e){e.currentTarget.style.background="#21262d";e.currentTarget.style.color="#00d4aa";}}
          onMouseLeave={function(e){e.currentTarget.style.background="none";e.currentTarget.style.color="#6e7681";}}>
          ↗ Share
        </button>
      </div>

      {/* Emoji picker */}
      {showReactions ? (
        <div style={{ display:"flex", gap:4, padding:"8px 14px", background:"#0d1117", borderTop:"1px solid #21262d" }}>
          {REACTIONS.map(function(r) {
            return (
              <button key={r} onClick={function(){onReact(post.id,r);setShowReactions(false);}}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.35rem", padding:"3px 5px", borderRadius:8, transition:"transform .12s" }}
                onMouseEnter={function(e){e.currentTarget.style.transform="scale(1.3)";}}
                onMouseLeave={function(e){e.currentTarget.style.transform="scale(1)";}}>
                {r}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Comments */}
      {showComments ? (
        <div style={S.commentSection}>
          {comments.length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
              {comments.map(function(c){return <CommentItem key={c.id} c={c} depth={0}/>;}) }
            </div>
          ) : null}
          {/* Comment input */}
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <Avatar initials="ME" color="#f0a500" size={32}/>
            <div style={{ flex:1, background:"#21262d", border:"1px solid #30363d", borderRadius:20, padding:"8px 12px 8px 14px" }}>
              {commentImage ? (
                <div style={{ position:"relative", display:"inline-block", marginBottom:8 }}>
                  <img src={commentImage} alt="" style={{ height:60, borderRadius:8, display:"block" }}/>
                  <button onClick={function(){setCommentImage(null);}}
                    style={{ position:"absolute", top:-5, right:-5, width:16, height:16, borderRadius:"50%", background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", fontSize:"9px", display:"grid", placeItems:"center" }}>✕</button>
                </div>
              ) : null}
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <textarea value={commentText} onChange={function(e){setCommentText(e.target.value);}}
                  onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submitComment();}}}
                  placeholder="Write a comment... (Enter to post)" rows={1}
                  style={{ flex:1, background:"none", border:"none", outline:"none", color:"#c9d1d9", fontFamily:"inherit", fontSize:".85rem", resize:"none", lineHeight:1.5, minHeight:20 }}/>
                <button onClick={function(){commentImgRef.current&&commentImgRef.current.click();}}
                  style={{ background:"none", border:"none", cursor:"pointer", color:"#6e7681", fontSize:"1rem", padding:"2px 4px", flexShrink:0, borderRadius:6, transition:"color .15s" }}
                  onMouseEnter={function(e){e.currentTarget.style.color="#60a5fa";}}
                  onMouseLeave={function(e){e.currentTarget.style.color="#6e7681";}}>🖼️</button>
                <button onClick={submitComment} disabled={!commentText.trim()&&!commentImage}
                  style={{ background:(commentText.trim()||commentImage)?"#1f6feb":"#21262d", border:"none", cursor:(commentText.trim()||commentImage)?"pointer":"default", color:(commentText.trim()||commentImage)?"#fff":"#6e7681", borderRadius:8, padding:"4px 10px", fontSize:".78rem", fontWeight:700, flexShrink:0, transition:"all .15s" }}>
                  Post
                </button>
                <input ref={commentImgRef} type="file" accept="image/*" style={{ display:"none" }}
                  onChange={function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setCommentImage(ev.target.result);};r.readAsDataURL(f);e.target.value="";}}/>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Messages tab ──────────────────────────────────────────────── */
function MessagesTab() {
  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);

  // Load conversations
  useEffect(function() {
    fetch(API + '/messages', { headers: authHeaders() })
      .then(function(r){return r.json();})
      .then(function(res) {
        if (res.success && res.data.length > 0) {
          var mapped = res.data.map(function(c) {
            var u = c.user || {};
            var name = u.name || 'Unknown';
            var initials = name.split(' ').map(function(n){return n[0];}).join('').slice(0,2).toUpperCase();
            return { id: c.id || c._id, name, avatar: initials, color:'#60a5fa', lastMsg: c.lastMsg, time: c.lastAt ? timeAgoMsg(c.lastAt) : '', unread: c.unread, messages: [], userId: u._id };
          });
          setConvos(mapped);
          setActive(mapped[0]);
        } else {
          setActive(MOCK_CONVOS[0]);
        }
      })
      .catch(function() { setActive(MOCK_CONVOS[0]); });
  }, []);

  function timeAgoMsg(d) {
    var diff = Date.now() - new Date(d).getTime();
    var m = Math.floor(diff/60000);
    if (m < 1) return 'now';
    if (m < 60) return m + 'm';
    return Math.floor(m/60) + 'h';
  }

  // Load messages for active conversation
  useEffect(function() {
    if (!active || !active.userId) return;
    fetch(API + '/messages/' + active.userId, { headers: authHeaders() })
      .then(function(r){return r.json();})
      .then(function(res) {
        if (res.success) {
          var msgs = (res.data.messages || []).map(function(m) {
            return { from: m.sender && m.sender._id === active.userId ? 'them' : 'me', text: m.text, time: new Date(m.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
          });
          setActive(function(a) { return Object.assign({}, a, { messages: msgs }); });
        }
      })
      .catch(function(){});
  }, [active && active.userId]);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior:"smooth" });
  }, [active]);

  function send() {
    if (!input.trim()) return;
    var text = input.trim();
    var newMsg = { from:"me", text, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) };
    var updated = convos.map(function(c) {
      if (!active || c.id!==active.id) return c;
      return Object.assign({},c,{messages:(c.messages||[]).concat(newMsg),lastMsg:text,time:"now",unread:0});
    });
    setConvos(updated);
    setActive(function(a) { return Object.assign({},a,{messages:(a.messages||[]).concat(newMsg)}); });
    setInput("");
    if (active && active.userId) {
      fetch(API + '/messages/' + active.userId, {
        method:'POST', headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
        body: JSON.stringify({ text }),
      }).catch(function(){});
    }
  }

  var filtered = convos.filter(function(c){return !search||c.name.toLowerCase().includes(search.toLowerCase());});

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>
      <div style={{ width:280, flexShrink:0, borderRight:"1px solid "+T.bord, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid "+T.bord }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"8px 12px" }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke={T.text3} strokeWidth={1.5} strokeLinecap="round"><circle cx={6} cy={6} r={4}/><line x1={9.5} y1={9.5} x2={13} y2={13}/></svg>
            <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search messages..."
              style={{ background:"none", border:"none", outline:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".8rem", flex:1 }}/>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
          {filtered.map(function(c) {
            var isActive = active&&active.id===c.id;
            return (
              <div key={c.id} onClick={function(){setActive(c);setConvos(convos.map(function(x){return x.id===c.id?Object.assign({},x,{unread:0}):x;}));}}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px", borderRadius:12, marginBottom:4, cursor:"pointer", transition:"all .18s",
                  background:isActive?"rgba(240,165,0,.09)":"transparent", border:"1px solid "+(isActive?"rgba(240,165,0,.2)":"transparent") }}
                onMouseEnter={function(e){if(!isActive)e.currentTarget.style.background="rgba(255,255,255,.04)";}}
                onMouseLeave={function(e){if(!isActive)e.currentTarget.style.background="transparent";}}>
                <div style={{ position:"relative" }}>
                  <Avatar initials={c.avatar} color={c.color} size={40}/>
                  <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:T.green, border:"2px solid "+T.bg }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:".83rem", fontWeight:c.unread?800:600, color:isActive?T.gold:T.text }}>{c.name}</span>
                    <span style={{ fontSize:".62rem", color:T.text3 }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:".74rem", color:T.text3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.lastMsg}</div>
                </div>
                {c.unread>0 && <div style={{ width:18, height:18, borderRadius:"50%", background:T.gold, display:"grid", placeItems:"center", fontSize:".6rem", fontWeight:900, color:"#030810", flexShrink:0 }}>{c.unread}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ padding:"10px 12px", borderTop:"1px solid "+T.bord }}>
          <button style={{ width:"100%", padding:"9px", borderRadius:10, border:"1px solid rgba(240,165,0,.25)", background:"rgba(240,165,0,.07)", color:T.gold, fontSize:".78rem", fontWeight:700, cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={function(e){e.currentTarget.style.background="rgba(240,165,0,.14)";}}
            onMouseLeave={function(e){e.currentTarget.style.background="rgba(240,165,0,.07)";}}>
            + New Message
          </button>
        </div>
      </div>
      {active && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          <div style={{ padding:"14px 20px", borderBottom:"1px solid "+T.bord, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <div style={{ position:"relative" }}>
              <Avatar initials={active.avatar} color={active.color} size={40}/>
              <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:T.green, border:"2px solid "+T.bg }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:".9rem", fontWeight:800 }}>{active.name}</div>
              <div style={{ fontSize:".7rem", color:T.green, fontWeight:600 }}>Online</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            {active.messages.map(function(msg, i) {
              var isMe = msg.from==="me";
              return (
                <div key={i} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", gap:10, alignItems:"flex-end" }}>
                  {!isMe && <Avatar initials={active.avatar} color={active.color} size={30}/>}
                  <div style={{ maxWidth:"68%" }}>
                    <div style={{ padding:"11px 15px", borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",
                      background:isMe?"linear-gradient(135deg,#f0a500,#ff7a30)":"rgba(255,255,255,.06)",
                      border:isMe?"none":"1px solid rgba(255,255,255,.08)",
                      color:isMe?"#030810":T.text, fontSize:".85rem", lineHeight:1.55, fontWeight:isMe?600:400 }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize:".62rem", color:T.text3, marginTop:4, textAlign:isMe?"right":"left" }}>{msg.time}</div>
                  </div>
                  {isMe && <div style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#f0a500,#ff7a30)", display:"grid", placeItems:"center", fontSize:"10px", fontWeight:900, color:"#030810", flexShrink:0 }}>ME</div>}
                </div>
              );
            })}
            <div ref={bottomRef}/>
          </div>
          <div style={{ padding:"14px 20px", borderTop:"1px solid "+T.bord, display:"flex", gap:10, alignItems:"flex-end", flexShrink:0 }}>
            <div style={{ flex:1, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:"11px 16px" }}>
              <textarea value={input} onChange={function(e){setInput(e.target.value);}}
                onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                placeholder={"Message "+active.name+"..."} rows={1}
                style={{ width:"100%", background:"none", border:"none", outline:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".86rem", resize:"none", lineHeight:1.5 }}/>
            </div>
            <button onClick={send} disabled={!input.trim()}
              style={{ width:42, height:42, borderRadius:12, border:"none", background:input.trim()?"linear-gradient(135deg,#f0a500,#ff7a30)":"rgba(255,255,255,.06)", color:input.trim()?"#030810":T.text3, cursor:input.trim()?"pointer":"not-allowed", display:"grid", placeItems:"center", transition:"all .2s", flexShrink:0 }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M14.5 1.5l-13 5 5 2 2 5 6-12z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Community page ───────────────────────────────────────── */
const API = 'http://localhost:5001/api';
function authHeaders() {
  return { Authorization: 'Bearer ' + localStorage.getItem('token') };
}

export default function Community() {
  const { user } = useAuth();
  const meName = user?.name || "You";
  const meInitials = meName.split(' ').map(function(n){return n[0];}).join('').slice(0,2).toUpperCase();
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("explore");
  const [posts, setPosts] = useState(INIT_POSTS);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postText, setPostText] = useState("");
  const [postTag, setPostTag] = useState("Discussion");
  const [postImage, setPostImage] = useState(null);       // preview (blob URL)
  const [postImageFile, setPostImageFile] = useState(null); // actual File
  const [filterTag, setFilterTag] = useState("All");
  const postImgRef = useRef(null);

  // Fetch posts when Feed tab opens
  useEffect(function() {
    if (tab !== "feed") return;
    setLoadingPosts(true);
    var url = API + '/posts' + (filterTag !== 'All' ? '?tag=' + encodeURIComponent(filterTag) : '');
    fetch(url, { headers: authHeaders() })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.success) {
          setPosts(res.data.map(function(p) {
            var authorName = p.author && p.author.name ? p.author.name : (typeof p.author === 'string' ? p.author : 'Unknown');
            var normalizedComments = (p.comments || []).map(function(c) {
              var cAuthorName = c.author && c.author.name ? c.author.name : (typeof c.author === 'string' ? c.author : 'User');
              return Object.assign({}, c, {
                author: cAuthorName,
                avatar: cAuthorName.split(' ').map(function(n){return n[0];}).join('').slice(0,2).toUpperCase(),
                color: '#4ade80',
                time: timeAgo(c.createdAt) || c.time || '',
                replies: (c.replies || []).map(function(r) {
                  var rAuthorName = r.author && r.author.name ? r.author.name : (typeof r.author === 'string' ? r.author : 'User');
                  return Object.assign({}, r, {
                    author: rAuthorName,
                    avatar: rAuthorName.split(' ').map(function(n){return n[0];}).join('').slice(0,2).toUpperCase(),
                    color: '#f472b6',
                    time: timeAgo(r.createdAt) || r.time || '',
                  });
                }),
              });
            });
            return Object.assign({}, p, {
              id: p.id || p._id,
              author: authorName,
              avatar: authorName.split(' ').map(function(n){return n[0];}).join('').slice(0,2).toUpperCase(),
              color: '#60a5fa',
              role: 'Student',
              course: '',
              time: timeAgo(p.createdAt),
              comments: normalizedComments,
            });
          }));
        }
      })
      .catch(function() { /* keep mock data on error */ })
      .finally(function() { setLoadingPosts(false); });
  }, [tab, filterTag]);

  function timeAgo(dateStr) {
    if (!dateStr) return '';
    var diff = Date.now() - new Date(dateStr).getTime();
    var m = Math.floor(diff/60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    var h = Math.floor(m/60);
    if (h < 24) return h + 'h ago';
    return Math.floor(h/24) + 'd ago';
  }

  function handleLike(id) {
    fetch(API + '/posts/' + id + '/like', { method:'POST', headers: authHeaders() })
      .then(function(r){return r.json();})
      .then(function(res) {
        if (res.success) {
          setPosts(function(p){return p.map(function(post){
            if (String(post.id)!==String(id)) return post;
            return Object.assign({},post,{liked:res.liked,likes:res.likes});
          });});
        }
      })
      .catch(function() {
        // optimistic fallback
        setPosts(function(p){return p.map(function(post){
          if (String(post.id)!==String(id)) return post;
          return Object.assign({},post,{liked:!post.liked,likes:post.likes+(post.liked?-1:1)});
        });});
      });
  }

  function handleBookmark(id) {
    fetch(API + '/posts/' + id + '/bookmark', { method:'POST', headers: authHeaders() })
      .then(function(r){return r.json();})
      .then(function(res) {
        if (res.success) {
          setPosts(function(p){return p.map(function(post){
            if (String(post.id)!==String(id)) return post;
            return Object.assign({},post,{bookmarked:res.bookmarked});
          });});
        }
      })
      .catch(function() {
        setPosts(function(p){return p.map(function(post){
          if (String(post.id)!==String(id)) return post;
          return Object.assign({},post,{bookmarked:!post.bookmarked});
        });});
      });
  }

  function handleReact(id, emoji) {
    fetch(API + '/posts/' + id + '/react', {
      method:'POST', headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
      body: JSON.stringify({ emoji }),
    })
      .then(function(r){return r.json();})
      .then(function(res) {
        if (res.success) {
          setPosts(function(p){return p.map(function(post){
            if (String(post.id)!==String(id)) return post;
            return Object.assign({},post,{reactions:res.reactions});
          });});
        }
      })
      .catch(function() {
        setPosts(function(p){return p.map(function(post){
          if (String(post.id)!==String(id)) return post;
          var r=Object.assign({},post.reactions);r[emoji]=(r[emoji]||0)+1;
          return Object.assign({},post,{reactions:r});
        });});
      });
  }

  function handleComment(postId, comment) {
    fetch(API + '/posts/' + postId + '/comments', {
      method:'POST', headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
      body: JSON.stringify({ text: comment.text, image: comment.image }),
    }).catch(function(){});
  }

  function submitPost() {
    if (!postText.trim() && !postImageFile) return;
    var previewUrl = postImage;
    var file = postImageFile;
    var tempId = Date.now();
    var np = { id: tempId, author:"You", avatar:"ME", color:"#f0a500", role:"Student", course:"General", time:"just now",
      content:postText.trim(), likes:0, tag:postTag, bookmarked:false, reactions:{}, comments:[], image:previewUrl };
    setPosts(function(p){return [np].concat(p);});
    setPostText(""); setPostImage(null); setPostImageFile(null);

    function doPost(imageUrl) {
      fetch(API + '/posts', {
        method:'POST', headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
        body: JSON.stringify({ content: np.content, tag: postTag, image: imageUrl || null }),
      }).then(function(r){return r.json();}).then(function(res){
        if (res.success) {
          var authorName = res.data.author && res.data.author.name ? res.data.author.name : 'You';
          var savedImage = res.data.image || imageUrl || previewUrl || null;
          setPosts(function(p){ return p.map(function(x){ return x.id===tempId ? Object.assign({},x,{ id:res.data.id||res.data._id, image: savedImage, author:authorName }) : x; }); });
        }
      }).catch(function(){});
    }

    if (file) {
      var fd = new FormData();
      fd.append('image', file);
      fetch(API + '/upload', { method:'POST', headers: authHeaders(), body: fd })
        .then(function(r){return r.json();})
        .then(function(res){
          if (res.success && res.url) {
            doPost(res.url);
          } else {
            doPost(null);
          }
        })
        .catch(function(){ doPost(null); });
    } else {
      doPost(null);
    }
  }

  var allTags = ["All"].concat(Object.keys(TAG_COL));
  var visiblePosts = filterTag==="All" ? posts : posts.filter(function(p){return p.tag===filterTag;});

  var TABS = [
    { id:"explore",     label:"🌐 Explore" },
    { id:"feed",        label:"📰 Feed" },
    { id:"rooms",       label:"💬 Rooms" },
    { id:"messages",    label:"✉️ Messages" },
    { id:"leaderboard", label:"🏆 Leaderboard" },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", width:"100vw", background:T.bg, color:T.text, fontFamily:"Satoshi,sans-serif", overflow:"hidden" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        <TopBar title={<>Student <em style={{ fontStyle:"italic", color:T.gold }}>Community</em></>} collapsed={collapsed} setCollapsed={setCollapsed}>
          {/* Tabs inside TopBar */}
          <div style={{ display:"flex", gap:2, marginLeft:16 }}>
            {TABS.map(function(t) {
              var on = tab===t.id;
              return (
                <button key={t.id} onClick={function(){setTab(t.id);}}
                  style={{ padding:"8px 16px", background: on ? "rgba(240,165,0,.1)" : "none",
                    border:"1px solid "+(on ? "rgba(240,165,0,.25)" : "transparent"),
                    borderRadius:9, color:on?T.gold:T.text2, fontSize:".78rem", fontWeight:on?800:500,
                    cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap" }}
                  onMouseEnter={function(e){ if(!on){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color=T.text; } }}
                  onMouseLeave={function(e){ if(!on){ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.text2; } }}>
                  {t.label}
                </button>
              );
            })}
          </div>
        </TopBar>

        {/* No separate tab bar — tabs are in TopBar now */}

        {/* Explore tab — full scrollable */}
        {tab==="explore" && <ExploreSection onJoin={function(){ setTab("feed"); }}/>}

        {/* Messages tab */}
        {tab==="messages" && <MessagesTab/>}

        {/* Other tabs */}
        {tab!=="explore" && tab!=="messages" && (
          <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>
            <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", minWidth:0 }}>
              <div style={{ maxWidth:560, margin:"0 auto", display:"flex", flexDirection:"column", gap:10 }}>

              {tab==="feed" && (
                <>
                  {/* Composer */}
                  <div style={{ background:T.card, border:"1px solid "+T.bord, borderRadius:18, padding:18 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <Avatar initials="ME" color="#f0a500" size={40}/>
                      <div style={{ flex:1 }}>
                        {/* WhatsApp style input row */}
                        <div style={{ display:"flex", alignItems:"flex-end", gap:8, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"10px 12px", transition:"border-color .2s" }}>
                          <div style={{ flex:1 }}>
                            {postImage && (
                              <div style={{ position:"relative", marginBottom:8, display:"inline-block" }}>
                                <img src={postImage} alt="" style={{ maxHeight:100, borderRadius:8, border:"1px solid rgba(255,255,255,.1)", display:"block" }}/>
                                <button onClick={function(){setPostImage(null); setPostImageFile(null);}} style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", fontSize:"9px", display:"grid", placeItems:"center", fontWeight:900 }}>✕</button>
                              </div>
                            )}
                            <textarea value={postText} onChange={function(e){setPostText(e.target.value);}}
                              placeholder="Share something with the community..."
                              style={{ width:"100%", minHeight:72, background:"none", border:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".86rem", outline:"none", resize:"none", lineHeight:1.6 }}
                              onFocus={function(e){e.target.parentElement.parentElement.style.borderColor="rgba(240,165,0,.3)";}}
                              onBlur={function(e){e.target.parentElement.parentElement.style.borderColor="rgba(255,255,255,.07)";}}/>
                          </div>
                          {/* 🖼️ icon */}
                          <button onClick={function(){postImgRef.current&&postImgRef.current.click();}}
                            style={{ background:"none", border:"none", cursor:"pointer", color:T.text3, fontSize:"1.2rem", padding:"4px 6px", borderRadius:8, flexShrink:0, transition:"color .15s", marginBottom:2 }}
                            onMouseEnter={function(e){e.currentTarget.style.color=T.blue;}}
                            onMouseLeave={function(e){e.currentTarget.style.color=T.text3;}}>
                            🖼️
                          </button>
                          <input ref={postImgRef} type="file" accept="image/*" style={{ display:"none" }}
                            onChange={function(e){var f=e.target.files[0];if(!f)return;setPostImageFile(f);setPostImage(URL.createObjectURL(f));e.target.value="";}}/>
                          {/* Send button */}
                          <button onClick={submitPost} disabled={!postText.trim()&&!postImage}
                            style={{ width:38, height:38, borderRadius:"50%", border:"none", background:(postText.trim()||postImage)?"linear-gradient(135deg,#f0a500,#ff7a30)":"rgba(255,255,255,.06)", color:(postText.trim()||postImage)?"#030810":T.text3, cursor:(postText.trim()||postImage)?"pointer":"not-allowed", display:"grid", placeItems:"center", flexShrink:0, transition:"all .2s" }}>
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                          </button>
                        </div>
                        {/* Tag selector */}
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                          {Object.keys(TAG_COL).map(function(t) {
                            var on = postTag===t;
                            return (
                              <button key={t} onClick={function(){setPostTag(t);}}
                                style={{ padding:"4px 11px", borderRadius:99, fontSize:".68rem", fontWeight:700, cursor:"pointer", transition:"all .18s",
                                  background:on?TAG_COL[t]+"22":"rgba(255,255,255,.04)",
                                  border:"1px solid "+(on?TAG_COL[t]+"55":"rgba(255,255,255,.07)"),
                                  color:on?TAG_COL[t]:T.text3 }}>{t}</button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tag filter */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {allTags.map(function(t) {
                      var on = filterTag===t;
                      var col = TAG_COL[t]||T.text2;
                      return (
                        <button key={t} onClick={function(){setFilterTag(t);}}
                          style={{ padding:"5px 13px", borderRadius:99, fontSize:".72rem", fontWeight:700, cursor:"pointer", transition:"all .18s",
                            background:on?col+"18":"rgba(255,255,255,.04)",
                            border:"1px solid "+(on?col+"40":"rgba(255,255,255,.07)"),
                            color:on?col:T.text3 }}>{t}</button>
                      );
                    })}
                  </div>
                  {visiblePosts.map(function(post) {
                    return <PostCard key={post.id} post={post} onLike={handleLike} onBookmark={handleBookmark} onReact={handleReact} onComment={handleComment}/>;
                  })}
                </>
              )}

              {tab==="rooms" && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
                  {MOCK_ROOMS.map(function(room) {
                    return (
                      <div key={room.id} style={{ background:T.card, border:"1px solid "+T.bord, borderRadius:16, padding:20, cursor:"pointer", transition:"all .2s" }}
                        onMouseEnter={function(e){e.currentTarget.style.borderColor=room.color+"44";e.currentTarget.style.transform="translateY(-3px)";}}
                        onMouseLeave={function(e){e.currentTarget.style.borderColor=T.bord;e.currentTarget.style.transform="none";}}>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                          <div style={{ width:46, height:46, borderRadius:13, background:room.color+"18", border:"1px solid "+room.color+"30", display:"grid", placeItems:"center", fontSize:"1.3rem" }}>{room.ico}</div>
                          <div>
                            <div style={{ fontSize:".9rem", fontWeight:800 }}>{room.name}</div>
                            <div style={{ fontSize:".7rem", color:T.text3 }}>{room.members} members</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <div style={{ width:7, height:7, borderRadius:"50%", background:T.green }}/>
                            <span style={{ fontSize:".72rem", color:T.green, fontWeight:600 }}>{room.active} online</span>
                          </div>
                          <button style={{ padding:"5px 14px", borderRadius:8, border:"1px solid "+room.color+"40", background:room.color+"12", color:room.color, fontSize:".72rem", fontWeight:700, cursor:"pointer" }}>Join</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {tab==="leaderboard" && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    { rank:1, name:"Arjun V.", pts:2840, badge:"🥇", streak:14 },
                    { rank:2, name:"Priya K.", pts:2610, badge:"🥈", streak:9  },
                    { rank:3, name:"Rahul M.", pts:2390, badge:"🥉", streak:7  },
                    { rank:4, name:"Sneha T.", pts:2100, badge:"",   streak:5  },
                    { rank:5, name:"Meera S.", pts:1980, badge:"",   streak:3  },
                    { rank:6, name:"You",      pts:1540, badge:"",   streak:2, isMe:true },
                  ].map(function(u) {
                    return (
                      <div key={u.rank} style={{ background:u.isMe?"rgba(240,165,0,.07)":T.card, border:"1px solid "+(u.isMe?"rgba(240,165,0,.25)":T.bord), borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", display:"grid", placeItems:"center", fontSize:u.badge?"1.1rem":".82rem", fontWeight:900, color:u.rank<=3?T.gold:T.text3, flexShrink:0 }}>
                          {u.badge||"#"+u.rank}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:".88rem", fontWeight:700, color:u.isMe?T.gold:T.text }}>{u.name} {u.isMe&&<span style={{ fontSize:".65rem", color:T.gold }}>(you)</span>}</div>
                          <div style={{ fontSize:".7rem", color:T.text3 }}>🔥 {u.streak} day streak</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:"1rem", fontWeight:900, color:u.rank===1?T.gold:T.text }}>{u.pts.toLocaleString()}</div>
                          <div style={{ fontSize:".65rem", color:T.text3 }}>points</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ height:24 }}/>
              </div>
            </div>

            {(tab==="feed"||tab==="rooms") && (
              <div style={{ width:240, flexShrink:0, borderLeft:"1px solid "+T.bord, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:18 }}>
                <div>
                  <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Active Rooms</div>
                  {MOCK_ROOMS.slice(0,3).map(function(room) {
                    return (
                      <div key={room.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:10, marginBottom:6, cursor:"pointer", transition:"background .2s" }}
                        onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,.04)";}}
                        onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                        <div style={{ width:32, height:32, borderRadius:9, background:room.color+"18", display:"grid", placeItems:"center", fontSize:".9rem", flexShrink:0 }}>{room.ico}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:".78rem", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{room.name}</div>
                          <div style={{ fontSize:".65rem", color:T.green }}>{room.active} online</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Trending</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                    {["#DSA","#ReactJS","#ML","#AWS","#SystemDesign","#Python","#UIDesign"].map(function(tag) {
                      return (
                        <span key={tag} style={{ padding:"4px 10px", borderRadius:99, fontSize:".7rem", fontWeight:600, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:T.text2, cursor:"pointer", transition:"all .2s" }}
                          onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(240,165,0,.3)";e.currentTarget.style.color=T.gold;}}
                          onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.color=T.text2;}}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ padding:16, borderRadius:14, background:"rgba(240,165,0,.06)", border:"1px solid rgba(240,165,0,.15)" }}>
                  <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.gold, marginBottom:12 }}>Community Stats</div>
                  {[["👥","Members","1,248"],["💬","Posts Today","84"],["🔥","Active Now","37"],["🏆","Top Streak","21 days"]].map(function(s) {
                    return (
                      <div key={s[1]} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:".75rem", color:T.text2 }}>{s[0]} {s[1]}</span>
                        <span style={{ fontSize:".78rem", fontWeight:800 }}>{s[2]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
