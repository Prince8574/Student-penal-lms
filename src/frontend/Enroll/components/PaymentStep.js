import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ─── TOKENS ─── */
const T = {
  bg:"#06080F", s1:"#0B0F1A", s2:"#0F1623", s3:"#151E2E",
  b0:"rgba(255,255,255,0.05)", b1:"rgba(255,255,255,0.09)", b2:"rgba(255,255,255,0.14)",
  p:"#4F6EF7", teal:"#0EB5AA", green:"#22C55E", amber:"#F59E0B", red:"#EF4444",
  t0:"#F0F4FF", t1:"#B8C4D8", t2:"#6B7A99", t3:"#3A4460",
};

const PROMOS = {
  SAVE20:  { pct:20,  label:"20% off applied!" },
  FLAT500: { amt:500, label:"₹500 flat off applied!" },
  FIRST10: { pct:10,  label:"10% off for new users!" },
};

const PROC_MSGS = [
  "Connecting to gateway...",
  "Verifying transaction...",
  "Authorizing payment...",
  "Confirming enrollment...",
];

/* ─── WEB ANIMATIONS API HELPERS ─── */
const wa = (el, frames, opts) => {
  if (!el) return null;
  return el.animate(frames, { fill:"both", easing:"cubic-bezier(0.4,0,0.2,1)", ...opts });
};
const A = {
  fadeUp:   (el, delay=0, dur=480) => wa(el, [{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"translateY(0)"}], {duration:dur, delay}),
  fadeLeft: (el, delay=0, dur=500) => wa(el, [{opacity:0,transform:"translateX(-18px)"},{opacity:1,transform:"translateX(0)"}], {duration:dur, delay}),
  fadeRight:(el, delay=0, dur=500) => wa(el, [{opacity:0,transform:"translateX(18px)"}, {opacity:1,transform:"translateX(0)"}], {duration:dur, delay}),
  scaleIn:  (el, delay=0, dur=380) => wa(el, [{opacity:0,transform:"scale(0.93)"},{opacity:1,transform:"scale(1)"}], {duration:dur, delay}),
  pop:      (el, delay=0)          => wa(el, [{opacity:0,transform:"scale(0.88) translateY(6px)"},{opacity:1,transform:"scale(1) translateY(0)"}], {duration:280, delay, easing:"cubic-bezier(0.34,1.56,0.64,1)"}),
  bounce:   (el, delay=0)          => wa(el, [{transform:"scale(1)"},{transform:"scale(1.22)"},{transform:"scale(1)"}], {duration:360, delay, easing:"cubic-bezier(0.34,1.56,0.64,1)"}),
  shake:    (el)                   => wa(el, [{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(-3px)"},{transform:"translateX(0)"}], {duration:300, easing:"linear"}),
  spin:     (el)                   => wa(el, [{transform:"rotate(0deg)"},{transform:"rotate(360deg)"}], {duration:850, iterations:Infinity, easing:"linear"}),
  dashDraw: (el, len, delay=0, dur=900) => wa(el, [{strokeDashoffset:len},{strokeDashoffset:0}], {duration:dur, delay}),
  pulse:    (el, delay=0)          => wa(el, [{transform:"scale(1)"},{transform:"scale(1.1)"},{transform:"scale(1)"}], {duration:200, delay, easing:"cubic-bezier(0.34,1.56,0.64,1)"}),
};

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.lv*,.lv *::before,.lv *::after{box-sizing:border-box;margin:0;padding:0}
.lv{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:${T.t1}}
.lv-root{position:relative;min-height:780px;background:${T.bg};border-radius:14px;overflow:hidden}
.lv-cv{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
.lv-body{position:relative;z-index:1;padding:22px 18px}
.lv-cols{display:grid;grid-template-columns:1fr 1.08fr;gap:14px;align-items:start}
.lv-panel{background:rgba(15,22,35,.88);border:1px solid ${T.b1};border-radius:13px;padding:15px;margin-bottom:11px;backdrop-filter:blur(10px)}
.lv-lbl{font-size:10px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:${T.t3};margin-bottom:10px}
.lv-hr{height:1px;background:rgba(255,255,255,.06);margin:11px 0}
.lv-pr{display:flex;justify-content:space-between;font-size:12px;margin-bottom:7px}
.lv-tot{display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${T.t0}}
.lv-bp{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,${T.p},#6B85F8);color:#fff;font-size:14px;font-weight:800;cursor:pointer;position:relative;overflow:hidden;font-family:inherit;margin-top:10px;transition:transform .2s,box-shadow .2s}
.lv-bp:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(79,110,247,.45)}
.lv-bp::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);transform:translateX(-100%);transition:transform .5s}
.lv-bp:hover::after{transform:translateX(100%)}
.lv-bo{padding:11px 14px;border-radius:9px;border:1px solid ${T.b1};background:transparent;color:${T.t1};font-size:13px;cursor:pointer;transition:all .18s;font-family:inherit}
.lv-bo:hover{border-color:${T.b2};color:${T.t0}}
.lv-bg{padding:7px 14px;border-radius:7px;border:none;background:${T.s3};color:${T.t1};font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .16s}
.lv-bg:hover{background:#1C2740;color:${T.t0}}
.lv-bt{padding:8px 13px;border-radius:8px;border:1px solid rgba(14,181,170,.3);background:rgba(14,181,170,.13);color:${T.teal};font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .18s}
.lv-bt:hover{background:rgba(14,181,170,.24)}
.lv-inp{width:100%;background:rgba(255,255,255,.04);border:1px solid ${T.b1};border-radius:8px;padding:8px 11px;color:${T.t0};font-size:12px;outline:none;transition:border-color .2s;font-family:inherit}
.lv-inp:focus{border-color:rgba(79,110,247,.55)}
.lv-fl{display:block;font-size:10px;color:${T.t2};margin-bottom:4px;letter-spacing:.05em}
.lv-tabs{display:flex;gap:5px;background:rgba(255,255,255,.03);border-radius:9px;padding:4px;margin-bottom:13px}
.lv-tab{flex:1;padding:7px 4px;border-radius:7px;border:none;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit}
.lv-tab.on{background:rgba(79,110,247,.2);color:${T.p}}
.lv-tab.off{background:transparent;color:${T.t2}}
.lv-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px}
.lv-g2{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.lv-g4{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lv-opt{border:1px solid ${T.b1};border-radius:9px;padding:9px 6px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(255,255,255,.02)}
.lv-opt:hover{border-color:rgba(79,110,247,.4);background:rgba(79,110,247,.08);transform:translateY(-1px)}
.lv-opt.sel{border-color:rgba(79,110,247,.55);background:rgba(79,110,247,.13)}
.lv-opt svg{display:block;margin:0 auto 4px}
.lv-ol{font-size:10px;font-weight:600;color:${T.t1}}
.lv-bopt{border:1px solid ${T.b1};border-radius:9px;padding:9px 10px;display:flex;align-items:center;gap:9px;cursor:pointer;transition:all .2s;background:rgba(255,255,255,.02)}
.lv-bopt:hover,.lv-bopt.sel{border-color:rgba(79,110,247,.45);background:rgba(79,110,247,.09);transform:translateY(-1px)}
.lv-cw{perspective:800px;height:128px;margin-bottom:13px;position:relative}
.lv-cf{position:absolute;inset:0;border-radius:12px;padding:14px 16px;background:linear-gradient(135deg,#1A2580,#4F6EF7 70%,#6B85F8);backface-visibility:hidden;transition:transform .65s cubic-bezier(.4,0,.2,1)}
.lv-chips{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
.lv-chip{padding:3px 9px;border-radius:99px;font-size:10px;font-weight:700;cursor:pointer;transition:all .15s}
.ct{background:rgba(14,181,170,.08);border:1px solid rgba(14,181,170,.22);color:${T.teal}}
.ct:hover{background:rgba(14,181,170,.18)}
.cb{background:rgba(79,110,247,.08);border:1px solid rgba(79,110,247,.22);color:${T.p}}
.cb:hover{background:rgba(79,110,247,.18)}
.ca{background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.22);color:${T.amber}}
.ca:hover{background:rgba(245,158,11,.18)}
.lv-si{padding:8px 11px;border-radius:8px;background:rgba(79,110,247,.08);border:1px solid rgba(79,110,247,.2);font-size:12px;color:${T.t1};margin-bottom:9px}
.lv-si b{color:${T.p}}
.lv-ti{background:rgba(15,22,35,.82);border:1px solid ${T.b0};border-radius:9px;padding:9px 10px;display:flex;align-items:center;gap:8px;backdrop-filter:blur(6px)}
.lv-br{display:flex;align-items:center;gap:7px;margin-top:9px;padding:7px 9px;background:rgba(255,255,255,.02);border-radius:7px;border:1px solid ${T.b0}}
.lv-sc{padding:10px;border-radius:8px}
`;

/* ─── THREE.JS HOOK ─── */
function useThreeScene(cvRef, rootRef) {
  const burst = useRef({ active:false, parts:[], vels:[] });
  const state = useRef({});

  useEffect(() => {
    const cv   = cvRef.current;
    const root = rootRef.current;
    if (!cv || !root) return;
    const W = root.offsetWidth || 700;
    const H = root.offsetHeight || 780;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: true });
    } catch(e) {
      console.warn('[WebGL] PaymentStep background skipped:', e.message);
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 0.1, 1000);
    camera.position.z = 100;
    const PC = 110;
    const pos = new Float32Array(PC * 3);
    const vel = [];
    for (let i = 0; i < PC; i++) {
      pos[i*3]   = (Math.random() - 0.5) * W;
      pos[i*3+1] = (Math.random() - 0.5) * H;
      pos[i*3+2] = 0;
      vel.push({ x:(Math.random()-0.5)*0.26, y:(Math.random()-0.5)*0.26 });
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const ptMat = new THREE.PointsMaterial({ color:0x4F6EF7, size:2.8, transparent:true, opacity:0.52 });
    scene.add(new THREE.Points(ptGeo, ptMat));
    const lArr = new Float32Array(PC * (PC-1) / 2 * 6);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(lArr, 3));
    const lMat = new THREE.LineBasicMaterial({ color:0x4F6EF7, transparent:true, opacity:0.08 });
    scene.add(new THREE.LineSegments(lGeo, lMat));
    state.current = { scene, renderer, ptMat, lMat, pos, vel, lGeo, lArr, PC, W, H };
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      for (let i = 0; i < PC; i++) {
        pos[i*3]   += vel[i].x;
        pos[i*3+1] += vel[i].y;
        if (Math.abs(pos[i*3])   > W/2) vel[i].x *= -1;
        if (Math.abs(pos[i*3+1]) > H/2) vel[i].y *= -1;
      }
      ptGeo.attributes.position.needsUpdate = true;
      let idx = 0;
      for (let a = 0; a < PC; a++) {
        for (let b = a+1; b < PC; b++) {
          const dx = pos[a*3]-pos[b*3], dy = pos[a*3+1]-pos[b*3+1];
          if (Math.sqrt(dx*dx+dy*dy) < 100) {
            lArr[idx++]=pos[a*3]; lArr[idx++]=pos[a*3+1]; lArr[idx++]=0;
            lArr[idx++]=pos[b*3]; lArr[idx++]=pos[b*3+1]; lArr[idx++]=0;
          } else { idx += 6; }
        }
      }
      lGeo.attributes.position.needsUpdate = true;
      if (burst.current.active) {
        burst.current.parts.forEach((p, k) => {
          const v = burst.current.vels[k];
          p.x += v.x; p.y += v.y; p.life -= 0.013;
          v.x *= 0.96; v.y *= 0.96;
          p.arr[0] = p.x; p.arr[1] = p.y;
          p.geo.attributes.position.needsUpdate = true;
          p.mat.opacity = Math.max(0, p.life);
        });
      }
      renderer.render(scene, camera);
    };
    loop();
    return () => { cancelAnimationFrame(raf); renderer.dispose(); };
  }, [cvRef, rootRef]);

  const triggerBurst = useCallback(() => {
    const { scene, ptMat, lMat } = state.current;
    if (!scene) return;
    burst.current.active = true;
    const cols = [0x4F6EF7, 0x22C55E, 0xF59E0B, 0x0EB5AA, 0x6B85F8, 0xF43F5E, 0xA855F7];
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = 1.5 + Math.random() * 7;
      const geo   = new THREE.BufferGeometry();
      const arr   = new Float32Array([0, 0, 0]);
      geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const mat = new THREE.PointsMaterial({ color:cols[i%cols.length], size:2.5+Math.random()*4, transparent:true, opacity:1 });
      scene.add(new THREE.Points(geo, mat));
      burst.current.parts.push({ geo, mat, arr, x:0, y:0, life:1 });
      burst.current.vels.push({ x:Math.cos(angle)*spd, y:Math.sin(angle)*spd });
    }
    if (ptMat) ptMat.color.setHex(0x22C55E);
    if (lMat)  lMat.color.setHex(0x22C55E);
  }, []);

  return { triggerBurst };
}

/* ─── SMALL SVGs ─── */
const BSvg = ({ fill, text, tf="#fff", fs=11 }) => (
  <svg width="28" height="28" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill={fill}/>
    <text x="24" y="31" textAnchor="middle" fontSize={fs} fontWeight="900" fill={tf}>{text}</text>
  </svg>
);

const CardBrands = () => (
  <div className="lv-br">
    <span style={{fontSize:10,color:T.t3}}>Accepted:</span>
    <svg width="30" height="19" viewBox="0 0 54 34"><rect width="54" height="34" rx="5" fill="#1A1F71"/><circle cx="22" cy="17" r="10" fill="#EB001B"/><circle cx="32" cy="17" r="10" fill="#F79E1B"/><path d="M27 9.8a10 10 0 0 1 0 14.4A10 10 0 0 1 27 9.8z" fill="#FF5F00"/></svg>
    <svg width="30" height="19" viewBox="0 0 54 34"><rect width="54" height="34" rx="5" fill="#252525"/><text x="27" y="23" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontStyle="italic">VISA</text></svg>
    <svg width="30" height="19" viewBox="0 0 54 34"><rect width="54" height="34" rx="5" fill="#2E77BC"/><text x="27" y="23" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">RUPAY</text></svg>
    <svg width="30" height="19" viewBox="0 0 54 34"><rect width="54" height="34" rx="5" fill="#006FCF"/><text x="27" y="23" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">AMEX</text></svg>
  </div>
);

/* ─── MAIN COMPONENT ─── */
export default function PaymentStep({ course, onPay, onBack }) {
  const data = {
    title:      course?.title      || "Course",
    instructor: course?.instructor || "Instructor",
    duration:   course?.duration   || "—",
    rating:     course?.rating     || 4.5,
    reviews:    course?.reviews    || 0,
    icon:       course?.icon       || "📘",
    price:      course?.price      || 0,
    original:   course?.originalPrice || course?.price || 0,
  };
  const BASE = data.price;

  /* refs */
  const cvRef       = useRef(null);
  const rootRef     = useRef(null);
  const payRef      = useRef(null);
  const procRef     = useRef(null);
  const ringRef     = useRef(null);
  const msgRef      = useRef(null);
  const succRef     = useRef(null);
  const promoRowRef = useRef(null);
  const totRef      = useRef(null);
  const btnRef      = useRef(null);
  const pInpRef     = useRef(null);
  const upiInfoRef  = useRef(null);
  const bankInfoRef = useRef(null);
  const walInfoRef  = useRef(null);
  const lcRef       = useRef(null);
  const rcRef       = useRef(null);
  const hdrRef      = useRef(null);
  const panelRef    = {
    upi:    useRef(null),
    card:   useRef(null),
    bank:   useRef(null),
    wallet: useRef(null),
  };

  /* state */
  const [tab,        setTab]        = useState("upi");
  const [promoCode,  setPromoCode]  = useState("");
  const [promoDisc,  setPromoDisc]  = useState(0);
  const [promoApply, setPromoApply] = useState("");
  const [promoMsg,   setPromoMsg]   = useState({ text:"", ok:true });
  const [page,       setPage]       = useState("pay");
  const [progW,      setProgW]      = useState(0);
  const [upiSel,     setUpiSel]     = useState(null);
  const [bankSel,    setBankSel]    = useState(null);
  const [walletSel,  setWalletSel]  = useState(null);
  const [showUpiId,  setShowUpiId]  = useState(false);
  const [method,     setMethod]     = useState("Select a method");
  const [cNum,  setCNum]   = useState("");
  const [cName, setCName]  = useState("");
  const [cExp,  setCExp]   = useState("");
  const [cCvv,  setCCvv]   = useState("");
  const [flipped, setFlipped] = useState(false);
  const txnId = useRef(`TXN-${Date.now()}`);

  const { triggerBurst } = useThreeScene(cvRef, rootRef);

  /* inject CSS once */
  useEffect(() => {
    if (document.getElementById("lv-css")) return;
    const s = document.createElement("style");
    s.id = "lv-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }, []);

  /* entrance */
  useEffect(() => {
    const t = setTimeout(() => {
      A.fadeUp(hdrRef.current, 0, 440);
      A.fadeLeft(lcRef.current, 80, 500);
      A.fadeRight(rcRef.current, 160, 500);
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const sub   = BASE - promoDisc;
  const gst   = Math.round(sub * 0.18);
  const total = sub + gst;

  const fmtNum = v => v.replace(/\D/g, "").slice(0,16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = v => { const n = v.replace(/\D/g,"").slice(0,4); return n.length >= 3 ? n.slice(0,2)+" / "+n.slice(2) : n; };

  /* promo */
  const applyPromo = useCallback(() => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoMsg({ text:"", ok:true }); return; }
    const p = PROMOS[code];
    if (p) {
      const disc = Math.min(p.pct ? Math.round(BASE*p.pct/100) : p.amt, BASE-1);
      setPromoDisc(disc);
      setPromoApply(code);
      setPromoMsg({ text:"✓ "+p.label, ok:true });
      setTimeout(() => { A.pop(promoRowRef.current); A.bounce(totRef.current); A.bounce(btnRef.current); }, 10);
    } else {
      setPromoDisc(0); setPromoApply("");
      setPromoMsg({ text:"✗ Invalid promo code", ok:false });
      setTimeout(() => A.shake(pInpRef.current), 10);
    }
  }, [promoCode, BASE]);

  const switchTab = t => { setTab(t); setTimeout(() => A.fadeUp(panelRef[t]?.current, 0, 220), 10); };
  const showSel = ref => setTimeout(() => A.pop(ref.current), 10);

  /* payment flow */
  const [payError, setPayError] = useState("");

  const startPay = () => {
    // Validate payment method selected
    if (method === "Select a method") {
      setPayError("Please select a payment method to continue.");
      setTimeout(() => A.shake(btnRef.current), 10);
      return;
    }
    setPayError("");
    if (payRef.current) {
      const anim = payRef.current.animate(
        [{ opacity:1, transform:"translateY(0)" }, { opacity:0, transform:"translateY(-18px)" }],
        { duration:360, fill:"both", easing:"cubic-bezier(0.4,0,0.2,1)" }
      );
      anim.onfinish = goProc;
    } else { goProc(); }
  };

  const goProc = () => {
    setPage("proc");
    let prog = 0;
    const pI = setInterval(() => { prog = Math.min(prog + 1.8, 94); setProgW(prog); }, 60);
    let mi = 0;
    const mI = setInterval(() => {
      mi = (mi + 1) % PROC_MSGS.length;
      const el = msgRef.current;
      if (!el) return;
      const fade = el.animate([{opacity:1},{opacity:0}], {duration:160, fill:"both"});
      fade.onfinish = () => { el.textContent = PROC_MSGS[mi]; el.animate([{opacity:0},{opacity:1}], {duration:160, fill:"both"}); };
    }, 950);
    setTimeout(() => {
      clearInterval(pI); clearInterval(mI); setProgW(100);
      setTimeout(() => {
        setPage("success");
        setTimeout(() => {
          A.scaleIn(succRef.current, 0, 360);
          triggerBurst();
          A.dashDraw(document.getElementById("lv-cc"), 201, 0,   900);
          A.dashDraw(document.getElementById("lv-cm"), 55,  880, 460);
          A.pulse(document.getElementById("lv-csv"), 880);
          A.fadeUp(document.getElementById("lv-sh"),    1060, 400);
          A.fadeUp(document.getElementById("lv-ss"),    1200, 360);
          A.fadeUp(document.getElementById("lv-scd"),   1360, 360);
          document.querySelectorAll(".lv-sc").forEach((el, i) => A.pop(el, 1460 + i*65));
          A.fadeUp(document.getElementById("lv-srec"),  1740, 320);
          A.fadeUp(document.getElementById("lv-sbtns"), 1880, 320);
          /* enrollment happens when user clicks Start Learning */
        }, 50);
      }, 320);
    }, 3900);
  };

  /* spin ring */
  useEffect(() => {
    if (page === "proc" && ringRef.current) setTimeout(() => A.spin(ringRef.current), 30);
    if (page === "proc" && procRef.current) A.fadeUp(procRef.current, 0, 360);
  }, [page]);

  const UPI_LIST = [
    {id:"gpay",  name:"Google Pay",  fill:"#fff",    text:"G",      tf:"#4285F4", fs:18},
    {id:"ppe",   name:"PhonePe",     fill:"#5F259F", text:"₱",      tf:"#fff",    fs:22},
    {id:"paytm", name:"Paytm",       fill:"#002970", text:"Paytm",  tf:"#00BAF2", fs:10},
    {id:"bhim",  name:"BHIM UPI",    fill:"#00409A", text:"BHIM",   tf:"#fff",    fs:11},
    {id:"amz",   name:"Amazon Pay",  fill:"#FF9900", text:"amazon", tf:"#000",    fs:9 },
    {id:"other", name:"Other UPI",   fill:"#1A2233", text:"UPI ID", tf:T.t2,      fs:10},
  ];
  const BANK_LIST = [
    {id:"sbi",  name:"State Bank of India", fill:"#2B4E9F", text:"SBI",   fs:12},
    {id:"hdfc", name:"HDFC Bank",            fill:"#004C8F", text:"HDFC",  fs:9 },
    {id:"ici",  name:"ICICI Bank",           fill:"#B02027", text:"ICICI", fs:9 },
    {id:"axis", name:"Axis Bank",            fill:"#97144D", text:"AXIS",  fs:9 },
    {id:"kok",  name:"Kotak Bank",           fill:"#EF4423", text:"Kotak", fs:9 },
    {id:"pnb",  name:"Punjab National Bank", fill:"#1B3370", text:"PNB",   fs:11},
  ];
  const WAL_LIST = [
    {name:"FreeCharge",   fill:"#FF6B35", text:"FREE",    fs:9 },
    {name:"MobiKwik",     fill:"#1DB8E3", text:"Mobi",    fs:9 },
    {name:"Airtel Money", fill:"#E40000", text:"Airtel",  fs:9 },
    {name:"JioMoney",     fill:"#0062FF", text:"JIO",     fs:10},
    {name:"PayZapp",      fill:"#004C8F", text:"PayZapp", fs:8 },
    {name:"Simpl",        fill:"#5B2D8E", text:"Simpl",   fs:10},
  ];

  return (
    <div className="lv">
      <div className="lv-root" ref={rootRef}>
        <canvas ref={cvRef} className="lv-cv" />
        <div className="lv-body">

          {/* ══ PAY PAGE ══ */}
          {page === "pay" && (
            <div ref={payRef}>
              <div ref={hdrRef} style={{textAlign:"center", marginBottom:18}}>
                <div style={{fontSize:10, fontWeight:700, letterSpacing:".12em", color:T.p, textTransform:"uppercase", marginBottom:4}}>Secure Checkout</div>
                <div style={{fontSize:20, fontWeight:800, color:T.t0, letterSpacing:"-.03em"}}>Complete Your Enrollment</div>
              </div>
              <div className="lv-cols">

                {/* LEFT */}
                <div ref={lcRef}>
                  {/* Summary */}
                  <div className="lv-panel">
                    <div className="lv-lbl">Order Summary</div>
                    <div style={{display:"flex", gap:11, alignItems:"flex-start", marginBottom:13}}>
                      <div style={{width:44, height:44, borderRadius:10, background:"rgba(79,110,247,0.14)", border:"1px solid rgba(79,110,247,0.25)", display:"grid", placeItems:"center", fontSize:20, flexShrink:0}}>{data.icon}</div>
                      <div>
                        <div style={{fontSize:13, fontWeight:700, color:T.t0, lineHeight:1.3, marginBottom:3}}>{data.title}</div>
                        <div style={{fontSize:11, color:T.t2}}>{data.instructor} · {data.duration} · Certificate</div>
                        <div style={{fontSize:10, color:T.amber, marginTop:3}}>{"★".repeat(5)} <span style={{color:T.t2}}>{data.rating} ({data.reviews?.toLocaleString()})</span></div>
                      </div>
                    </div>
                    <div className="lv-hr" />
                    <div className="lv-pr"><span style={{color:T.t2}}>Base price</span><span style={{textDecoration:"line-through", color:T.t3}}>₹{data.original?.toLocaleString()}</span></div>
                    <div className="lv-pr"><span style={{color:T.t2}}>Discount</span><span style={{color:T.green}}>− ₹{(data.original - BASE).toLocaleString()}</span></div>
                    {promoApply && (<div ref={promoRowRef} className="lv-pr"><span style={{color:T.teal}}>Promo ({promoApply})</span><span style={{color:T.teal}}>− ₹{promoDisc.toLocaleString()}</span></div>)}
                    <div className="lv-pr"><span style={{color:T.t2}}>Subtotal</span><span>₹{sub.toLocaleString()}</span></div>
                    <div className="lv-pr"><span style={{color:T.t2}}>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
                    <div className="lv-hr" />
                    <div ref={totRef} className="lv-tot"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                  </div>

                  {/* Promo */}
                  <div className="lv-panel">
                    <div className="lv-lbl">Promo Code</div>
                    <div style={{display:"flex", gap:7, marginBottom:7}}>
                      <input ref={pInpRef} className="lv-inp" placeholder="Enter code (try SAVE20)" value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && applyPromo()} />
                      <button className="lv-bt" onClick={applyPromo}>Apply</button>
                    </div>
                    <div style={{fontSize:11, height:15, color:promoMsg.ok ? T.green : T.red}}>{promoMsg.text}</div>
                    <div className="lv-chips">
                      <span className="lv-chip ct" onClick={() => { setPromoCode("SAVE20");  setTimeout(applyPromo, 0); }}>SAVE20</span>
                      <span className="lv-chip cb" onClick={() => { setPromoCode("FLAT500"); setTimeout(applyPromo, 0); }}>FLAT500</span>
                      <span className="lv-chip ca" onClick={() => { setPromoCode("FIRST10"); setTimeout(applyPromo, 0); }}>FIRST10</span>
                    </div>
                  </div>

                  {/* Trust */}
                  <div className="lv-g4">
                    {[
                      {e:"🔒", t:"SSL Secured",   s:"256-bit encrypted"},
                      {e:"↩️", t:"30-day Refund", s:"No questions asked"},
                      {e:"🏛️", t:"RBI Regulated", s:"PCI-DSS Compliant"},
                      {e:"📜", t:"GST Invoice",   s:"Sent on email"},
                    ].map(i => (
                      <div key={i.t} className="lv-ti">
                        <span style={{fontSize:15}}>{i.e}</span>
                        <div>
                          <div style={{fontSize:11, fontWeight:600, color:T.t1}}>{i.t}</div>
                          <div style={{fontSize:10, color:T.t3}}>{i.s}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Back button */}
                  <button className="lv-bo" style={{width:"100%", marginTop:10}} onClick={onBack}>← Back</button>
                </div>

                {/* RIGHT */}
                <div ref={rcRef}>
                  <div className="lv-panel" style={{marginBottom:0}}>
                    <div className="lv-lbl">Payment Method</div>
                    <div className="lv-tabs">
                      {[["upi","UPI"],["card","Card"],["bank","Net Banking"],["wallet","Wallets"]].map(([t,l]) => (
                        <button key={t} className={`lv-tab ${tab===t?"on":"off"}`} onClick={() => switchTab(t)}>{l}</button>
                      ))}
                    </div>

                    {/* UPI */}
                    <div ref={panelRef.upi} style={{display:tab==="upi"?"block":"none"}}>
                      <div style={{fontSize:10, color:T.t3, fontWeight:600, letterSpacing:".06em", marginBottom:8}}>QUICK PAY WITH</div>
                      <div className="lv-g3">
                        {UPI_LIST.map(u => (
                          <div key={u.id} className={`lv-opt ${upiSel===u.id?"sel":""}`}
                            onClick={() => { setUpiSel(u.id); setShowUpiId(u.id==="other"); setMethod(u.name); showSel(upiInfoRef); }}>
                            <BSvg fill={u.fill} text={u.text} tf={u.tf} fs={u.fs} />
                            <div className="lv-ol">{u.name}</div>
                          </div>
                        ))}
                      </div>
                      {showUpiId && (
                        <div style={{marginBottom:9}}>
                          <label className="lv-fl">YOUR UPI ID</label>
                          <div style={{display:"flex", gap:7}}>
                            <input className="lv-inp" placeholder="name@upi" style={{flex:1}} />
                            <button className="lv-bg">Verify</button>
                          </div>
                        </div>
                      )}
                      {upiSel && (<div ref={upiInfoRef} className="lv-si"><b>{method}</b> selected · Redirect to app to complete payment</div>)}
                    </div>

                    {/* Card */}
                    <div ref={panelRef.card} style={{display:tab==="card"?"block":"none"}}>
                      <div className="lv-cw">
                        <div className="lv-cf" style={{transform:flipped?"rotateY(-180deg)":"rotateY(0deg)"}}>
                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
                            <span style={{fontSize:9, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,0.55)"}}>LEARNVERSE</span>
                            <div style={{display:"flex"}}>
                              <div style={{width:17, height:17, borderRadius:"50%", background:"rgba(255,200,0,.85)"}} />
                              <div style={{width:17, height:17, borderRadius:"50%", background:"rgba(255,100,0,.7)", marginLeft:-6}} />
                            </div>
                          </div>
                          <div style={{fontSize:13, fontWeight:700, letterSpacing:".15em", color:"#fff", marginBottom:12, fontFamily:"monospace"}}>{cNum || "•••• •••• •••• ••••"}</div>
                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end"}}>
                            <div>
                              <div style={{fontSize:8, color:"rgba(255,255,255,0.45)", letterSpacing:".07em", marginBottom:2}}>HOLDER</div>
                              <div style={{fontSize:11, color:"#fff", fontWeight:600}}>{(cName||"YOUR NAME").toUpperCase().slice(0,18)}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:8, color:"rgba(255,255,255,0.45)", letterSpacing:".07em", marginBottom:2}}>EXPIRES</div>
                              <div style={{fontSize:11, color:"#fff", fontWeight:600}}>{cExp||"MM/YY"}</div>
                            </div>
                          </div>
                        </div>
                        <div className="lv-cf" style={{transform:flipped?"rotateY(0deg)":"rotateY(180deg)"}}>
                          <div style={{width:"100%", height:22, background:"rgba(0,0,0,0.4)", borderRadius:3, marginBottom:14}} />
                          <div style={{display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end"}}>
                            <span style={{fontSize:10, color:"rgba(255,255,255,0.5)"}}>CVV</span>
                            <div style={{background:"rgba(255,255,255,0.9)", borderRadius:4, padding:"3px 13px", fontFamily:"monospace", fontSize:12, fontWeight:700, color:"#1A2580", minWidth:42, textAlign:"center"}}>{cCvv||"•••"}</div>
                          </div>
                        </div>
                      </div>
                      <label className="lv-fl">CARDHOLDER NAME</label>
                      <input className="lv-inp" placeholder="Rahul Khan" value={cName} onChange={e => setCName(e.target.value)} style={{marginBottom:9}} />
                      <label className="lv-fl">CARD NUMBER</label>
                      <input className="lv-inp" placeholder="1234 5678 9012 3456" maxLength={19} value={cNum} style={{fontFamily:"monospace", marginBottom:9}} onChange={e => setCNum(fmtNum(e.target.value))} />
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                        <div>
                          <label className="lv-fl">EXPIRY</label>
                          <input className="lv-inp" placeholder="MM / YY" maxLength={7} value={cExp} onChange={e => setCExp(fmtExp(e.target.value))} />
                        </div>
                        <div>
                          <label className="lv-fl">CVV</label>
                          <input className="lv-inp" placeholder="•••" maxLength={3} value={cCvv} style={{letterSpacing:".18em"}}
                            onFocus={() => { setFlipped(true); setMethod("Credit / Debit Card"); }}
                            onBlur={() => setFlipped(false)}
                            onChange={e => setCCvv(e.target.value)} />
                        </div>
                      </div>
                      <CardBrands />
                    </div>

                    {/* Net Banking */}
                    <div ref={panelRef.bank} style={{display:tab==="bank"?"block":"none"}}>
                      <div style={{fontSize:10, color:T.t3, fontWeight:600, letterSpacing:".06em", marginBottom:8}}>SELECT YOUR BANK</div>
                      <div className="lv-g2">
                        {BANK_LIST.map(b => (
                          <div key={b.id} className={`lv-bopt ${bankSel===b.id?"sel":""}`}
                            onClick={() => { setBankSel(b.id); setMethod(b.name); showSel(bankInfoRef); }}>
                            <BSvg fill={b.fill} text={b.text} fs={b.fs} />
                            <div>
                              <div style={{fontSize:11, fontWeight:600, color:T.t1}}>{b.name.split(" ").slice(0,2).join(" ")}</div>
                              <div style={{fontSize:10, color:T.t3}}>Net Banking</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {bankSel && (<div ref={bankInfoRef} className="lv-si"><b>{method}</b> selected · Secure redirect to bank portal</div>)}
                    </div>

                    {/* Wallets */}
                    <div ref={panelRef.wallet} style={{display:tab==="wallet"?"block":"none"}}>
                      <div style={{fontSize:10, color:T.t3, fontWeight:600, letterSpacing:".06em", marginBottom:8}}>SELECT WALLET</div>
                      <div className="lv-g3">
                        {WAL_LIST.map(w => (
                          <div key={w.name} className={`lv-opt ${walletSel===w.name?"sel":""}`}
                            onClick={() => { setWalletSel(w.name); setMethod(w.name); showSel(walInfoRef); }}>
                            <BSvg fill={w.fill} text={w.text} fs={w.fs} />
                            <div className="lv-ol">{w.name}</div>
                          </div>
                        ))}
                      </div>
                      {walletSel && (<div ref={walInfoRef} className="lv-si"><b>{walletSel}</b> selected · Pay from wallet balance</div>)}
                    </div>

                    <button className="lv-bp" onClick={startPay}>
                      Pay <span ref={btnRef}>₹{total.toLocaleString()}</span> Securely →
                    </button>
                    {payError && (
                      <div style={{textAlign:"center", fontSize:11, color:T.red, marginTop:7, padding:"7px 10px", borderRadius:7, background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)"}}>
                        ⚠ {payError}
                      </div>
                    )}
                    <div style={{textAlign:"center", fontSize:10, color:T.t3, marginTop:7}}>🔒 PCI-DSS · RBI Regulated · 256-bit SSL</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ PROCESSING ══ */}
          {page === "proc" && (
            <div ref={procRef} style={{textAlign:"center", padding:"55px 20px", maxWidth:360, margin:"0 auto"}}>
              <div ref={ringRef} style={{width:64, height:64, border:"3px solid rgba(79,110,247,0.15)", borderTop:`3px solid ${T.p}`, borderRadius:"50%", margin:"0 auto 20px"}} />
              <div style={{fontSize:17, fontWeight:700, color:T.t0, marginBottom:7}}>Processing Payment</div>
              <div ref={msgRef} style={{fontSize:12, color:T.t2}}>{PROC_MSGS[0]}</div>
              <div style={{width:200, height:3, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden", margin:"18px auto 0"}}>
                <div style={{height:"100%", background:`linear-gradient(90deg,${T.p},#6B85F8)`, borderRadius:99, width:`${progW}%`, transition:"width .4s"}} />
              </div>
            </div>
          )}

          {/* ══ SUCCESS ══ */}
          {page === "success" && (
            <div ref={succRef} style={{textAlign:"center", padding:"24px 16px", maxWidth:480, margin:"0 auto"}}>
              <svg id="lv-csv" width="72" height="72" viewBox="0 0 72 72" style={{display:"block", margin:"0 auto 15px"}}>
                <circle id="lv-cc" cx="36" cy="36" r="32" fill="none" stroke={T.p} strokeWidth="2.5" strokeDasharray="201" strokeDashoffset="201" />
                <polyline id="lv-cm" points="18,38 30,50 54,24" fill="none" stroke={T.p} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="55" strokeDashoffset="55" />
              </svg>
              <div id="lv-sh" style={{fontSize:23, fontWeight:800, color:T.t0, letterSpacing:"-.03em", marginBottom:7, opacity:0}}>Enrolled Successfully!</div>
              <div id="lv-ss" style={{fontSize:13, color:T.t2, marginBottom:18, lineHeight:1.6, opacity:0}}>
                You're now enrolled in<br /><strong style={{color:T.t1}}>{data.title}</strong>
              </div>
              <div id="lv-scd" className="lv-panel" style={{textAlign:"left", marginBottom:15, opacity:0}}>
                <div className="lv-lbl">Enrollment Receipt</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10}}>
                  <div className="lv-sc" style={{background:"rgba(79,110,247,0.07)", border:"1px solid rgba(79,110,247,0.15)"}}>
                    <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".09em",color:T.t3,marginBottom:4}}>ORDER ID</div>
                    <div style={{fontSize:12,fontWeight:700,color:T.t0,fontFamily:"monospace"}}>#LV-{Math.floor(Math.random()*900000+100000)}</div>
                  </div>
                  <div className="lv-sc" style={{background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.15)"}}>
                    <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".09em",color:T.t3,marginBottom:4}}>PAID</div>
                    <div style={{fontSize:12,fontWeight:700,color:T.green}}>₹{total.toLocaleString()}</div>
                  </div>
                  <div className="lv-sc" style={{background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.15)"}}>
                    <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".09em",color:T.t3,marginBottom:4}}>GST PAID</div>
                    <div style={{fontSize:12,fontWeight:700,color:T.amber}}>₹{gst.toLocaleString()}</div>
                  </div>
                  <div className="lv-sc" style={{background:"rgba(14,181,170,0.07)", border:"1px solid rgba(14,181,170,0.15)"}}>
                    <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".09em",color:T.t3,marginBottom:4}}>VIA</div>
                    <div style={{fontSize:12,fontWeight:700,color:T.teal}}>{method}</div>
                  </div>
                </div>
                <div id="lv-srec" style={{display:"flex",alignItems:"center",gap:7,padding:"8px 10px",background:"rgba(34,197,94,0.06)",borderRadius:7,border:"1px solid rgba(34,197,94,0.14)",fontSize:11,color:T.t1,opacity:0}}>
                  <span style={{fontSize:14}}>📧</span> Receipt sent to your registered email
                </div>
              </div>
              <div id="lv-sbtns" style={{display:"flex", gap:9, opacity:0}}>
                <button className="lv-bp" style={{flex:1}} onClick={() => onPay && onPay({ paymentMethod: method, transactionId: txnId.current, amount: total, gst, confirmed: true })}>
                  Start Learning →
                </button>
                <button className="lv-bo">Download Invoice</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
