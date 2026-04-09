import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import * as THREE from "three";
import API_BASE from '../../config/api';
import "./LearnModule.css";

const T = {
  bg:"#030810", text:"#f0f6ff", text2:"#8899b8", text3:"#3a4f6e",
  gold:"#f0a500", green:"#4ade80", purple:"#7c2fff", red:"#ef4444", teal:"#00d4aa",
};

/* ─── THREE.JS SPACE BG ─── */
function SpaceBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    } catch(e) {
      console.warn('[WebGL] LearnModule background skipped:', e.message);
      return;
    }
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const N = 2800;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random()-.5)*10;
      pos[i*3+1] = (Math.random()-.5)*10;
      pos[i*3+2] = (Math.random()-.5)*10;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color:0xaaccff, size:0.012, transparent:true, opacity:0.7, sizeAttenuation:true }));
    scene.add(stars);

    // Nebula orbs
    const addOrb = (x,y,z,color,r) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r,16,16), new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.04 }));
      m.position.set(x,y,z); scene.add(m); return m;
    };
    const o1 = addOrb(-2,1,-3,0x7c2fff,2.2);
    const o2 = addOrb(2.5,-1,-4,0x00d4aa,1.8);
    const o3 = addOrb(0,2,-5,0xf0a500,1.5);

    // Gold particles
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(120*3);
    for (let i=0;i<120;i++){pPos[i*3]=(Math.random()-.5)*6;pPos[i*3+1]=(Math.random()-.5)*6;pPos[i*3+2]=(Math.random()-.5)*3;}
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos,3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:0xf0a500, size:0.018, transparent:true, opacity:0.35 }));
    scene.add(particles);

    let mx=0, my=0;
    const onMouse = e => { mx=(e.clientX/window.innerWidth-.5)*.3; my=(e.clientY/window.innerHeight-.5)*.3; };
    window.addEventListener("mousemove", onMouse);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = Date.now()*.001;
      stars.rotation.y = t*.012; stars.rotation.x = t*.006;
      particles.rotation.y = -t*.018; particles.rotation.z = t*.008;
      o1.position.y = 1+Math.sin(t*.4)*.3;
      o2.position.y = -1+Math.cos(t*.3)*.25;
      o3.position.x = Math.sin(t*.25)*.5;
      camera.position.x += (mx-camera.position.x)*.04;
      camera.position.y += (-my-camera.position.y)*.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",onMouse); window.removeEventListener("resize",onResize); renderer.dispose(); };
  }, []);
  return <canvas ref={canvasRef} className="three-canvas" />;
}

/* ─── GSAP ANIMATE HOOK ─── */
function useEnter(dep) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) gsap.fromTo(ref.current, { opacity:0, y:24 }, { opacity:1, y:0, duration:.5, ease:"power3.out" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
  return ref;
}

/* ─── VIDEO PLAYER ─── */
function VideoPlayer({ lesson, onComplete }) {
  const [done, setDone] = useState(false);
  const ref = useEnter(lesson.id);
  const url = lesson.videoUrl || lesson._coursePromo || "";
  const isYT = url && (url.includes("youtube") || url.includes("youtu.be"));
  const isDrive = url && url.includes("drive.google");
  const ytSrc = u => { const m=u.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/); return m?`https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1`:u; };
  const driveSrc = u => { const m=u.match(/\/d\/([^/]+)/); return m?`https://drive.google.com/file/d/${m[1]}/preview`:u; };

  return (
    <div ref={ref}>
      <div style={{ position:"relative", paddingBottom:"56.25%", background:"#000", borderRadius:16, overflow:"hidden", marginBottom:20, boxShadow:"0 32px 80px rgba(0,0,0,.7)" }}>
        {url ? (
          <iframe src={isYT?ytSrc(url):isDrive?driveSrc(url):url}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
            allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin" title={lesson.title}/>
        ) : (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:T.text3 }}>
            <div style={{ fontSize:"3rem" }}>🎬</div>
            <div style={{ fontSize:".84rem" }}>No video URL provided</div>
          </div>
        )}
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        {!done
          ? <button className="btn-prim" onClick={() => { setDone(true); onComplete(); }}>Mark as Complete ✓</button>
          : <span style={{ color:T.green, fontSize:".84rem", fontWeight:700 }}>✓ Completed</span>}
      </div>
    </div>
  );
}

