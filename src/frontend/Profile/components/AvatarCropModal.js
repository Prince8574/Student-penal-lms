import { useState, useRef, useEffect, useCallback } from "react";

export default function AvatarCropModal({ onClose, onSave }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [drag, setDrag] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const startRef = useRef(null);
  const fileRef = useRef(null);
  const SIZE = 280; // crop circle size

  function onFile(e) {
    var f = e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        imgRef.current = img;
        // Center image
        var s = Math.max(SIZE / img.width, SIZE / img.height);
        setScale(s);
        setPos({ x: (SIZE - img.width * s) / 2, y: (SIZE - img.height * s) / 2 });
        setImgSrc(ev.target.result);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(f);
  }

  // Draw canvas
  useEffect(function() {
    if (!imgSrc || !canvasRef.current || !imgRef.current) return;
    var ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);
    // Draw image
    ctx.drawImage(imgRef.current, pos.x, pos.y, imgRef.current.width * scale, imgRef.current.height * scale);
    // Dark overlay outside circle
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Circle border
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
  }, [imgSrc, pos, scale]);

  function onMouseDown(e) {
    setDrag(true);
    startRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  }
  function onMouseMove(e) {
    if (!drag || !startRef.current) return;
    setPos({ x: startRef.current.px + e.clientX - startRef.current.mx, y: startRef.current.py + e.clientY - startRef.current.my });
  }
  function onMouseUp() { setDrag(false); }

  function onWheel(e) {
    e.preventDefault();
    setScale(function(s) { return Math.min(5, Math.max(0.3, s - e.deltaY * 0.001)); });
  }

  function handleSave() {
    if (!imgRef.current) return;
    setSaving(true);
    // Draw final cropped circle to offscreen canvas
    var out = document.createElement("canvas");
    out.width = SIZE; out.height = SIZE;
    var ctx = out.getContext("2d");
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, pos.x, pos.y, imgRef.current.width * scale, imgRef.current.height * scale);
    out.toBlob(function(blob) {
      onSave(blob);
      setSaving(false);
    }, "image/jpeg", 0.92);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#0d1526", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:28, width:360, boxShadow:"0 24px 64px rgba(0,0,0,.6)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <span style={{ fontSize:"1rem", fontWeight:700, color:"#f1f5f9", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Update Profile Photo</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontSize:"1.2rem", lineHeight:1 }}>✕</button>
        </div>

        {!imgSrc ? (
          <div onClick={function(){fileRef.current.click();}}
            style={{ width:SIZE, height:SIZE, borderRadius:"50%", border:"2px dashed rgba(245,158,11,.4)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"rgba(255,255,255,.03)", margin:"0 auto 20px", transition:"border-color .2s" }}
            onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(245,158,11,.8)";}}
            onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(245,158,11,.4)";}}>
            <span style={{ fontSize:"2.5rem", marginBottom:10 }}>📷</span>
            <span style={{ fontSize:".82rem", color:"#94a3b8", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Click to upload photo</span>
            <span style={{ fontSize:".72rem", color:"#475569", marginTop:4 }}>JPG, PNG, WEBP</span>
          </div>
        ) : (
          <div style={{ position:"relative", width:SIZE, height:SIZE, margin:"0 auto 16px", cursor:drag?"grabbing":"grab", userSelect:"none" }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onWheel={onWheel}>
            <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ borderRadius:"50%", display:"block" }}/>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onFile}/>

        {imgSrc && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:".75rem", color:"#94a3b8", flexShrink:0 }}>🔍 Zoom</span>
              <input type="range" min={0.3} max={5} step={0.01} value={scale}
                onChange={function(e){setScale(parseFloat(e.target.value));}}
                style={{ flex:1, accentColor:"#f59e0b" }}/>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={function(){fileRef.current.click();}}
                style={{ flex:1, padding:"9px", borderRadius:10, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.04)", color:"#94a3b8", fontSize:".8rem", fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Change
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex:2, padding:"9px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#f59e0b,#f97316)", color:"#030810", fontSize:".85rem", fontWeight:800, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", opacity:saving?0.7:1 }}>
                {saving ? "Saving..." : "Save Photo"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
