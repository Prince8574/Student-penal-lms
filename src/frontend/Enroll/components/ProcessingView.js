import { useEffect, useState } from "react";

const MSGS = [
  "Connecting to payment gateway...",
  "Verifying transaction details...",
  "Authorizing payment...",
  "Confirming enrollment...",
];

export default function ProcessingView() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIdx(i => (i + 1) % MSGS.length);
    }, 900);
    const progTimer = setInterval(() => {
      setProgress(p => Math.min(p + 2, 95));
    }, 60);
    return () => { clearInterval(msgTimer); clearInterval(progTimer); };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      {/* Spinner */}
      <div style={{
        width: 68, height: 68, margin: "0 auto 22px",
        border: "3px solid rgba(79,110,247,0.15)",
        borderTop: "3px solid #4F6EF7",
        borderRadius: "50%",
        animation: "procSpin .9s linear infinite",
      }} />
      <style>{`@keyframes procSpin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ fontSize: 17, fontWeight: 700, color: "#F0F4FF", marginBottom: 7 }}>Processing Payment</div>
      <div style={{ fontSize: 12, color: "#6B7A99", marginBottom: 20, transition: "opacity .2s" }}>{MSGS[msgIdx]}</div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,.05)", borderRadius: 99, overflow: "hidden", width: 200, margin: "0 auto" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#4F6EF7,#6B85F8)", borderRadius: 99, width: `${progress}%`, transition: "width .4s ease" }} />
      </div>
    </div>
  );
}