/* ─── ARTICLE READER ─── */
function ArticleReader({ lesson, onComplete }) {
  const [done, setDone] = useState(false);
  const ref = useEnter(lesson.id);
  const toHtml = txt => {
    if (!txt) return "<p style='color:#3a4f6e;font-size:.88rem'>No content yet.</p>";
    return txt
      .replace(/^### (.+)$/gm,'<h3 style="font-size:1rem;font-weight:700;color:#f0f6ff;margin:18px 0 8px">$1</h3>')
      .replace(/^## (.+)$/gm,'<h2 style="font-family:Fraunces,serif;font-size:1.25rem;font-weight:900;color:#f0f6ff;margin:24px 0 10px;letter-spacing:-.03em">$1</h2>')
      .replace(/^# (.+)$/gm,'<h1 style="font-family:Fraunces,serif;font-size:1.6rem;font-weight:900;color:#f0f6ff;margin:28px 0 12px;letter-spacing:-.04em">$1</h1>')
      .replace(/^> (.+)$/gm,'<blockquote style="border-left:3px solid #00d4aa;padding:10px 16px;margin:14px 0;color:#4d7a9e;font-style:italic;background:rgba(0,212,170,.04);border-radius:0 8px 8px 0">$1</blockquote>')
      .replace(/^[-*] (.+)$/gm,'<div style="display:flex;gap:8px;margin:6px 0;color:#8899b8"><span style="color:#f0a500;flex-shrink:0">•</span><span>$1</span></div>')
      .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#f0f6ff;font-weight:700">$1</strong>')
      .replace(/`(.+?)`/g,'<code style="background:rgba(255,255,255,.08);padding:2px 8px;border-radius:5px;font-family:monospace;font-size:.84rem;color:#00d4aa">$1</code>')
      .replace(/\*(.+?)\*/g,'<em style="color:#8899b8">$1</em>')
      .replace(/^(?!<[hbdc])(.+)$/gm,'<p style="margin:8px 0;color:#8899b8;line-height:1.85;font-size:.9rem">$1</p>')
      .replace(/^\s*$/gm,'<div style="height:8px"></div>');
  };
  return (
    <div ref={ref}>
      <div className="card" style={{ padding:"20px 24px", marginBottom:20, minHeight:200, lineHeight:1.8 }}
        dangerouslySetInnerHTML={{ __html: toHtml(lesson.content||"") }}/>
      {!done
        ? <button className="btn-prim" onClick={() => { setDone(true); onComplete(); }}>Mark as Read ✓</button>
        : <span style={{ color:T.green, fontSize:".84rem", fontWeight:700 }}>✓ Completed</span>}
    </div>
  );
}

/* ─── DOC VIEWER ─── */
function DocViewer({ lesson, onComplete }) {
  const [done, setDone] = useState(false);
  const ref = useEnter(lesson.id);
  return (
    <div ref={ref}>
      <div className="card" style={{ marginBottom:20, overflow:"hidden" }}>
        {lesson.docUrl
          ? <iframe src={lesson.docUrl} style={{ width:"100%", height:520, border:"none", display:"block" }} title={lesson.title}/>
          : <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, gap:12, color:T.text3 }}>
              <div style={{ fontSize:"3rem" }}>📄</div>
              <div style={{ fontSize:".84rem" }}>No document URL provided</div>
            </div>}
      </div>
      {!done
        ? <button className="btn-prim" onClick={() => { setDone(true); onComplete(); }}>Mark as Read ✓</button>
        : <span style={{ color:T.green, fontSize:".84rem", fontWeight:700 }}>✓ Completed</span>}
    </div>
  );
}

/* ─── QUIZ PLAYER ─── */
function QuizPlayer({ lesson, onComplete }) {
  const quiz = lesson.quiz || { timeLimit:15, passing:70, attempts:3, questions:[] };
  const questions = quiz.questions || [];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimit||15)*60);
  const ref = useEnter(lesson.id);

  const doSubmit = () => {
    let correct = 0;
    questions.forEach((q,i) => { if ((q.type==="truefalse"||q.type==="mcq") && answers[i]===q.correct) correct++; });
    const pct = questions.length ? Math.round(correct/questions.length*100) : 0;
    setScore(pct); setSubmitted(true);
    if (pct >= (quiz.passing||70)) onComplete();
  };

  useEffect(() => {
    if (submitted || !questions.length) return;
    const t = setInterval(() => setTimeLeft(p => { if (p<=1){ clearInterval(t); doSubmit(); return 0; } return p-1; }), 1000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, questions.length]);

  const mm = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const ss = String(timeLeft%60).padStart(2,"0");
  const tc = timeLeft<60?T.red:timeLeft<180?T.gold:T.teal;

  if (!questions.length) return (
    <div ref={ref} style={{ textAlign:"center", padding:"60px 20px", color:T.text3 }}>
      <div style={{ fontSize:"3rem", marginBottom:12 }}>❓</div>
      <div>No questions added yet.</div>
    </div>
  );

  return (
    <div ref={ref}>
      <div style={{ display:"flex", gap:10, marginBottom:22, flexWrap:"wrap", alignItems:"center" }}>
        {[{l:"Questions",v:questions.length,c:T.gold},{l:"Pass Score",v:`${quiz.passing||70}%`,c:T.green},{l:"Attempts",v:quiz.attempts||3,c:T.purple}].map(({l,v,c})=>(
          <div key={l} className="card" style={{ padding:"8px 16px", borderColor:`${c}18` }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:"1rem", fontWeight:900, color:c }}>{v}</div>
            <div style={{ fontSize:".6rem", color:T.text3, marginTop:1 }}>{l}</div>
          </div>
        ))}
        {!submitted && (
          <div style={{ marginLeft:"auto", padding:"8px 16px", borderRadius:10, background:`${tc}12`, border:`1px solid ${tc}28`, fontFamily:"monospace", fontSize:"1.1rem", fontWeight:700, color:tc }}>
            {mm}:{ss}
          </div>
        )}
      </div>

      {submitted ? (
        <div className="card" style={{ textAlign:"center", padding:"48px 24px", borderColor:score>=(quiz.passing||70)?"rgba(74,222,128,.2)":"rgba(239,68,68,.2)", background:score>=(quiz.passing||70)?"rgba(74,222,128,.04)":"rgba(239,68,68,.04)" }}>
          <div style={{ fontSize:"3.5rem", marginBottom:14 }}>{score>=(quiz.passing||70)?"🎉":"😔"}</div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:"2.2rem", fontWeight:900, color:score>=(quiz.passing||70)?T.green:T.red }}>{score}%</div>
          <div style={{ fontSize:".88rem", color:T.text2, marginTop:8 }}>{score>=(quiz.passing||70)?"Passed! Great work.":"Didn't pass. Try again."}</div>
          {score<(quiz.passing||70) && (
            <button className="btn-prim" style={{ marginTop:20 }} onClick={() => { setAnswers({}); setSubmitted(false); setTimeLeft((quiz.timeLimit||15)*60); }}>
              Retry Quiz ↺
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {questions.map((q,qi) => (
            <div key={qi} className="card" style={{ padding:18 }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:14 }}>
                <div style={{ width:26, height:26, borderRadius:8, background:"rgba(240,165,0,.12)", border:"1px solid rgba(240,165,0,.25)", display:"grid", placeItems:"center", fontSize:".68rem", fontWeight:800, color:T.gold, flexShrink:0 }}>
                  {qi+1}
                </div>
                <div style={{ fontSize:".88rem", fontWeight:600, lineHeight:1.5 }}>{q.q||`Question ${qi+1}`}</div>
              </div>
              {q.type==="mcq" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(q.options||[]).map((opt,oi) => (
                    <div key={oi} className={`quiz-opt${answers[qi]===oi?" selected":""}`} onClick={() => setAnswers(a=>({...a,[qi]:oi}))}>
                      <span style={{ marginRight:10, opacity:.45, fontWeight:700 }}>{["A","B","C","D"][oi]}.</span>{opt}
                    </div>
                  ))}
                </div>
              )}
              {q.type==="truefalse" && (
                <div style={{ display:"flex", gap:10 }}>
                  {["True","False"].map((opt,oi) => (
                    <div key={opt} className={`quiz-opt${answers[qi]===oi?" selected":""}`} style={{ flex:1, textAlign:"center" }} onClick={() => setAnswers(a=>({...a,[qi]:oi}))}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              {q.type==="short" && (
                <input style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.03)", color:T.text, fontFamily:"'Satoshi',sans-serif", fontSize:".84rem", outline:"none" }}
                  placeholder="Your answer…" value={answers[qi]||""} onChange={e => setAnswers(a=>({...a,[qi]:e.target.value}))}/>
              )}
            </div>
          ))}
          <button className="btn-prim" style={{ alignSelf:"flex-end", padding:"10px 30px" }} onClick={doSubmit}>Submit Quiz →</button>
        </div>
      )}
    </div>
  );
}

