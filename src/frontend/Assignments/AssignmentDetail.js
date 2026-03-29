import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Assignments/Assignments.css";
import { T } from "./utils/constants";
import { useBg } from "./hooks/useBackground";
import SubmitModal from "./components/SubmitModal";
import FeedbackModal from "./components/FeedbackModal";

var API_URL = "http://localhost:5001/api";
var COURSE_COLORS = ["#f0a500","#00d4aa","#a78bfa","#3b82f6","#4ade80","#f472b6","#60a5fa","#f59e0b"];

export default function AssignmentDetail() {
  var params = useParams();
  var id = params.id;
  var navigate = useNavigate();
  var location = useLocation();
  var bgRef = useRef(null);
  useBg(bgRef);

  var initAssignment = (location.state && location.state.assignment) ? location.state.assignment : null;
  var [assignment, setAssignment] = useState(initAssignment);
  var [loading, setLoading] = useState(!initAssignment);

  useEffect(function() {
    if (assignment) return;
    var token = localStorage.getItem("token");
    axios.get(API_URL + "/assignments", {
      headers: { Authorization: "Bearer " + token },
    }).then(function(res) {
      if (res.data.success) {
        var found = null;
        for (var i = 0; i < res.data.data.length; i++) {
          var a = res.data.data[i];
          if (String(a.id) === String(id) || String(a._id) === String(id)) {
            found = a;
            break;
          }
        }
        if (found) {
          var ci = COURSE_COLORS.indexOf(found.courseColor);
          setAssignment(Object.assign({}, found, {
            courseColor: found.courseColor || COURSE_COLORS[0],
            courseIcon:  found.courseIcon  || "📋",
            requirements: Array.isArray(found.requirements) ? found.requirements : [],
            rubric:       Array.isArray(found.rubric)       ? found.rubric       : [],
          }));
        }
      }
    }).catch(function(e) {
      console.error(e);
    }).finally(function() {
      setLoading(false);
    });
  }, [id, assignment]);

  function handleSubmit(aid, files) {
    var token = localStorage.getItem("token");
    var formData = new FormData();
    if (files && files.length > 0) {
      files.forEach(function(f) { formData.append("files", f); });
    }
    axios.post(API_URL + "/submissions/" + aid, formData, {
      headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
    }).then(function() {
      navigate("/assignments");
    }).catch(function(err) {
      var msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Failed to submit";
      alert(msg);
    });
  }

  var isGraded = assignment && (assignment.status === "graded" || assignment.status === "submitted");
  var accent = assignment ? (assignment.courseColor || T.gold) : T.gold;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", width:"100vw", background:T.bg, color:T.text, fontFamily:"Satoshi,sans-serif", overflow:"hidden", position:"relative" }}>
      <canvas ref={bgRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}/>

      {/* Slim top nav */}
      <div style={{ position:"relative", zIndex:100, flexShrink:0, height:52, borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", padding:"0 20px", gap:14, background:"rgba(5,8,20,.88)", backdropFilter:"blur(14px)" }}>
        <button
          onClick={function() { navigate("/assignments"); }}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,.09)", background:"rgba(255,255,255,.04)", color:T.text2, fontSize:".8rem", fontWeight:600, cursor:"pointer", transition:"all .2s", flexShrink:0 }}
          onMouseEnter={function(e) { e.currentTarget.style.borderColor="rgba(240,165,0,.4)"; e.currentTarget.style.color=T.gold; }}
          onMouseLeave={function(e) { e.currentTarget.style.borderColor="rgba(255,255,255,.09)"; e.currentTarget.style.color=T.text2; }}>
          <svg width={13} height={13} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8,2 3,6.5 8,11"/>
          </svg>
          Assignments
        </button>

        <span style={{ color:"rgba(255,255,255,.15)", fontSize:".9rem" }}>/</span>

        <div style={{ flex:1, minWidth:0, display:"flex", alignItems:"center", gap:10 }}>
          {assignment && <div style={{ width:8, height:8, borderRadius:"50%", background:accent, flexShrink:0 }}/>}
          <span className="ff" style={{ fontSize:".92rem", fontWeight:700, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {assignment ? assignment.title : "Loading..."}
          </span>
          {assignment && (
            <span style={{ padding:"2px 9px", borderRadius:6, fontSize:".65rem", fontWeight:800, background:accent+"18", border:"1px solid "+accent+"30", color:accent, flexShrink:0 }}>
              {assignment.type}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:"hidden", minHeight:0, position:"relative", zIndex:10 }}>
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:12 }}>
            <div style={{ width:36, height:36, border:"3px solid rgba(255,255,255,.08)", borderTopColor:T.gold, borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
            <div style={{ fontSize:".86rem", color:T.text3 }}>Loading...</div>
          </div>
        ) : !assignment ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:"2rem" }}>Not found</div>
            <div style={{ fontSize:".9rem", color:T.text2 }}>Assignment not found</div>
            <button className="btn-outline" onClick={function() { navigate("/assignments"); }}>Go Back</button>
          </div>
        ) : isGraded ? (
          <FeedbackModal a={assignment} onClose={function() { navigate("/assignments"); }} asPage />
        ) : (
          <SubmitModal a={assignment} onClose={function() { navigate("/assignments"); }} onSubmit={handleSubmit} asPage />
        )}
      </div>
    </div>
  );
}
