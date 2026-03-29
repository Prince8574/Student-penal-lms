import { useState, useEffect, useRef } from "react";
import { T, G } from "../utils/constants";
import { getDaysLeft, fmtDate } from "../utils/helpers";
import Countdown from "./Countdown";

const TYPE_COL = { Coding:"#60a5fa", Quiz:"#f0a500", Design:"#f472b6", Report:"#a78bfa", Research:"#00d4aa", Project:"#4ade80" };
const TYPE_ICO = { Coding:"💻", Quiz:"📝", Design:"🎨", Report:"📄", Research:"🔬", Project:"🚀" };

export default function SubmitModal({ a, onClose, onSubmit, asPage }) {
  const type   = a.type || "Coding";
  const accent = TYPE_COL[type] || T.gold;
  const langs  = Array.isArray(a.codingLangs) && a.codingLangs.length ? a.codingLangs : ["JavaScript"];
  const qs     = Array.isArray(a.questions) ? a.questions : [];

  const [files, setFiles]           = useState([]);
  const [link, setLink]             = useState("");
  const [text, setText]             = useState("");
  const [tab, setTab]               = useState("upload");
  const [drag, setDrag]             = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [noteOn, setNoteOn]         = useState(false);
  const [note, setNote]             = useState("");
  const [code, setCode]             = useState(a.starterCode || "");
  const [codeLang, setCodeLang]     = useState(langs[0]);
  const [answers, setAnswers]       = useState(function() { return qs.map(function() { return null; }); });
  const [figmaUrl, setFigmaUrl]     = useState("");
  const [repoLink, setRepoLink]     = useState(a.repoUrl || "");
  const [demoLink, setDemoLink]     = useState("");
  const [runResult, setRunResult]   = useState(null);   // null | { status, results[] }
  const [running, setRunning]       = useState(false);
  const [tcTab, setTcTab]           = useState("sample"); // "sample" | "custom"
  const [customInput, setCustomInput] = useState("");
  const [activeCase, setActiveCase] = useState(0);
  const fileRef = useRef(null);

  useEffect(function() {
    if (asPage) return;
    function esc(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", esc);
    return function() { window.removeEventListener("keydown", esc); };
  }, [onClose, asPage]);

  function addFiles(fl) { setFiles(function(p) { return p.concat(Array.from(fl)); }); }
  function onDrop(e) { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }

  function canSubmit() {
    if (type === "Quiz")    return answers.every(function(x) { return x !== null; });
    if (type === "Coding")  return code.trim().length > 0;
    if (type === "Design")  return figmaUrl.trim().length > 0 || files.length > 0;
    if (type === "Project") return repoLink.trim().length > 0;
    if (type === "Report" || type === "Research") return text.trim().length > 0 || files.length > 0;
    if (tab === "upload") return files.length > 0;
    if (tab === "link")   return link.trim().length > 0;
    return text.trim().length > 0;
  }

  function runCode() {
    if (!code.trim()) return;
    setRunning(true);
    setRunResult(null);
    // Simulate compile + run (frontend-only mock)
    setTimeout(function() {
      const cases = parsedTestCases.length > 0 ? parsedTestCases : [{ input: customInput || "N/A", expected: "N/A" }];
      const results = cases.map(function(tc, i) {
        // Mock: randomly pass/fail for demo; in real app call backend judge
        const passed = Math.random() > 0.3;
        return {
          input: tc.input,
          expected: tc.expected,
          output: passed ? tc.expected : "Wrong Answer",
          passed,
          runtime: Math.floor(Math.random() * 80 + 20) + " ms",
          memory: (Math.random() * 2 + 1).toFixed(1) + " MB",
        };
      });
      const allPassed = results.every(function(r) { return r.passed; });
      setRunResult({ status: allPassed ? "accepted" : "wrong", results });
      setRunning(false);
    }, 1800);
  }

  function doSubmit() {
    if (!canSubmit()) return;
    setSubmitting(true);
    setTimeout(function() {
      setSubmitting(false); setSubmitted(true);
      setTimeout(function() { onSubmit(a.id, files); onClose(); }, 2000);
    }, 2200);
  }

  const dl = getDaysLeft(a.dueDate, a.dueTime);

  // Parse testCases string into array of {input, expected}
  const parsedTestCases = (function() {
    if (!a.testCases) return [];
    const lines = a.testCases.split("\n").map(function(l) { return l.trim(); }).filter(Boolean);
    const cases = [];
    for (var i = 0; i < lines.length; i += 2) {
      cases.push({ input: lines[i] || "", expected: lines[i+1] || "" });
    }
    return cases;
  })();

  if (submitted) {
    const successContent = (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", background: asPage ? "transparent" : undefined }}>
        <div style={{ background:"#0b1628", border:"1px solid rgba(255,255,255,.08)", borderRadius:24, padding:"52px 40px", textAlign:"center", maxWidth:420, animation:"popIn .4s cubic-bezier(.34,1.56,.64,1) both" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(74,222,128,.12)", border:"1px solid rgba(74,222,128,.3)", display:"grid", placeItems:"center", margin:"0 auto 20px", boxShadow:"0 0 30px rgba(74,222,128,.2)" }}>
            <svg width={40} height={40} viewBox="0 0 40 40">
              <circle cx={20} cy={20} r={18} fill="none" stroke={T.green} strokeWidth={2.5}/>
              <polyline points="12,20 18,26 28,14" fill="none" stroke={T.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} style={{ animation:"checkDraw .5s .3s ease both" }}/>
            </svg>
          </div>
          <div className="ff" style={{ fontSize:"1.4rem", fontWeight:900, letterSpacing:"-.04em", marginBottom:8 }}>
            Submitted <em style={{ fontStyle:"italic", color:T.green }}>Successfully!</em>
          </div>
          <div style={{ fontSize:".86rem", color:T.text2 }}>Your assignment has been submitted. Feedback within 2-3 days.</div>
        </div>
      </div>
    );
    if (asPage) { return successContent; }
    return (
      <div className="modal-overlay" onClick={onClose} style={{ alignItems:"center", justifyContent:"center" }}>
        {successContent}
      </div>
    );
  }

  const inner = (
      <div style={{ background:"#090d1f", border:"none", borderRadius:0, width:"100%", height:"100vh", display:"flex", flexDirection:"column", animation:"popIn .32s cubic-bezier(.34,1.2,.64,1) both", overflow:"hidden" }}>

        <div style={{ height:3, background:"linear-gradient(90deg," + accent + "," + accent + "55,transparent)" }}/>

        {!asPage && (
        <div style={{ padding:"20px 28px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ padding:"4px 12px", borderRadius:99, background:a.courseColor + "15", border:"1px solid " + a.courseColor + "30" }}>
                <span style={{ fontSize:".7rem", fontWeight:800, color:a.courseColor }}>{a.courseIcon} {(a.course||"").split(" ").slice(0,3).join(" ")}</span>
              </div>
              <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:8, background:accent + "15", border:"1px solid " + accent + "35", color:accent, fontSize:".7rem", fontWeight:800 }}>{TYPE_ICO[type]} {type}</span>
              <span style={{ padding:"4px 10px", borderRadius:8, fontSize:".68rem", fontWeight:700, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:T.text3 }}>{a.priority} priority</span>
            </div>
            <div className="ff" style={{ fontSize:"1.3rem", fontWeight:900, letterSpacing:"-.04em", lineHeight:1.2, marginBottom:8, color:T.text }}>{a.title}</div>
            <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <span style={{ fontSize:".78rem", color:dl.past ? T.red : T.text2 }}>
                {dl.past ? "Overdue - " : "Due: "}
                <strong style={{ color:dl.past ? T.red : T.text }}>{fmtDate(a.dueDate)}, {a.dueTime}</strong>
              </span>
              <span style={{ fontSize:".78rem", color:T.text2 }}>Points: <strong style={{ color:T.gold }}>{a.points}</strong></span>
              {a.estimatedTime && a.estimatedTime !== "-" && <span style={{ fontSize:".78rem", color:T.text2 }}>Time: {a.estimatedTime}</span>}
              {!dl.past && <Countdown dueDate={a.dueDate} dueTime={a.dueTime}/>}
            </div>
          </div>
          <button onClick={onClose} style={{ width:36, height:36, borderRadius:10, border:"1px solid rgba(255,255,255,.08)", background:"transparent", color:T.text3, cursor:"pointer", display:"grid", placeItems:"center", fontSize:"1rem", transition:"all .2s", flexShrink:0 }}
            onMouseEnter={function(e) { e.currentTarget.style.background="rgba(255,255,255,.06)"; e.currentTarget.style.color=T.text; }}
            onMouseLeave={function(e) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.text3; }}>X</button>
        </div>
        )}

        <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

          <div style={{ width:290, flexShrink:0, borderRight:"1px solid rgba(255,255,255,.06)", overflowY:"auto", padding:"20px 20px", display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:8 }}>Description</div>
              <div style={{ fontSize:".82rem", color:T.text2, lineHeight:1.7 }}>{a.desc || "-"}</div>
            </div>
            {(a.requirements||[]).length > 0 && (
              <div>
                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:8 }}>Requirements</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {(a.requirements||[]).map(function(r, i) {
                    return (
                      <div key={i} style={{ display:"flex", gap:8, fontSize:".8rem", color:T.text2, lineHeight:1.5 }}>
                        <span style={{ color:accent, flexShrink:0, marginTop:1 }}>+</span>
                        <span>{r}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(a.rubric||[]).length > 0 && (
              <div>
                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:10 }}>Grading Rubric</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(a.rubric||[]).map(function(rb, i) {
                    var label = rb.criterion || rb.l || "";
                    var pts   = rb.points    || rb.p || 0;
                    var pct   = a.points ? Math.min(100, (pts/a.points)*100) : 0;
                    return (
                      <div key={i} style={{ padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:".78rem", color:T.text2 }}>{label}</span>
                          <span style={{ fontSize:".74rem", fontWeight:800, color:T.gold }}>{pts} pts</span>
                        </div>
                        <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,.06)" }}>
                          <div style={{ height:"100%", width:pct + "%", borderRadius:99, background:"linear-gradient(90deg," + accent + "," + accent + "88)", transition:"width .6s ease" }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {dl.past && (
              <div style={{ padding:"11px 13px", borderRadius:11, background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.22)", fontSize:".76rem", color:"#f87171", display:"flex", gap:8 }}>
                <span>!</span>
                <div><strong>Late submission.</strong> A penalty may apply per course policy.</div>
              </div>
            )}
          </div>

          <div style={{ flex:1, overflowY: type==="Coding" ? "hidden" : "auto", padding: type==="Coding" ? "16px 20px" : "20px 24px", display:"flex", flexDirection:"column", gap:16, minWidth:0 }}>

            {type === "Coding" && (
              <div style={{ display:"flex", flexDirection:"column", flex:1, gap:0, minHeight:0 }}>

                {/* ── Editor toolbar ── */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#0d1117", borderRadius:"14px 14px 0 0", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:11, height:11, borderRadius:"50%", background:"#ef4444" }}/>
                    <div style={{ width:11, height:11, borderRadius:"50%", background:"#f59e0b" }}/>
                    <div style={{ width:11, height:11, borderRadius:"50%", background:"#4ade80" }}/>
                    <span style={{ fontSize:".68rem", color:T.text3, marginLeft:6 }}>solution.{codeLang==="JavaScript"?"js":codeLang==="Python"?"py":codeLang==="Java"?"java":codeLang==="C++"?"cpp":"txt"}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {langs.map(function(l) {
                      return (
                        <span key={l} onClick={function() { setCodeLang(l); }}
                          style={{ padding:"3px 10px", borderRadius:99, fontSize:".68rem", fontWeight:700, cursor:"pointer", transition:"all .2s",
                            background: codeLang===l ? accent+"22" : "rgba(255,255,255,.04)",
                            border:"1px solid "+(codeLang===l ? accent+"55" : "rgba(255,255,255,.07)"),
                            color: codeLang===l ? accent : T.text3 }}>{l}</span>
                      );
                    })}
                    <span style={{ fontSize:".65rem", color:T.text3, marginLeft:4 }}>{code.split("\n").length} lines</span>
                  </div>
                </div>

                {/* ── Code textarea ── */}
                <div style={{ position:"relative", background:"#0d1117", flex:"1 1 0", minHeight:220 }}>
                  {/* Line numbers */}
                  <div style={{ position:"absolute", top:0, left:0, bottom:0, width:42, background:"#0a0e1a", borderRight:"1px solid rgba(255,255,255,.04)", overflowY:"hidden", padding:"16px 0", userSelect:"none", pointerEvents:"none" }}>
                    {code.split("\n").map(function(_, i) {
                      return <div key={i} style={{ height:"1.75em", lineHeight:"1.75em", textAlign:"right", paddingRight:10, fontSize:".78rem", color:"rgba(255,255,255,.18)", fontFamily:"'Courier New',monospace" }}>{i+1}</div>;
                    })}
                  </div>
                  <textarea value={code} onChange={function(e) { setCode(e.target.value); }}
                    placeholder={"// Write your solution here...\nfunction solution() {\n  // your code\n}"}
                    style={{ width:"100%", height:"100%", minHeight:220, padding:"16px 16px 16px 58px", background:"transparent", border:"none", outline:"none", color:"#e2e8f0", fontFamily:"'Courier New',Consolas,monospace", fontSize:".88rem", lineHeight:1.75, resize:"none", colorScheme:"dark", display:"block" }}
                    spellCheck={false}
                    onKeyDown={function(e) {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        const s = e.target.selectionStart;
                        const v = e.target.value;
                        setCode(v.substring(0,s) + "  " + v.substring(e.target.selectionEnd));
                        setTimeout(function() { e.target.selectionStart = e.target.selectionEnd = s+2; }, 0);
                      }
                    }}/>
                </div>

                {/* ── Bottom status bar ── */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 14px", background:"#0a0e1a", borderTop:"1px solid rgba(255,255,255,.05)" }}>
                  <span style={{ fontSize:".65rem", color:T.text3 }}>{code.length} chars · {code.split("\n").length} lines</span>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {runResult && (
                      <span style={{ fontSize:".68rem", fontWeight:800, color: runResult.status==="accepted" ? T.green : T.red }}>
                        {runResult.status==="accepted" ? "✓ All Passed" : "✗ Wrong Answer"}
                      </span>
                    )}
                    {code.trim().length > 0 && !runResult && <span style={{ fontSize:".65rem", color:T.green }}>Ready</span>}
                  </div>
                </div>

                {/* ── Test Cases Panel ── */}
                <div style={{ background:"#0b0f1e", border:"1px solid rgba(255,255,255,.07)", borderTop:"none", borderRadius:"0 0 14px 14px", flexShrink:0 }}>

                  {/* Panel header tabs */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ display:"flex" }}>
                      {[{ id:"sample", l:"Test Cases" }, { id:"custom", l:"Custom Input" }].map(function(t) {
                        return (
                          <button key={t.id} onClick={function() { setTcTab(t.id); }}
                            style={{ padding:"10px 16px", background:"none", border:"none", borderBottom:"2px solid "+(tcTab===t.id ? accent : "transparent"), color: tcTab===t.id ? accent : T.text3, fontSize:".75rem", fontWeight:700, cursor:"pointer", transition:"all .2s", marginBottom:-1 }}>{t.l}</button>
                        );
                      })}
                    </div>
                    <button onClick={runCode} disabled={running || !code.trim()}
                      style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 16px", borderRadius:8, border:"none", background: running || !code.trim() ? "rgba(255,255,255,.06)" : "linear-gradient(135deg,#22c55e,#16a34a)", color: running || !code.trim() ? T.text3 : "#fff", fontSize:".76rem", fontWeight:800, cursor: running || !code.trim() ? "not-allowed" : "pointer", transition:"all .2s" }}>
                      {running ? (
                        <span style={{ width:12, height:12, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }}/>
                      ) : (
                        <svg width={12} height={12} viewBox="0 0 12 12" fill="currentColor"><polygon points="2,1 11,6 2,11"/></svg>
                      )}
                      {running ? "Running..." : "Run Code"}
                    </button>
                  </div>

                  {/* Sample test cases */}
                  {tcTab === "sample" && (
                    <div style={{ padding:"12px 14px" }}>
                      {parsedTestCases.length === 0 && !a.testCases && (
                        <div style={{ fontSize:".78rem", color:T.text3, padding:"8px 0" }}>No test cases provided.</div>
                      )}
                      {a.testCases && parsedTestCases.length === 0 && (
                        <pre style={{ fontFamily:"'Courier New',monospace", fontSize:".78rem", color:T.text2, lineHeight:1.7, whiteSpace:"pre-wrap", margin:0 }}>{a.testCases}</pre>
                      )}
                      {parsedTestCases.length > 0 && (
                        <div>
                          {/* Case tabs */}
                          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                            {parsedTestCases.map(function(_, i) {
                              const res = runResult && runResult.results[i];
                              return (
                                <button key={i} onClick={function() { setActiveCase(i); }}
                                  style={{ padding:"4px 12px", borderRadius:8, border:"1px solid "+(activeCase===i ? accent+"55" : "rgba(255,255,255,.08)"), background: activeCase===i ? accent+"15" : "transparent", color: res ? (res.passed ? T.green : T.red) : (activeCase===i ? accent : T.text3), fontSize:".72rem", fontWeight:700, cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", gap:5 }}>
                                  {res && <span>{res.passed ? "✓" : "✗"}</span>}
                                  Case {i+1}
                                </button>
                              );
                            })}
                          </div>
                          {/* Active case detail */}
                          {parsedTestCases[activeCase] && (
                            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                              <div>
                                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:T.text3, marginBottom:5 }}>Input</div>
                                <div style={{ background:"#0d1117", borderRadius:8, padding:"10px 12px", fontFamily:"'Courier New',monospace", fontSize:".82rem", color:"#e2e8f0", border:"1px solid rgba(255,255,255,.06)" }}>{parsedTestCases[activeCase].input || "—"}</div>
                              </div>
                              <div>
                                <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:T.text3, marginBottom:5 }}>Expected Output</div>
                                <div style={{ background:"#0d1117", borderRadius:8, padding:"10px 12px", fontFamily:"'Courier New',monospace", fontSize:".82rem", color:"#e2e8f0", border:"1px solid rgba(255,255,255,.06)" }}>{parsedTestCases[activeCase].expected || "—"}</div>
                              </div>
                              {runResult && runResult.results[activeCase] && (
                                <div>
                                  <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:T.text3, marginBottom:5 }}>Your Output</div>
                                  <div style={{ background:"#0d1117", borderRadius:8, padding:"10px 12px", fontFamily:"'Courier New',monospace", fontSize:".82rem", border:"1px solid "+(runResult.results[activeCase].passed ? "rgba(74,222,128,.25)" : "rgba(239,68,68,.25)"), color: runResult.results[activeCase].passed ? T.green : T.red }}>
                                    {runResult.results[activeCase].output}
                                  </div>
                                  <div style={{ display:"flex", gap:12, marginTop:7 }}>
                                    <span style={{ fontSize:".68rem", color:T.text3 }}>Runtime: <strong style={{ color:T.text }}>{runResult.results[activeCase].runtime}</strong></span>
                                    <span style={{ fontSize:".68rem", color:T.text3 }}>Memory: <strong style={{ color:T.text }}>{runResult.results[activeCase].memory}</strong></span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom input */}
                  {tcTab === "custom" && (
                    <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
                      <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:T.text3, marginBottom:2 }}>Custom Input</div>
                      <textarea value={customInput} onChange={function(e) { setCustomInput(e.target.value); }}
                        placeholder={"Enter your test input here...\nExample:\n5\n1 2 3 4 5"}
                        style={{ width:"100%", minHeight:80, background:"#0d1117", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"10px 12px", color:"#e2e8f0", fontFamily:"'Courier New',monospace", fontSize:".82rem", outline:"none", resize:"vertical", lineHeight:1.6 }}/>
                      {runResult && runResult.results[0] && (
                        <div>
                          <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:T.text3, marginBottom:5 }}>Output</div>
                          <div style={{ background:"#0d1117", borderRadius:8, padding:"10px 12px", fontFamily:"'Courier New',monospace", fontSize:".82rem", color:"#e2e8f0", border:"1px solid rgba(255,255,255,.1)" }}>{runResult.results[0].output}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Run result summary bar */}
                  {runResult && (
                    <div style={{ margin:"0 14px 12px", padding:"10px 14px", borderRadius:10, background: runResult.status==="accepted" ? "rgba(74,222,128,.07)" : "rgba(239,68,68,.07)", border:"1px solid "+(runResult.status==="accepted" ? "rgba(74,222,128,.25)" : "rgba(239,68,68,.25)"), display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:"1rem" }}>{runResult.status==="accepted" ? "✅" : "❌"}</span>
                        <span style={{ fontSize:".82rem", fontWeight:800, color: runResult.status==="accepted" ? T.green : T.red }}>
                          {runResult.status==="accepted" ? "All test cases passed!" : "Some test cases failed"}
                        </span>
                      </div>
                      <span style={{ fontSize:".72rem", color:T.text3 }}>
                        {runResult.results.filter(function(r) { return r.passed; }).length}/{runResult.results.length} passed
                      </span>
                    </div>
                  )}
                </div>

              </div>
            )}

            {type === "Quiz" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:".7rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:accent }}>Quiz Questions</div>
                  <span style={{ padding:"4px 10px", borderRadius:99, fontSize:".68rem", fontWeight:700, background:accent + "15", border:"1px solid " + accent + "30", color:accent }}>
                    {answers.filter(function(x) { return x !== null; }).length}/{qs.length} answered
                  </span>
                </div>
                {qs.length === 0 && (
                  <div style={{ padding:"32px", textAlign:"center", color:T.text3, fontSize:".82rem", borderRadius:12, border:"1px dashed rgba(255,255,255,.08)" }}>No questions found</div>
                )}
                {qs.map(function(q, qi) {
                  return (
                    <div key={qi} style={{ padding:"16px", borderRadius:14, background:"rgba(255,255,255,.02)", border:"1px solid " + (answers[qi]!==null ? accent + "40" : "rgba(255,255,255,.07)"), transition:"border-color .2s" }}>
                      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                        <div style={{ width:26, height:26, borderRadius:8, flexShrink:0, background:accent + "18", border:"1px solid " + accent + "35", display:"grid", placeItems:"center", fontSize:".72rem", fontWeight:900, color:accent }}>{qi+1}</div>
                        <div style={{ fontSize:".88rem", fontWeight:600, color:T.text, lineHeight:1.55 }}>{q.q}</div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                        {(q.options||[]).map(function(opt, oi) {
                          var sel = answers[qi] === oi;
                          return (
                            <div key={oi} onClick={function() {
                              setAnswers(function(prev) { return prev.map(function(v, idx) { return idx===qi ? oi : v; }); });
                            }} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 13px", borderRadius:11, cursor:"pointer", transition:"all .2s",
                              border:"1.5px solid " + (sel ? accent + "55" : "rgba(255,255,255,.07)"),
                              background: sel ? accent + "12" : "rgba(255,255,255,.02)" }}>
                              <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, border:"2px solid " + (sel ? accent : "rgba(255,255,255,.2)"), background: sel ? accent : "transparent", transition:"all .2s", display:"grid", placeItems:"center" }}>
                                {sel && <div style={{ width:7, height:7, borderRadius:"50%", background:"#050814" }}/>}
                              </div>
                              <span style={{ fontSize:".82rem", color: sel ? accent : T.text2 }}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {type === "Design" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ fontSize:".7rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:accent }}>Design Submission</div>
                {a.designTools && a.designTools.length > 0 && (
                  <div>
                    <div style={{ fontSize:".62rem", color:T.text3, marginBottom:7 }}>Allowed Tools</div>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {a.designTools.map(function(t) {
                        return <span key={t} style={{ padding:"4px 12px", borderRadius:99, fontSize:".72rem", fontWeight:600, background:accent + "12", border:"1px solid " + accent + "28", color:accent }}>{t}</span>;
                      })}
                    </div>
                  </div>
                )}
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {a.canvasSize && <div style={{ padding:"9px 13px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", fontSize:".78rem", color:T.text2 }}>Canvas: <strong style={{ color:T.text }}>{a.canvasSize}</strong></div>}
                  {a.deliverableFormat && <div style={{ padding:"9px 13px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", fontSize:".78rem", color:T.text2 }}>Format: <strong style={{ color:T.text }}>{a.deliverableFormat}</strong></div>}
                </div>
                {a.designBrief && (
                  <div style={{ padding:"10px 13px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", fontSize:".78rem", color:T.text2 }}>
                    Brief: <a href={a.designBrief} target="_blank" rel="noreferrer" style={{ color:accent, wordBreak:"break-all" }}>{a.designBrief}</a>
                  </div>
                )}
                <div>
                  <div style={{ fontSize:".7rem", color:T.text3, marginBottom:7 }}>Figma / Design File URL</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid " + (figmaUrl ? accent + "44" : "rgba(255,255,255,.08)"), borderRadius:12, padding:"11px 15px", transition:"border-color .2s" }}>
                    <span>Link:</span>
                    <input placeholder="https://figma.com/file/..." value={figmaUrl} onChange={function(e) { setFigmaUrl(e.target.value); }}
                      style={{ background:"none", border:"none", outline:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".85rem", flex:1 }}/>
                  </div>
                </div>
                <div style={{ textAlign:"center", fontSize:".72rem", color:T.text3 }}>or upload file</div>
                <div className={drag ? "upload-zone drag" : "upload-zone"} onDragOver={function(e) { e.preventDefault(); setDrag(true); }} onDragLeave={function() { setDrag(false); }} onDrop={onDrop} onClick={function() { fileRef.current && fileRef.current.click(); }}>
                  <div style={{ fontSize:"2rem", marginBottom:8 }}>Design</div>
                  <div style={{ fontSize:".84rem", color:T.text2 }}>Drop files or <span style={{ color:accent, cursor:"pointer" }}>Browse</span></div>
                  <input ref={fileRef} type="file" multiple style={{ display:"none" }} onChange={function(e) { addFiles(e.target.files); }}/>
                </div>
              </div>
            )}

            {type === "Project" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ fontSize:".7rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:accent }}>Project Submission</div>
                {a.techStack && a.techStack.length > 0 && (
                  <div>
                    <div style={{ fontSize:".62rem", color:T.text3, marginBottom:7 }}>Tech Stack</div>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {a.techStack.map(function(t) {
                        return <span key={t} style={{ padding:"4px 12px", borderRadius:99, fontSize:".72rem", fontWeight:600, background:accent + "12", border:"1px solid " + accent + "28", color:accent }}>{t}</span>;
                      })}
                    </div>
                  </div>
                )}
                {a.teamSize && <div style={{ padding:"9px 13px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", fontSize:".78rem", color:T.text2 }}>Team Size: <strong style={{ color:T.text }}>{a.teamSize}</strong></div>}
                {a.milestones && a.milestones.length > 0 && (
                  <div>
                    <div style={{ fontSize:".62rem", color:T.text3, marginBottom:8 }}>Milestones</div>
                    {a.milestones.map(function(m, i) {
                      return (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", marginBottom:6 }}>
                          <div style={{ width:22, height:22, borderRadius:6, background:accent + "18", border:"1px solid " + accent + "30", display:"grid", placeItems:"center", fontSize:".68rem", fontWeight:900, color:accent, flexShrink:0 }}>{i+1}</div>
                          <span style={{ flex:1, fontSize:".8rem", color:T.text2 }}>{m.title}</span>
                          {m.dueDate && <span style={{ fontSize:".72rem", color:T.text3 }}>{m.dueDate}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div>
                  <div style={{ fontSize:".7rem", color:T.text3, marginBottom:7 }}>GitHub Repository URL (required)</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid " + (repoLink ? accent + "44" : "rgba(255,255,255,.08)"), borderRadius:12, padding:"11px 15px", transition:"border-color .2s" }}>
                    <span>Repo:</span>
                    <input placeholder="https://github.com/username/repo" value={repoLink} onChange={function(e) { setRepoLink(e.target.value); }}
                      style={{ background:"none", border:"none", outline:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".85rem", flex:1 }}/>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:".7rem", color:T.text3, marginBottom:7 }}>Live Demo URL (optional)</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid " + (demoLink ? accent + "44" : "rgba(255,255,255,.08)"), borderRadius:12, padding:"11px 15px", transition:"border-color .2s" }}>
                    <span>Demo:</span>
                    <input placeholder="https://your-app.vercel.app" value={demoLink} onChange={function(e) { setDemoLink(e.target.value); }}
                      style={{ background:"none", border:"none", outline:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".85rem", flex:1 }}/>
                  </div>
                </div>
              </div>
            )}

            {(type === "Report" || type === "Research") && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ fontSize:".7rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:accent }}>{type} Submission</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {(a.minWords || a.maxWords) && <div style={{ padding:"9px 13px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", fontSize:".78rem", color:T.text2 }}>{a.minWords||0}-{a.maxWords||"no limit"} words</div>}
                  {a.citationStyle && <div style={{ padding:"9px 13px", borderRadius:10, background:accent + "0a", border:"1px solid " + accent + "20", fontSize:".78rem", color:accent, fontWeight:700 }}>{a.citationStyle}</div>}
                  {a.reportFormat && <div style={{ padding:"9px 13px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", fontSize:".78rem", color:T.text2 }}>{a.reportFormat}</div>}
                </div>
                {a.outline && (
                  <div style={{ padding:"13px 15px", borderRadius:12, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:T.text3, marginBottom:8 }}>Required Sections</div>
                    <pre style={{ fontFamily:"'Courier New',monospace", fontSize:".78rem", color:T.text2, lineHeight:1.7, whiteSpace:"pre-wrap", margin:0 }}>{a.outline}</pre>
                  </div>
                )}
                <div>
                  <div style={{ fontSize:".7rem", color:T.text3, marginBottom:7 }}>Write your {type.toLowerCase()}</div>
                  <textarea value={text} onChange={function(e) { setText(e.target.value); }}
                    placeholder={"Start writing your " + type.toLowerCase() + "..."}
                    style={{ width:"100%", minHeight:220, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"14px 16px", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".86rem", outline:"none", resize:"vertical", lineHeight:1.7, transition:"border-color .2s" }}
                    onFocus={function(e) { e.target.style.borderColor = accent + "44"; }}
                    onBlur={function(e) { e.target.style.borderColor = "rgba(255,255,255,.08)"; }}/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                    <span style={{ fontSize:".7rem", color:T.text3 }}>{text.length} chars</span>
                    <span style={{ fontSize:".7rem", color: a.maxWords && text.split(/\s+/).filter(Boolean).length > Number(a.maxWords) ? T.red : T.text3 }}>
                      {text.split(/\s+/).filter(Boolean).length} words{a.maxWords ? " / " + a.maxWords + " max" : ""}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign:"center", fontSize:".72rem", color:T.text3 }}>or upload document</div>
                <div className={drag ? "upload-zone drag" : "upload-zone"} onDragOver={function(e) { e.preventDefault(); setDrag(true); }} onDragLeave={function() { setDrag(false); }} onDrop={onDrop} onClick={function() { fileRef.current && fileRef.current.click(); }} style={{ padding:"18px" }}>
                  <div style={{ fontSize:"1.8rem", marginBottom:6 }}>Doc</div>
                  <div style={{ fontSize:".84rem", color:T.text2 }}>Drop PDF/DOCX or <span style={{ color:accent, cursor:"pointer" }}>Browse</span></div>
                  <input ref={fileRef} type="file" multiple style={{ display:"none" }} accept=".pdf,.doc,.docx,.txt" onChange={function(e) { addFiles(e.target.files); }}/>
                </div>
              </div>
            )}

            {type !== "Coding" && type !== "Quiz" && type !== "Design" && type !== "Project" && type !== "Report" && type !== "Research" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:5, background:T.card, padding:"5px", borderRadius:12, border:"1px solid " + T.bord }}>
                  {[{ id:"upload", l:"Upload Files" }, { id:"link", l:"Submit Link" }, { id:"text", l:"Text Entry" }].map(function(item) {
                    return (
                      <button key={item.id} className={tab===item.id ? "tab-btn on" : "tab-btn"} style={{ flex:1, border: tab===item.id ? undefined : "1px solid transparent" }} onClick={function() { setTab(item.id); }}>{item.l}</button>
                    );
                  })}
                </div>
                {tab === "upload" && (
                  <div className={drag ? "upload-zone drag" : "upload-zone"} onDragOver={function(e) { e.preventDefault(); setDrag(true); }} onDragLeave={function() { setDrag(false); }} onDrop={onDrop} onClick={function() { fileRef.current && fileRef.current.click(); }}>
                    <div style={{ fontSize:"2rem", marginBottom:8 }}>Files</div>
                    <div style={{ fontSize:".86rem", fontWeight:700, color:T.text2, marginBottom:4 }}>Drag and drop or <span style={{ color:T.gold, cursor:"pointer" }}>Browse</span></div>
                    <div style={{ fontSize:".72rem", color:T.text3 }}>{(a.allowedTypes||[]).join(", ")} Max {a.maxFileSize}</div>
                    <input ref={fileRef} type="file" multiple style={{ display:"none" }} onChange={function(e) { addFiles(e.target.files); }}/>
                  </div>
                )}
                {tab === "link" && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid " + (link ? "rgba(240,165,0,.35)" : T.bord), borderRadius:12, padding:"11px 15px" }}>
                    <span>URL:</span>
                    <input placeholder="Paste your submission URL" value={link} onChange={function(e) { setLink(e.target.value); }}
                      style={{ background:"none", border:"none", outline:"none", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".85rem", flex:1 }}/>
                  </div>
                )}
                {tab === "text" && (
                  <textarea value={text} onChange={function(e) { setText(e.target.value); }} placeholder="Write or paste your answer here"
                    style={{ width:"100%", minHeight:180, background:"rgba(255,255,255,.03)", border:"1px solid " + T.bord, borderRadius:12, padding:"13px 14px", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".85rem", outline:"none", resize:"vertical", lineHeight:1.65 }}
                    onFocus={function(e) { e.target.style.borderColor="rgba(240,165,0,.35)"; }}
                    onBlur={function(e) { e.target.style.borderColor=T.bord; }}/>
                )}
              </div>
            )}

            {files.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {files.map(function(f, i) {
                  return (
                    <div key={i} className="file-chip">
                      <span style={{ fontSize:"1rem" }}>{f.name.endsWith(".pdf") ? "PDF" : f.name.endsWith(".zip") || f.name.endsWith(".rar") ? "ZIP" : f.name.endsWith(".mp4") ? "VID" : "FILE"}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:".82rem", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</div>
                        <div style={{ fontSize:".68rem", color:T.text3 }}>{(f.size/1024/1024).toFixed(2)} MB</div>
                      </div>
                      <button onClick={function() { setFiles(function(p) { return p.filter(function(_, j) { return j!==i; }); }); }}
                        style={{ background:"none", border:"none", color:T.text3, cursor:"pointer", fontSize:".8rem", padding:"4px", transition:"color .2s" }}
                        onMouseEnter={function(e) { e.currentTarget.style.color=T.red; }}
                        onMouseLeave={function(e) { e.currentTarget.style.color=T.text3; }}>X</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: noteOn ? 10 : 0 }}>
                <div style={{ fontSize:".76rem", color:T.text2, fontWeight:600 }}>Add note to instructor (optional)</div>
                <div className={noteOn ? "toggle-sw on" : "toggle-sw"} style={{ background: noteOn ? G.gold : "rgba(255,255,255,.08)" }} onClick={function() { setNoteOn(function(n) { return !n; }); }}/>
              </div>
              {noteOn && (
                <textarea value={note} onChange={function(e) { setNote(e.target.value); }} placeholder="Any notes or clarifications for your instructor"
                  style={{ width:"100%", minHeight:70, background:"rgba(255,255,255,.03)", border:"1px solid " + T.bord, borderRadius:11, padding:"11px 13px", color:T.text, fontFamily:"Satoshi,sans-serif", fontSize:".83rem", outline:"none", resize:"vertical", transition:"border-color .2s" }}
                  onFocus={function(e) { e.target.style.borderColor="rgba(240,165,0,.3)"; }}
                  onBlur={function(e) { e.target.style.borderColor=T.bord; }}/>
              )}
            </div>

            <div style={{ display:"flex", gap:10, alignItems:"center", paddingTop:4 }}>
              <button onClick={onClose} className="btn-outline" style={{ flex:1 }}>Cancel</button>
              <button onClick={doSubmit} className="btn-prim" style={{ flex:2, padding:"12px", fontSize:".9rem", justifyContent:"center", opacity: canSubmit() ? 1 : 0.45 }} disabled={!canSubmit()}>
                <span className="sh"/>
                {submitting ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <span style={{ width:14, height:14, border:"2px solid #030810", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }}/>
                    Submitting...
                  </span>
                ) : "Submit Assignment"}
              </button>
            </div>

          </div>
        </div>
      </div>
  );

  if (asPage) { return inner; }
  return (
    <div className="modal-overlay" onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
      {inner}
    </div>
  );
}