/* ─── ASSIGNMENT PLAYER ─── */
function AssignmentPlayer({ lesson, onComplete }) {
  const a = lesson.assignment || {};
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");
  const ref = useEnter(lesson.id);
  return (
    <div ref={ref}>
      <div className="card" style={{ padding:22, marginBottom:20, borderColor:"rgba(0,212,170,.15)", background:"rgba(0,212,170,.03)" }}>
        <div style={{ fontSize:".58rem", fontWeight:800, letterSpacing:".12em", color:T.teal, marginBottom:8 }}>ASSIGNMENT</div>
        <div style={{ fontSize:"1rem", fontWeight:700, marginBottom:8 }}>{a.title||lesson.title}</div>
        <div style={{ fontSize:".86rem", color:T.text2, lineHeight:1.7, marginBottom:14 }}>{a.instructions||"Complete the assignment as described."}</div>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          {a.maxPoints && <span style={{ fontSize:".76rem", color:T.gold }}>🏆 {a.maxPoints} pts</span>}
          {a.dueDays && <span style={{ fontSize:".76rem", color:T.text3 }}>📅 Due in {a.dueDays} days</span>}
          {a.submissionType && <span style={{ fontSize:".76rem", color:T.text2 }}>📤 {a.submissionType}</span>}
        </div>
      </div>
      {!submitted ? (
        <div>
          <div style={{ fontSize:".7rem", fontWeight:700, letterSpacing:".1em", color:T.text3, marginBottom:10 }}>YOUR SUBMISSION</div>
          {a.submissionType==="File Upload" ? (
            <label style={{ display:"block", border:"2px dashed rgba(0,212,170,.18)", borderRadius:14, padding:28, textAlign:"center", cursor:"pointer", background:"rgba(0,212,170,.02)", marginBottom:16 }}>
              <input type="file" style={{ display:"none" }}/>
              <div style={{ fontSize:"2rem", marginBottom:8 }}>📎</div>
              <div style={{ fontSize:".84rem", fontWeight:600 }}>Click to upload file</div>
            </label>
          ) : (
            <textarea value={answer} onChange={e=>setAnswer(e.target.value)}
              style={{ width:"100%", minHeight:140, padding:"12px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.03)", color:T.text, fontFamily:"'Satoshi',sans-serif", fontSize:".86rem", outline:"none", resize:"vertical", marginBottom:16, lineHeight:1.6 }}
              placeholder={a.submissionType==="GitHub Link"?"https://github.com/...":a.submissionType==="Google Drive Link"?"https://drive.google.com/...":"Write your answer here…"}/>
          )}
          <button className="btn-prim" onClick={() => { setSubmitted(true); onComplete(); }}>Submit Assignment 🚀</button>
        </div>
      ) : (
        <div className="card" style={{ textAlign:"center", padding:36, borderColor:"rgba(74,222,128,.2)", background:"rgba(74,222,128,.04)" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:10 }}>✅</div>
          <div style={{ fontWeight:700, color:T.green, fontSize:"1rem" }}>Assignment Submitted!</div>
          <div style={{ fontSize:".78rem", color:T.text3, marginTop:6 }}>Your instructor will review and grade it.</div>
        </div>
      )}
    </div>
  );
}

