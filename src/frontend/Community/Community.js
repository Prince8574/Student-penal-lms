import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../context/AuthContext";
import "./Community.css";
import "./ExploreCommunity.css";
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
const EX_MEMBERS = [];
const EX_FEED = [];
const EX_STATS = [
  { label:"Members",     value:"—", icon:"👥", change:"", c:"#4DFFCC" },
  { label:"Posts Today", value:"—", icon:"📝", change:"", c:"#FF2D78" },
  { label:"Projects",    value:"—", icon:"🚀", change:"", c:"#A78BFA" },
  { label:"Countries",   value:"—", icon:"🌍", change:"", c:"#FBCF4A" },
];
const EX_CATS = [];

/* ─── Feed data ─────────────────────────────────────────────────── */
const INIT_POSTS = [];

const MOCK_ROOMS = [
  { id:1, name:"DSA Study Hall",  members:0, active:0, color:"#60a5fa", ico:"🧮" },
  { id:2, name:"ML Discussion",   members:0, active:0, color:"#a78bfa", ico:"🤖" },
  { id:3, name:"Web Dev Lounge",  members:0, active:0, color:"#4ade80", ico:"🌍" },
];

const MOCK_CONVOS = [];

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
      pos[i*3]=r*Math.sin(phi)*Math.cos(theta);
      pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
      pos[i*3+2]=r*Math.cos(phi);
      var c = palette[Math.floor(Math.random()*palette.length)];
      cols[i*3]=c.r;
      cols[i*3+1]=c.g;
      cols[i*3+2]=c.b;
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