/* ─── SIDEBAR LESSON ITEM ─── */
function LessonItem({ lesson, isActive, isDone, onClick }) {
  const ico = { video:"▶", doc:"📄", quiz:"❓", assignment:"📝", live:"🔴", article:"✍️" }[lesson.type] || "▶";
  return (
    <div className={`lesson-item${isActive?" active":""}${isDone?" done":""}`} onClick={onClick}>
      <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, display:"grid", placeItems:"center", fontSize:".72rem",
        background: isDone?"rgba(74,222,128,.12)":isActive?"rgba(240,165,0,.12)":"rgba(255,255,255,.04)",
        border:`1px solid ${isDone?"rgba(74,222,128,.25)":isActive?"rgba(240,165,0,.25)":"rgba(255,255,255,.06)"}`,
        color: isDone?T.green:isActive?T.gold:T.text3 }}>
        {isDone?"✓":ico}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:".78rem", fontWeight:isActive?700:500, color:isActive?T.text:T.text2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {lesson.title}
        </div>
        <div style={{ fontSize:".62rem", color:T.text3, marginTop:1 }}>{lesson.type?.toUpperCase()} · {lesson.dur}</div>
      </div>
      {lesson.free && <span style={{ fontSize:".56rem", color:T.purple, fontWeight:800, background:"rgba(124,47,255,.1)", padding:"1px 5px", borderRadius:4, flexShrink:0 }}>FREE</span>}
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function LearnModule() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [enrollmentId, setEnrollmentId] = useState(null);
  const topbarRef = useRef(null);
  const sidebarRef = useRef(null);

  // Load course
  useEffect(() => {
    fetch(`${API_BASE}/api/courses/${courseId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setCourse(d.data);
          const first = d.data.curriculum?.[0]?.lessons?.[0];
          if (first) setActiveLesson({ ...first, _coursePromo: d.data.promoVideoUrl });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  // Load enrollment — restore completed lessons from DB
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !courseId) return;
    fetch(`${API_BASE}/api/enrollments/course/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setEnrollmentId(d.data._id);
          if (Array.isArray(d.data.completedLessons) && d.data.completedLessons.length > 0) {
            setCompleted(new Set(d.data.completedLessons));
          }
        }
      })
      .catch(() => {});
  }, [courseId]);

  // Entrance animations
  useEffect(() => {
    if (!course) return;
    if (sidebarRef.current) gsap.fromTo(sidebarRef.current, { x:-40, opacity:0 }, { x:0, opacity:1, duration:.6, ease:"power3.out" });
    if (topbarRef.current) gsap.fromTo(topbarRef.current, { y:-20, opacity:0 }, { y:0, opacity:1, duration:.5, ease:"power3.out", delay:.15 });
  }, [course]);

  const allLessons = course?.curriculum?.flatMap(s => s.lessons||[]) || [];
  const total = allLessons.length;
  const progress = total ? Math.round(completed.size/total*100) : 0;

  const markComplete = () => {
    if (!activeLesson) return;
    const lessonId = activeLesson.id;
    setCompleted(c => new Set([...c, lessonId]));

    // Save to backend
    const token = localStorage.getItem("token");
    if (!token || !enrollmentId) return;
    fetch(`${API_BASE}/api/enrollments/${enrollmentId}/lesson`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ lessonId, lessonTitle: activeLesson.title })
    }).catch(() => {});
  };
  const selectLesson = lesson => setActiveLesson({ ...lesson, _coursePromo: course?.promoVideoUrl });

  const curIdx = allLessons.findIndex(l => l.id === activeLesson?.id);
  const goNext = () => { if (curIdx < allLessons.length-1) selectLesson(allLessons[curIdx+1]); };
  const goPrev = () => { if (curIdx > 0) selectLesson(allLessons[curIdx-1]); };

  if (loading) return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, flexDirection:"column", gap:14 }}>
      <SpaceBackground/>
      <div style={{ width:38, height:38, border:"3px solid rgba(240,165,0,.2)", borderTopColor:T.gold, borderRadius:"50%", animation:"spin 1s linear infinite", position:"relative", zIndex:10 }}/>
      <div style={{ fontSize:".84rem", color:T.text2, position:"relative", zIndex:10 }}>Loading course…</div>
    </div>
  );

  if (!course) return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, flexDirection:"column", gap:14 }}>
      <SpaceBackground/>
      <div style={{ fontSize:"3rem", position:"relative", zIndex:10 }}>😕</div>
      <div style={{ color:T.text2, position:"relative", zIndex:10 }}>Course not found</div>
      <button className="btn-ghost" style={{ position:"relative", zIndex:10 }} onClick={() => navigate("/explore")}>Back to Explore</button>
    </div>
  );

  return (
    <div className="learn-layout">
      <SpaceBackground/>

      {/* ── SIDEBAR ── */}
      <div className="learn-sidebar" ref={sidebarRef}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
          <button onClick={() => navigate("/explore")} style={{ background:"none", border:"none", color:T.text3, cursor:"pointer", fontSize:".76rem", marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>
            ← Back
          </button>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:".9rem", fontWeight:900, lineHeight:1.3, marginBottom:10 }}>{course.title}</div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:".68rem", color:T.text3, marginBottom:5 }}>
            <span>{completed.size}/{total} lessons</span>
            <span style={{ color:T.gold, fontWeight:700 }}>{progress}%</span>
          </div>
          <div className="prog-bar"><div className="prog-fill" style={{ width:`${progress}%` }}/></div>
        </div>

        <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"thin", scrollbarColor:"#0f1e38 transparent" }}>
          {(course.curriculum||[]).map((sec,si) => (
            <div key={si}>
              <div className="section-hdr">S{si+1} · {sec.title}</div>
              {(sec.lessons||[]).map((lesson,li) => (
                <LessonItem key={li} lesson={lesson}
                  isActive={activeLesson?.id===lesson.id}
                  isDone={completed.has(lesson.id)}
                  onClick={() => selectLesson(lesson)}/>
              ))}
            </div>
          ))}
          {!course.curriculum?.length && (
            <div style={{ padding:24, textAlign:"center", color:T.text3, fontSize:".8rem" }}>No curriculum added yet.</div>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="learn-main">
        <div className="learn-topbar" ref={topbarRef}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:".7rem", color:T.text3 }}>{course.title}</div>
            <div style={{ fontSize:".9rem", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {activeLesson?.title || "Select a lesson"}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexShrink:0 }}>
            <button className="btn-ghost" onClick={goPrev} disabled={curIdx<=0}>← Prev</button>
            <button className="btn-ghost" onClick={goNext} disabled={curIdx>=allLessons.length-1}>Next →</button>
          </div>
          {progress===100 && (
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 12px", borderRadius:9, background:"rgba(74,222,128,.1)", border:"1px solid rgba(74,222,128,.25)", fontSize:".76rem", color:T.green, fontWeight:700 }}>
              🏅 Course Complete!
            </div>
          )}
        </div>

        <div className="learn-content" style={{ padding:"24px 20px" }}>
          {activeLesson ? (
            <div style={{ maxWidth:980, margin:"0 auto" }}>
              <div style={{ marginBottom:22 }}>
                <div style={{ fontSize:".6rem", color:T.text3, fontWeight:700, letterSpacing:".12em", marginBottom:5 }}>
                  {activeLesson.type?.toUpperCase()}
                </div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:"1.35rem", fontWeight:900, letterSpacing:"-.03em" }}>
                  {activeLesson.title}
                </div>
              </div>

              {(activeLesson.type==="video"||activeLesson.type==="live") && <VideoPlayer lesson={activeLesson} onComplete={markComplete}/>}
              {activeLesson.type==="article" && <ArticleReader lesson={activeLesson} onComplete={markComplete}/>}
              {activeLesson.type==="doc" && <DocViewer lesson={activeLesson} onComplete={markComplete}/>}
              {activeLesson.type==="quiz" && <QuizPlayer lesson={activeLesson} onComplete={markComplete}/>}
              {activeLesson.type==="assignment" && <AssignmentPlayer lesson={activeLesson} onComplete={markComplete}/>}
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60%", flexDirection:"column", gap:14, color:T.text3 }}>
              <div style={{ fontSize:"3rem" }}>👈</div>
              <div style={{ fontSize:".9rem" }}>Select a lesson from the sidebar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