function ExploreSection({ onJoin }) {
  const canvasRef = useRef(null);
  const [activeCat, setActiveCat] = useState("All");

  return (
    <div style={{ overflowY:"auto", flex:1, background:"#050814" }}>

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
function CommentItem({ c, depth, postId, currentUserName, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(c.likes || 0);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(c.replies || []);
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(c.text);
  const [text, setText] = useState(c.text);
  const [deleted, setDeleted] = useState(false);
  const [hovered, setHovered] = useState(false);

  // isOwn: check by name string match
  var authorName = typeof c.author === 'object' ? (c.author && c.author.name ? c.author.name : '') : (c.author || '');
  var isOwn = currentUserName && authorName && authorName.toLowerCase() === currentUserName.toLowerCase();

  function handleDelete() {
    setDeleted(true);
    setShowMenu(false);
    if (postId && c.id) {
      fetch('http://localhost:5001/api/posts/' + postId + '/comments/' + c.id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      }).catch(function(){});
    }
    if (onDelete) onDelete(c.id);
  }

  function handleSaveEdit() {
    if (!editText.trim()) return;
    setText(editText);
    setEditing(false);
    if (postId && c.id) {
      fetch('http://localhost:5001/api/posts/' + postId + '/comments/' + c.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ text: editText.trim() })
      }).catch(function(){});
    }
  }

  function submitReply() {
    if (!replyText.trim()) return;
    setReplies(function(p) { return p.concat({ id: Date.now(), author: currentUserName || 'You', avatar: 'ME', color: '#f0a500', text: replyText.trim(), time: 'just now', likes: 0, replies: [] }); });
    setReplyText(''); setShowReply(false);
  }

  if (deleted) return null;

  return (
    <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
      <Avatar initials={c.avatar || (authorName ? authorName[0].toUpperCase() : 'U')} color={c.color || '#60a5fa'} size={depth > 0 ? 26 : 32}/>
      <div style={{ flex:1, minWidth:0 }}>
        {/* Bubble */}
        <div style={{ position:'relative', display:'inline-block', maxWidth:'100%', minWidth:120 }}
          onMouseEnter={function(){setHovered(true);}}
          onMouseLeave={function(){setHovered(false); if(!showMenu) setShowMenu(false);}}>
          <div style={{ background:'rgba(255,255,255,.06)', borderRadius:14, padding:'8px 36px 8px 12px' }}>
            <div style={{ fontSize:'.78rem', fontWeight:700, color:'#e6edf3', marginBottom:2 }}>{authorName}</div>
            {editing ? (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <textarea value={editText} onChange={function(e){setEditText(e.target.value);}} rows={2}
                  style={{ width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.15)', borderRadius:8, padding:'5px 8px', color:'#c9d1d9', fontFamily:'inherit', fontSize:'.83rem', resize:'none', outline:'none' }}/>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={handleSaveEdit}
                    style={{ padding:'4px 12px', background:'#1f6feb', border:'none', borderRadius:7, color:'#fff', fontSize:'.75rem', fontWeight:700, cursor:'pointer' }}>Save</button>
                  <button onClick={function(){setEditText(text); setEditing(false);}}
                    style={{ padding:'4px 10px', background:'rgba(255,255,255,.06)', border:'none', borderRadius:7, color:'#8b949e', fontSize:'.75rem', cursor:'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize:'.83rem', color:'#c9d1d9', lineHeight:1.55 }}>{text}</div>
            )}
            {c.image && <img src={c.image} alt="" style={{ marginTop:6, maxWidth:'100%', borderRadius:8, maxHeight:140, objectFit:'cover', display:'block' }}/>}
          </div>

          {/* 3-dot button — always visible on hover */}
          <button onClick={function(e){e.stopPropagation(); setShowMenu(function(v){return !v;});}}
            style={{ position:'absolute', top:6, right:6, background:'none', border:'none', cursor:'pointer',
              color:'#8b949e', fontSize:'1rem', padding:'1px 4px', borderRadius:5, lineHeight:1,
              opacity: hovered || showMenu ? 1 : 0, transition:'opacity .15s' }}>
            ···
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div style={{ position:'absolute', top:28, right:0, background:'#1c2128', border:'1px solid #30363d', borderRadius:10, padding:'4px 0', zIndex:50, minWidth:120, boxShadow:'0 8px 24px rgba(0,0,0,.7)' }}
              onMouseLeave={function(){setShowMenu(false);}}>
              {isOwn && (
                <button onClick={function(){setEditing(true); setShowMenu(false);}}
                  style={{ display:'block', width:'100%', padding:'8px 14px', background:'none', border:'none', cursor:'pointer', color:'#c9d1d9', fontSize:'.82rem', textAlign:'left' }}
                  onMouseEnter={function(e){e.currentTarget.style.background='rgba(255,255,255,.06)';}}
                  onMouseLeave={function(e){e.currentTarget.style.background='none';}}>
                  ✏️ Edit
                </button>
              )}
              {isOwn && (
                <button onClick={handleDelete}
                  style={{ display:'block', width:'100%', padding:'8px 14px', background:'none', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'.82rem', textAlign:'left' }}
                  onMouseEnter={function(e){e.currentTarget.style.background='rgba(239,68,68,.08)';}}
                  onMouseLeave={function(e){e.currentTarget.style.background='none';}}>
                  🗑️ Delete
                </button>
              )}
              <button onClick={function(){setDeleted(true); setShowMenu(false);}}
                style={{ display:'block', width:'100%', padding:'8px 14px', background:'none', border:'none', cursor:'pointer', color:'#8b949e', fontSize:'.82rem', textAlign:'left' }}
                onMouseEnter={function(e){e.currentTarget.style.background='rgba(255,255,255,.05)';}}
                onMouseLeave={function(e){e.currentTarget.style.background='none';}}>
                🚫 Hide
              </button>
            </div>
          )}
        </div>

        {/* Actions row */}
        <div style={{ display:'flex', alignItems:'center', gap:12, paddingLeft:4, marginTop:4 }}>
          <span style={{ fontSize:'.68rem', color:'#6e7681' }}>{c.time}</span>
          <button onClick={function(){setLiked(function(v){return !v;}); setLikes(function(n){return n+(liked?-1:1);});}}
            style={{ background:'none', border:'none', cursor:'pointer', color:liked?'#ef4444':'#6e7681', fontSize:'.72rem', fontWeight:700, padding:0 }}>
            {liked ? '❤️' : 'Like'}{likes > 0 ? ' '+likes : ''}
          </button>
          {depth === 0 && (
            <button onClick={function(){setShowReply(function(v){return !v;});}}
              style={{ background:'none', border:'none', cursor:'pointer', color:showReply?'#60a5fa':'#6e7681', fontSize:'.72rem', fontWeight:700, padding:0 }}>
              Reply
            </button>
          )}
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8, paddingLeft:4 }}>
            {replies.map(function(r){ return <CommentItem key={r.id} c={r} depth={1} postId={postId} currentUserName={currentUserName}/>; })}
          </div>
        )}

        {/* Reply input */}
        {showReply && (
          <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
            <Avatar initials="ME" color="#f0a500" size={26}/>
            <div style={{ flex:1, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:'6px 12px', display:'flex', alignItems:'center', gap:6 }}>
              <textarea value={replyText} onChange={function(e){setReplyText(e.target.value);}}
                onKeyDown={function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitReply();}}}
                placeholder="Write a reply..." rows={1}
                style={{ flex:1, background:'none', border:'none', outline:'none', color:'#c9d1d9', fontFamily:'inherit', fontSize:'.8rem', resize:'none', lineHeight:1.5 }}/>
              <button onClick={submitReply} disabled={!replyText.trim()}
                style={{ background:'none', border:'none', cursor:replyText.trim()?'pointer':'not-allowed', color:replyText.trim()?'#60a5fa':'#6e7681', fontSize:'.8rem', fontWeight:700, padding:0 }}>
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
function PostCard({ post, onLike, onBookmark, onReact, onComment, currentUserName }) {
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
              {comments.map(function(c){return <CommentItem key={c.id} c={c} depth={0} postId={post.id} currentUserName={currentUserName}/>;}) }
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
          setActive(null);
        }
      })
      .catch(function() { setActive(null); });
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
  const [postImage, setPostImage] = useState(null);
  const [postImageFile, setPostImageFile] = useState(null);
  const [filterTag, setFilterTag] = useState("All");
  const [communityStats, setCommunityStats] = useState({ members:0, postsToday:0, trendingTags:[] });
  const postImgRef = useRef(null);

  useEffect(function() {
    fetch(API + '/community/stats', { headers: authHeaders() })
      .then(function(r){return r.json();})
      .then(function(res){ if(res.success) setCommunityStats(res.data); })
      .catch(function(){});
  }, []);

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
    { id:"explore",  label:"🌐 Explore" },
    { id:"feed",     label:"📰 Feed" },
    { id:"messages", label:"✉️ Messages" },
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
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, position:"relative" }}>
              {/* Scrollable posts area */}
              <div style={{ flex:1, overflowY:"auto", padding:"20px 24px 100px", minWidth:0 }}>
                <div style={{ maxWidth:560, margin:"0 auto", display:"flex", flexDirection:"column", gap:10 }}>

              {tab==="feed" && (
                <>
                  {visiblePosts.map(function(post) {
                    return <PostCard key={post.id} post={post} onLike={handleLike} onBookmark={handleBookmark} onReact={handleReact} onComment={handleComment} currentUserName={meName}/>;
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

              {/* Fixed bottom composer — only on feed tab */}
              {tab==="feed" && (
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:T.bg, borderTop:"1px solid "+T.bord, padding:"8px 16px 10px", zIndex:10 }}>
                  {/* Tag filter row */}
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
                    {allTags.map(function(t) {
                      var on = filterTag===t;
                      var col = TAG_COL[t]||T.text2;
                      return (
                        <button key={t} onClick={function(){setFilterTag(t);}}
                          style={{ padding:"3px 10px", borderRadius:99, fontSize:".68rem", fontWeight:700, cursor:"pointer", transition:"all .15s",
                            background:on?col+"18":"rgba(255,255,255,.04)",
                            border:"1px solid "+(on?col+"40":"rgba(255,255,255,.07)"),
                            color:on?col:T.text3 }}>{t}</button>
                      );
                    })}
                  </div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:10 }}>
                    <Avatar initials="ME" color="#f0a500" size={36}/>
                    <div style={{ flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:22, padding:"8px 14px", display:"flex", alignItems:"flex-end", gap:8 }}>
                      <div style={{ flex:1 }}>
                        {postImage && (
                          <div style={{ position:"relative", marginBottom:6, display:"inline-block" }}>
                            <img src={postImage} alt="" style={{ maxHeight:80, borderRadius:8, border:"1px solid rgba(255,255,255,.1)", display:"block" }}/>
                            <button onClick={function(){setPostImage(null); setPostImageFile(null);}} style={{ position:"absolute", top:-5, right:-5, width:16, height:16, borderRadius:"50%", background:"#ef4444", border:"none", color:"#fff", cursor:"pointer", fontSize:"8px", display:"grid", placeItems:"center" }}>✕</button>
                          </div>
                        )}
                        <textarea value={postText} onChange={function(e){setPostText(e.target.value);}}
                          placeholder="Share something with the community..."
                          rows={1}
                          style={{ width:"100%", background:"none", border:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".88rem", outline:"none", resize:"none", lineHeight:1.6, maxHeight:120, overflowY:"auto" }}/>
                      </div>
                      <button onClick={function(){postImgRef.current&&postImgRef.current.click();}}
                        style={{ background:"none", border:"none", cursor:"pointer", color:T.text3, fontSize:"1.1rem", padding:"2px 4px", flexShrink:0, transition:"color .15s" }}
                        onMouseEnter={function(e){e.currentTarget.style.color=T.blue;}}
                        onMouseLeave={function(e){e.currentTarget.style.color=T.text3;}}>🖼️</button>
                      <input ref={postImgRef} type="file" accept="image/*" style={{ display:"none" }}
                        onChange={function(e){var f=e.target.files[0];if(!f)return;setPostImageFile(f);setPostImage(URL.createObjectURL(f));e.target.value="";}}/>
                    </div>
                    <button onClick={submitPost} disabled={!postText.trim()&&!postImage}
                      style={{ width:40, height:40, borderRadius:"50%", border:"none", background:(postText.trim()||postImage)?"linear-gradient(135deg,#f0a500,#ff7a30)":"rgba(255,255,255,.06)", color:(postText.trim()||postImage)?"#030810":T.text3, cursor:(postText.trim()||postImage)?"pointer":"not-allowed", display:"grid", placeItems:"center", flexShrink:0, transition:"all .2s" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                    </button>
                  </div>
                </div>
              )}
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
                    {(communityStats.trendingTags.length > 0
                      ? communityStats.trendingTags.slice(0,7).map(function(t){ return '#'+t.tag; })
                      : ["#DSA","#ReactJS","#ML","#AWS","#SystemDesign","#Python","#UIDesign"]
                    ).map(function(tag) {
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
                  {[
                    ["👥","Members", communityStats.members.toLocaleString()],
                    ["💬","Posts Today", communityStats.postsToday.toString()],
                    ["📝","Total Posts", (communityStats.totalPosts||0).toString()],
                  ].map(function(s) {
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
