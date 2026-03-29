import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EditProfile.css';
import Cursor from './editComponents/Cursor';
import Toast from './editComponents/Toast';
import CompletionRing from './editComponents/CompletionRing';
import ProgressSteps from './editComponents/ProgressSteps';
import SectionCard from './editComponents/SectionCard';
import { Label, FormInput, FormSelect, Grid } from './editComponents/FormHelpers';

// Aliases for shorter usage
const SC = SectionCard;
const Lbl = Label;
const FInput = FormInput;
const FSelect = FormSelect;

/* ═══════════════════════════════════════════
TOKENS
═══════════════════════════════════════════ */
const T = {
bg:"#02060f",
card:"rgba(11,20,42,0.9)",
card2:"rgba(15,26,52,0.88)",
gold:"#f0a500",
orange:"#ff7a30",
teal:"#00d4aa",
blue:"#3b82f6",
purple:"#a78bfa",
pink:"#f472b6",
green:"#4ade80",
red:"#ef4444",
text:"#f0f6ff",
text2:"#8899b8",
text3:"#3d4f6e",
bord:"rgba(255,255,255,0.06)",
bordGold:"rgba(240,165,0,0.25)",
glow:"rgba(240,165,0,0.1)",
};

const G = {
gold:"linear-gradient(135deg,#f0a500,#ff7a30)",
teal:"linear-gradient(135deg,#00d4aa,#3b82f6)",
purple:"linear-gradient(135deg,#a78bfa,#f472b6)",
};

/* ═══════ TOGGLE ROW ═══════ */
function TRow({label,desc,on,toggle}){
return(
<div className="tog-row">
<div>
<div style={{fontSize:".87rem",fontWeight:600}}>{label}</div>
<div style={{fontSize:".72rem",color:T.text3,marginTop:2}}>{desc}</div>
</div>
<div className={`sw${on?" on":""}`} style={{background:on?G.gold:"rgba(255,255,255,.08)"}} onClick={toggle}/>
</div>
);
}

/* ═══════ SKILL MANAGER ═══════ */
const COL_OPTS=[
{id:"gold",bg:"rgba(240,165,0,.1)",col:T.gold,bord:"rgba(240,165,0,.2)"},
{id:"teal",bg:"rgba(0,212,170,.08)",col:T.teal,bord:"rgba(0,212,170,.18)"},
{id:"blue",bg:"rgba(59,130,246,.08)",col:T.blue,bord:"rgba(59,130,246,.18)"},
{id:"purple",bg:"rgba(167,139,250,.08)",col:T.purple,bord:"rgba(167,139,250,.18)"},
{id:"pink",bg:"rgba(244,114,182,.08)",col:T.pink,bord:"rgba(244,114,182,.18)"},
];

const CM=Object.fromEntries(COL_OPTS.map(c=>[c.id,c]));

function SkillMgr({skills,onChange}){
const [inp,setInp]=useState("");
const [cc,setCc]=useState("gold");

const add=()=>{
const v=inp.trim();
if(!v||skills.find(s=>s.l.toLowerCase()===v.toLowerCase()))return;
onChange([...skills,{l:v,c:cc}]);
setInp("");
};

return(
<div>
<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14,minHeight:36}}>
{skills.map((sk,i)=>{
const c=CM[sk.c]||CM.gold;
return(
<span key={i} className="sk-tag" style={{background:c.bg,color:c.col,borderColor:c.bord,animation:`popIn .3s ${i*.04}s both`}}>
{sk.l}
<span className="x" onClick={()=>onChange(skills.filter((_,j)=>j!==i))}>✕</span>
</span>
);
})}
{!skills.length&&<span style={{fontSize:".8rem",color:T.text3,fontStyle:"italic"}}>No skills yet…</span>}
</div>
<div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
<input className="lv-inp" placeholder="Type a skill & press Enter…" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} style={{flex:1,minWidth:140,padding:"8px 13px"}}/>
<div style={{display:"flex",gap:5}}>
{COL_OPTS.map(c=><div key={c.id} className={`swatch${cc===c.id?" sel":""}`} style={{background:c.col,width:22,height:22}} onClick={()=>setCc(c.id)}/>)}
</div>
<button className="add-tag" onClick={add}>+ Add</button>
</div>
</div>
);
}

/* ═══════ AVATAR SECTION ═══════ */
function AvatarEdit({initials,color,onColor,photo,onPhotoChange}){
const colors=[T.gold,T.teal,T.blue,T.purple,T.pink,T.green,T.orange,T.red];
const [tempImage, setTempImage] = useState(null);

const handleFileSelect = (e) => {
const file = e.target.files?.[0];
if (!file) return;

// Validate file type
if (!file.type.startsWith('image/')) {
alert('Please select an image file');
return;
}

// Validate file size (5MB max)
if (file.size > 5 * 1024 * 1024) {
alert('File size must be less than 5MB');
return;
}

// Create preview URL and show crop modal
const reader = new FileReader();
reader.onload = (e) => {
setTempImage(e.target.result);
};
reader.readAsDataURL(file);
};

const triggerFileInput = () => {
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/jpeg,image/png,image/webp';
input.onchange = handleFileSelect;
input.click();
};

const handleCropSave = (croppedImage) => {
onPhotoChange(croppedImage);
setTempImage(null);
};

return(
<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
<div style={{position:"relative",width:108,height:108}}>
<div style={{position:"absolute",inset:0,borderRadius:"50%",border:`3px solid ${color}`,background:photo?`url(${photo})`:`linear-gradient(135deg,${color}18,${color}35)`,backgroundSize:"cover",backgroundPosition:"center",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={triggerFileInput}>
{!photo && <span style={{fontFamily:"Fraunces,serif",fontSize:"2rem",fontWeight:900,color}}>{initials}</span>}
</div>
</div>

<div>
<div style={{fontSize:".65rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:T.text3,textAlign:"center",marginBottom:9}}>Profile Accent</div>
<div style={{display:"flex",gap:7,justifyContent:"center"}}>
{colors.map(c=><div key={c} className={`swatch${color===c?" sel":""}`} style={{background:c}} onClick={()=>onColor(c)}/>)}
</div>
</div>

<div className="drag-z" style={{width:"100%",maxWidth:220,cursor:"pointer"}} onClick={triggerFileInput}>
<div style={{fontSize:"1.4rem",marginBottom:5}}>📁</div>
<div style={{fontSize:".78rem",fontWeight:600,color:T.text2}}>Drop photo or <span style={{color:T.gold}}>browse</span></div>
<div style={{fontSize:".68rem",color:T.text3,marginTop:2}}>JPG · PNG · WEBP · Max 5MB</div>
</div>
</div>
);
}

/* ═══════════════════════════════════════════
MAIN COMPONENT
═══════════════════════════════════════════ */
export default function EditProfile() {
const navigate = useNavigate();
const { user, updateProfile } = useAuth();
const [tab,setTab]=useState(0);
const [toast,setToast]=useState(null);
const [saving,setSaving]=useState(false);
const [errors,setErrors]=useState({});

const [f,setF]=useState({
firstName:"",
lastName:"",
username:"",
tagline:"",
bio:"",
gender:"",
dob:"",
language:"en",
country:"",
phone:"",
whatsapp:"",
email:"",
altEmail:"",
address:"",
pincode:"",
linkedin:"",
github:"",
twitter:"",
portfolio:"",
institution:"",
degree:"B.Tech",
field:"",
gradYear:"",
cgpa:"",
org:"",
role:"",
exp:"0",
skills:[],
goals:[],
notif:{
email:true,
push:true,
weekly:true,
achievements:true,
reminders:false
},
priv:{
profilePublic:true,
showEmail:false,
showPhone:false,
showActivity:true,
allowMessages:true
},
});

// Load user data only on mount
const [loaded, setLoaded] = useState(false);
useEffect(() => {
if (user && !loaded) {
const nameParts = user.name?.split(' ') || ['', ''];
const dobFormatted = user.dob ? new Date(user.dob).toISOString().split('T')[0] : '';
setF(prev => ({
...prev,
firstName:   nameParts[0] || '',
lastName:    nameParts.slice(1).join(' ') || '',
username:    user.username    || '',
email:       user.email       || '',
phone:       user.phone       || '',
whatsapp:    user.whatsapp    || '',
altEmail:    user.altEmail    || '',
bio:         user.bio         || '',
dob:         dobFormatted,
tagline:     user.tagline     || '',
address:     user.address     || '',
pincode:     user.pincode     || '',
country:     user.country     || '',
gender:      user.gender      || '',
language:    user.language    || 'en',
linkedin:    user.linkedin    || '',
github:      user.github      || '',
twitter:     user.twitter     || '',
portfolio:   user.portfolio   || '',
institution: user.institution || '',
degree:      user.degree      || 'B.Tech',
field:       user.field       || '',
gradYear:    user.gradYear    || '',
cgpa:        user.cgpa        || '',
org:         user.org         || '',
role:        user.role        || '',
exp:         user.exp         || '0',
skills:      Array.isArray(user.skills) ? user.skills : [],
goals:       Array.isArray(user.goals)  ? user.goals  : [],
}));
setLoaded(true);
}
}, [user, loaded]);

const sf=(k,v)=>setF(x=>({...x,[k]:v}));
const sn=(p,k,v)=>setF(x=>({...x,[p]:{...x[p],[k]:v}}));

const pct=Math.min(100,Math.round(
(f.firstName?5:0)+
(f.bio?.length>20?10:0)+
(f.phone?8:0)+
(f.email?8:0)+
(f.institution?10:0)+
(f.org?10:0)+
(f.skills.length>5?12:f.skills.length*2)+
(f.goals.length>0?10:0)+
(f.linkedin?8:0)+
(f.github?8:0)+
(f.portfolio?7:0)+
4
));

const validate=()=>{
const e={};
if(!f.firstName.trim())e.firstName="Required";
if(!f.email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))e.email="Enter valid email";
if(f.bio?.length>280)e.bio="Max 280 characters";
setErrors(e);
// If errors exist, switch to the tab that has the error
if(e.firstName||e.bio) setTab(0);
else if(e.email) setTab(1);
return Object.keys(e).length===0;
};

const save = async () => {
if(!validate()){
setToast({msg:"Please fix the errors first",type:"error"});
return;
}

setSaving(true);
console.log('💾 Saving profile changes...');

// Prepare data for backend
const profileData = {
name:        `${f.firstName} ${f.lastName}`.trim(),
username:    f.username    || undefined,
bio:         f.bio         || undefined,
phone:       f.phone       || undefined,
whatsapp:    f.whatsapp    || undefined,
altEmail:    f.altEmail    || undefined,
avatar:      f.avatar      || undefined,
dob:         f.dob         || undefined,
tagline:     f.tagline     || undefined,
address:     f.address     || undefined,
pincode:     f.pincode     || undefined,
country:     f.country     || undefined,
gender:      f.gender      || undefined,
language:    f.language    || undefined,
linkedin:    f.linkedin    || undefined,
github:      f.github      || undefined,
twitter:     f.twitter     || undefined,
portfolio:   f.portfolio   || undefined,
institution: f.institution || undefined,
degree:      f.degree      || undefined,
field:       f.field       || undefined,
gradYear:    f.gradYear    || undefined,
cgpa:        f.cgpa        || undefined,
org:         f.org         || undefined,
role:        f.role        || undefined,
exp:         f.exp         || undefined,
skills:      f.skills,
goals:       f.goals,
};

const result = await updateProfile(profileData);
setSaving(false);

if (result.success) {
setToast({msg:"Profile updated successfully! 🎉",type:"success"});
setTimeout(() => navigate('/profile'), 1200);
} else {
setToast({msg: result.message || "Failed to update profile",type:"error"});
}
};

const TABS=["Personal","Contact","Academic","Skills","Goals","Privacy"];
const ICONS=["👤","📞","🎓","⚡","🎯","🔒"];

/* ─── TAB PANELS ─── */
const panels=[
/* ── 0: PERSONAL ── */
<div key="p" style={{display:"flex",flexDirection:"column",gap:20}}>
<SC title="Basic Information" icon="👤" sub="Your personal details">
<div style={{display:"flex",flexDirection:"column",gap:14}}>
<Grid cols={2}>
<div>
<Lbl req>First Name</Lbl>
<FInput icon="👤" value={f.firstName} onChange={e=>sf("firstName",e.target.value)} placeholder="First name" err={!!errors.firstName} ok={f.firstName.length>1}/>
{errors.firstName&&<div style={{fontSize:".7rem",color:T.red,marginTop:4}}>⚠ {errors.firstName}</div>}
</div>
<div>
<Lbl req>Last Name</Lbl>
<FInput value={f.lastName} onChange={e=>sf("lastName",e.target.value)} placeholder="Last name" ok={f.lastName.length>1}/>
</div>
</Grid>
<div>
<Lbl>Username</Lbl>
<FInput icon="@" value={f.username} onChange={e=>sf("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="your_handle"/>
<div style={{fontSize:".68rem",color:T.text3,marginTop:3}}>Lowercase letters, numbers and _ only</div>
</div>
<div>
<Lbl>Tagline</Lbl>
<FInput value={f.tagline} onChange={e=>sf("tagline",e.target.value)} placeholder="A short line about you…"/>
</div>
<Grid cols={2}>
<div>
<Lbl>Date of Birth</Lbl>
<FInput type="date" value={f.dob} onChange={e=>sf("dob",e.target.value)}/>
</div>
<div>
<Lbl>Gender</Lbl>
<FSelect value={f.gender} onChange={e=>sf("gender",e.target.value)}>
<option value="male">Male</option>
<option value="female">Female</option>
<option value="other">Prefer not to say</option>
</FSelect>
</div>
</Grid>
<div>
<Lbl max={280} cur={f.bio?.length||0}>Bio</Lbl>
<textarea className={`lv-inp${errors.bio?" err":""}`} value={f.bio} onChange={e=>sf("bio",e.target.value)} placeholder="Tell the world about yourself…" style={{minHeight:95,lineHeight:1.65,resize:"vertical"}}/>
{errors.bio&&<div style={{fontSize:".7rem",color:T.red,marginTop:4}}>⚠ {errors.bio}</div>}
</div>
</div>
</SC>
<SC title="Language & Region" icon="🌍" sub="Display preferences" delay={0.08}>
<Grid cols={2}>
<div>
<Lbl>Language</Lbl>
<FSelect value={f.language} onChange={e=>sf("language",e.target.value)}>
<option value="en">English</option>
<option value="hi">Hindi</option>
<option value="mr">Marathi</option>
</FSelect>
</div>
<div>
<Lbl>Country</Lbl>
<FInput icon="🌐" value={f.country} onChange={e=>sf("country",e.target.value)} placeholder="Country"/>
</div>
</Grid>
</SC>
</div>,

/* ── 1: CONTACT ── */
<div key="c" style={{display:"flex",flexDirection:"column",gap:20}}>
<SC title="Phone & Email" icon="📱" sub="Your communication details">
<div style={{display:"flex",flexDirection:"column",gap:14}}>
<Grid cols={2}>
<div>
<Lbl>Mobile</Lbl>
<FInput icon="📱" type="tel" value={f.phone} onChange={e=>sf("phone",e.target.value)} placeholder="+91 XXXXX XXXXX" ok={f.phone.length>8}/>
</div>
<div>
<Lbl>WhatsApp</Lbl>
<FInput icon="💬" type="tel" value={f.whatsapp} onChange={e=>sf("whatsapp",e.target.value)} placeholder="+91 XXXXX XXXXX"/>
</div>
</Grid>
<Grid cols={2}>
<div>
<Lbl req>Primary Email</Lbl>
<FInput icon="✉️" type="email" value={f.email} onChange={e=>sf("email",e.target.value)} placeholder="you@example.com" err={!!errors.email} ok={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)}/>
{errors.email&&<div style={{fontSize:".7rem",color:T.red,marginTop:4}}>⚠ {errors.email}</div>}
{/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)&&!errors.email&&<div style={{fontSize:".7rem",color:T.green,marginTop:4}}>✓ Valid email</div>}
</div>
<div>
<Lbl>Alternate Email</Lbl>
<FInput icon="📧" type="email" value={f.altEmail} onChange={e=>sf("altEmail",e.target.value)} placeholder="backup@email.com"/>
</div>
</Grid>
</div>
</SC>
<SC title="Address" icon="📍" sub="Your physical location" delay={0.08}>
<div style={{display:"flex",flexDirection:"column",gap:14}}>
<div>
<Lbl>Street / City</Lbl>
<FInput icon="🏠" value={f.address} onChange={e=>sf("address",e.target.value)} placeholder="City, State"/>
</div>
<Grid cols={2}>
<div>
<Lbl>Pincode</Lbl>
<FInput icon="📮" value={f.pincode} onChange={e=>sf("pincode",e.target.value)} placeholder="400053"/>
</div>
<div>
<Lbl>Country</Lbl>
<FInput icon="🌐" value={f.country} onChange={e=>sf("country",e.target.value)} placeholder="India"/>
</div>
</Grid>
</div>
</SC>
<SC title="Social & Web" icon="🔗" sub="Professional profiles & links" delay={0.16}>
<div style={{display:"flex",flexDirection:"column",gap:9}}>
{[
{ico:"in",bg:"rgba(59,130,246,.12)",key:"linkedin",ph:"linkedin.com/in/yourname",lbl:"LinkedIn"},
{ico:"⚫",bg:"rgba(255,255,255,.07)",key:"github",ph:"github.com/yourusername",lbl:"GitHub"},
{ico:"𝕏",bg:"rgba(255,255,255,.07)",key:"twitter",ph:"@yourhandle",lbl:"Twitter / X"},
{ico:"🌐",bg:"rgba(240,165,0,.1)",key:"portfolio",ph:"yoursite.dev",lbl:"Portfolio"},
].map(({ico,bg,key,ph,lbl})=>(
<div key={key} className="soc-row">
<div style={{width:30,height:30,borderRadius:8,background:bg,display:"grid",placeItems:"center",fontSize:".82rem",flexShrink:0,fontWeight:700}}>{ico}</div>
<div style={{flex:1}}>
<div style={{fontSize:".65rem",color:T.text3,letterSpacing:".07em",textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{lbl}</div>
<input className="lv-inp" value={f[key]} onChange={e=>sf(key,e.target.value)} placeholder={ph} style={{padding:"5px 0",border:"none",background:"none",borderRadius:0}}/>
</div>
</div>
))}
</div>
</SC>
</div>,

/* ── 2: ACADEMIC ── */
<div key="a" style={{display:"flex",flexDirection:"column",gap:20}}>
<SC title="Education" icon="🏛️" sub="Your academic background">
<div style={{display:"flex",flexDirection:"column",gap:14}}>
<Grid cols={2}>
<div>
<Lbl>Institution</Lbl>
<FInput icon="🏛️" value={f.institution} onChange={e=>sf("institution",e.target.value)} placeholder="e.g. IIT Bombay"/>
</div>
<div>
<Lbl>Degree</Lbl>
<FSelect value={f.degree} onChange={e=>sf("degree",e.target.value)}>
<option>B.Tech</option>
<option>B.Sc</option>
<option>BCA</option>
<option>M.Tech</option>
<option>MBA</option>
<option>Ph.D</option>
<option>Diploma</option>
<option>Other</option>
</FSelect>
</div>
</Grid>
<div>
<Lbl>Field of Study</Lbl>
<FInput icon="📚" value={f.field} onChange={e=>sf("field",e.target.value)} placeholder="Computer Science & Engineering"/>
</div>
<Grid cols={2}>
<div>
<Lbl>Graduation Year</Lbl>
<FSelect value={f.gradYear} onChange={e=>sf("gradYear",e.target.value)}>
{Array.from({length:10},(_,i)=>2024-i).map(y=><option key={y}>{y}</option>)}
<option value="pursuing">Currently Pursuing</option>
</FSelect>
</div>
<div>
<Lbl>CGPA / Marks</Lbl>
<FInput icon="🏆" value={f.cgpa} onChange={e=>sf("cgpa",e.target.value)} placeholder="8.7 CGPA or 87%"/>
</div>
</Grid>
</div>
</SC>
<SC title="Work Experience" icon="🏢" sub="Current organization" delay={0.08}>
<div style={{display:"flex",flexDirection:"column",gap:14}}>
<div>
<Lbl>Organization</Lbl>
<FInput icon="🏢" value={f.org} onChange={e=>sf("org",e.target.value)} placeholder="Company name"/>
</div>
<Grid cols={2}>
<div>
<Lbl>Job Title</Lbl>
<FInput icon="💼" value={f.role} onChange={e=>sf("role",e.target.value)} placeholder="Software Engineer"/>
</div>
<div>
<Lbl>Experience</Lbl>
<FSelect value={f.exp} onChange={e=>sf("exp",e.target.value)}>
<option value="0">Fresher / Student</option>
<option value="1-3">1–3 Years</option>
<option value="3-5">3–5 Years</option>
<option value="5+">5+ Years</option>
</FSelect>
</div>
</Grid>
</div>
</SC>
<SC title="Certificates" icon="🏅" sub="Your earned credentials" delay={0.16}>
<div style={{display:"flex",flexDirection:"column",gap:9}}>
{[
{ico:"🎨",name:"Figma to Code: Design System Mastery",date:"Dec 2024",grade:"Distinction"},
{ico:"📊",name:"Data Analytics with Python & Pandas",date:"Oct 2024",grade:"Merit"},
{ico:"🔒",name:"Web Security Fundamentals",date:"Aug 2024",grade:"Pass"},
].map((cert,i)=>(
<div key={i} className="cert-r">
<div style={{width:38,height:38,borderRadius:10,background:"rgba(240,165,0,.08)",border:"1px solid rgba(240,165,0,.18)",display:"grid",placeItems:"center",fontSize:15,flexShrink:0}}>{cert.ico}</div>
<div style={{flex:1}}>
<div style={{fontSize:".85rem",fontWeight:600}}>{cert.name}</div>
<div style={{fontSize:".72rem",color:T.text2,marginTop:2}}>{cert.date} · <span style={{color:T.green}}>✓ Verified</span> · {cert.grade}</div>
</div>
<button style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${T.bord}`,background:"transparent",color:T.text3,fontSize:".72rem",fontWeight:700,cursor: "pointer",transition:"all .2s"}}
onMouseEnter={e=>{e.currentTarget.style.borderColor=T.bordGold;e.currentTarget.style.color=T.gold;}}
onMouseLeave={e=>{e.currentTarget.style.borderColor=T.bord;e.currentTarget.style.color=T.text3;}}>Edit</button>
</div>
))}
<button style={{padding:11,borderRadius:12,border:"1px dashed rgba(255,255,255,.1)",background:"transparent",color:T.text3,fontSize:".82rem",fontWeight:600,cursor: "pointer",transition:"all .2s",marginTop:2,width:"100%",fontFamily:"Satoshi,sans-serif"}}
onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(240,165,0,.35)";e.currentTarget.style.color=T.gold;e.currentTarget.style.background="rgba(240,165,0,.04)";}}
onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.color=T.text3;e.currentTarget.style.background="transparent";}}>+ Add New Certificate</button>
</div>
</SC>
</div>,

/* ── 3: SKILLS ── */
<div key="sk" style={{display:"flex",flexDirection:"column",gap:20}}>
<SC title="Technical Skills" icon="⚡" sub="Showcase your expertise to the world">
<SkillMgr skills={f.skills} onChange={v=>sf("skills",v)}/>
<div style={{marginTop:16,padding:"11px 15px",borderRadius:11,background:"rgba(240,165,0,.05)",border:"1px solid rgba(240,165,0,.12)",fontSize:".78rem",color:T.text2}}>
💡 <strong style={{color:T.gold}}>Tip:</strong> Add 8+ skills to reach 80% profile completion
</div>
</SC>
<SC title="Skill Proficiency" icon="📊" sub="Rate your level in each skill" delay={0.1}>
<div style={{display:"flex",flexDirection:"column",gap:13}}>
{f.skills.slice(0,6).map((sk,i)=>{
const pv=60+i*7;
return(
<div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
<div style={{minWidth:110,fontSize:".82rem",fontWeight:600}}>{sk.l}</div>
<div style={{flex:1,height:6,background:"rgba(255,255,255,.05)",borderRadius:99,overflow:"hidden",cursor: "pointer"}}>
<div style={{height:"100%",width:`${pv}%`,background:G.gold,borderRadius:99,transition:"width 1s ease",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",animation:"shimmer 2.5s ease-in-out infinite"}}/>
</div>
</div>
<div style={{fontSize:".74rem",fontWeight:700,color:T.gold,minWidth:34,textAlign:"right"}}>{pv}%</div>
</div>
);
})}
</div>
</SC>
</div>,

/* ── 4: GOALS ── */
<div key="g" style={{display:"flex",flexDirection:"column",gap:20}}>
<SC title="Learning Goals" icon="🎯" sub="Track what you want to achieve">
<div style={{display:"flex",flexDirection:"column",gap:11}}>
{f.goals.map((g,i)=>(
<div key={i} style={{padding:15,borderRadius:14,background:"rgba(255,255,255,.02)",border:`1px solid ${T.bord}`,animation:`slideIn .5s ${i*.08}s both`,transition:"border-color .2s"}}
onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}
onMouseLeave={e=>e.currentTarget.style.borderColor=T.bord}>
<div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
<div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
<Grid cols={2} gap={10} mb={0}>
<div>
<Lbl>Goal Title</Lbl>
<FInput value={g.title} onChange={e=>{const gs=[...f.goals];gs[i].title=e.target.value;sf("goals",gs);}} placeholder="e.g. Master React"/>
</div>
<div>
<Lbl>Target Date</Lbl>
<FInput type="date" value={g.target} onChange={e=>{const gs=[...f.goals];gs[i].target=e.target.value;sf("goals",gs);}}/>
</div>
</Grid>
<div>
<Lbl extra={`${g.pct}%`}>Current Progress</Lbl>
<input type="range" min={0} max={100} value={g.pct}
onChange={e=>{const gs=[...f.goals];gs[i].pct=+e.target.value;sf("goals",gs);}}
style={{width:"100%",accentColor:T.gold,cursor: "pointer",marginBottom:5}}/>
<div style={{height:5,background:"rgba(255,255,255,.05)",borderRadius:99,overflow:"hidden"}}>
<div style={{height:"100%",width:`${g.pct}%`,background:G.gold,borderRadius:99,transition:"width .5s",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",animation:"shimmer 2s infinite"}}/>
</div>
</div>
</div>
</div>
<button onClick={()=>sf("goals",f.goals.filter((_,j)=>j!==i))}
style={{width:30,height:30,borderRadius:8,border:`1px solid ${T.bord}`,background:"transparent",color:T.text3,cursor: "pointer",fontSize:".78rem",flexShrink:0,marginTop:22,transition:"all .2s"}}
onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(239,68,68,.4)";e.currentTarget.style.color=T.red;e.currentTarget.style.background="rgba(239,68,68,.08)";}}
onMouseLeave={e=>{e.currentTarget.style.borderColor=T.bord;e.currentTarget.style.color=T.text3;e.currentTarget.style.background="transparent";}}>✕</button>
</div>
</div>
))}
<button onClick={()=>sf("goals",[...f.goals,{title:"",target:"",pct:0}])}
style={{padding:11,borderRadius:12,border:"1px dashed rgba(255,255,255,.1)",background:"transparent",color:T.text3,fontSize:".82rem",fontWeight:600,cursor: "pointer",transition:"all .2s",fontFamily:"Satoshi,sans-serif"}}
onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(240,165,0,.35)";e.currentTarget.style.color=T.gold;e.currentTarget.style.background="rgba(240,165,0,.04)";}}
onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.color=T.text3;e.currentTarget.style.background="transparent";}}>+ Add New Goal</button>
</div>
</SC>
<SC title="Study Preferences" icon="📅" sub="Customize your learning schedule" delay={0.1}>
<Grid cols={2}>
<div>
<Lbl>Preferred Time</Lbl>
<FSelect defaultValue="Evening (4–8 PM)">
<option>Morning (6–12 AM)</option>
<option>Evening (4–8 PM)</option>
<option>Night (8 PM–12 AM)</option>
<option>Flexible</option>
</FSelect>
</div>
<div>
<Lbl>Daily Goal</Lbl>
<FSelect defaultValue="2 hours">
<option>30 minutes</option>
<option>1 hour</option>
<option>2 hours</option>
<option>3+ hours</option>
</FSelect>
</div>
</Grid>
<div style={{marginTop:14}}>
<Lbl>Interests</Lbl>
<FInput placeholder="e.g. Web Dev, AI/ML, Cloud, DevOps…"/>
</div>
</SC>
</div>,

/* ── 5: PRIVACY ── */
<div key="pr" style={{display:"flex",flexDirection:"column",gap:20}}>
<SC title="Profile Visibility" icon="👁️" sub="Control who sees your information">
<div style={{display:"flex",flexDirection:"column",gap:9}}>
{[
{k:"profilePublic",l:"Make profile public",d:"Anyone can view your profile"},
{k:"showEmail",l:"Show email address",d:"Display email publicly"},
{k:"showPhone",l:"Show phone number",d:"Display mobile number publicly"},
{k:"showActivity",l:"Show learning activity",d:"Others can see your heatmap & streak"},
{k:"allowMessages",l:"Allow direct messages",d:"Let learners message you"},
].map(({k,l,d})=>(
<TRow key={k} label={l} desc={d} on={f.priv[k]} toggle={()=>sn("priv",k,!f.priv[k])}/>
))}
</div>
</SC>
<SC title="Notifications" icon="🔔" sub="Choose what alerts you receive" delay={0.08}>
<div style={{display:"flex",flexDirection:"column",gap:9}}>
{[
{k:"email",l:"Email notifications",d:"Course updates, deadlines, announcements"},
{k:"push",l:"Push notifications",d:"Real-time browser alerts"},
{k:"weekly",l:"Weekly digest",d:"Summary of your weekly progress"},
{k:"achievements",l:"Achievement alerts",d:"Get notified when you earn badges"},
{k:"reminders",l:"Study reminders",d:"Daily reminder to maintain streak"},
].map(({k,l,d})=>(
<TRow key={k} label={l} desc={d} on={f.notif[k]} toggle={()=>sn("notif",k,!f.notif[k])}/>
))}
</div>
</SC>
<SC title="Danger Zone" icon="⚠️" sub="Irreversible account actions" delay={0.16}>
<div style={{display:"flex",flexDirection:"column",gap:9}}>
{[
{l:"Export My Data",d:"Download all your data as JSON",btn:"Export",col:T.gold},
{l:"Reset Progress",d:"Reset all XP and course progress",btn:"Reset",col:T.orange},
{l:"Delete Account",d:"Permanently delete account and all data",btn:"Delete",col:T.red},
].map(({l,d,btn,col})=>(
<div key={l} className="tog-row">
<div>
<div style={{fontSize:".87rem",fontWeight:600}}>{l}</div>
<div style={{fontSize:".72rem",color:T.text3,marginTop:2}}>{d}</div>
</div>
<button style={{padding:"7px 16px",borderRadius:9,border:`1px solid ${col}44`,background:`${col}0d`,color:col,fontSize:".78rem",fontWeight:700,cursor: "pointer",fontFamily:"Satoshi,sans-serif",transition:"all .2s"}}
onMouseEnter={e=>{e.currentTarget.style.background=`${col}1a`;e.currentTarget.style.borderColor=`${col}88`;}}
onMouseLeave={e=>{e.currentTarget.style.background=`${col}0d`;e.currentTarget.style.borderColor=`${col}44`;}}>{btn}</button>
</div>
))}
</div>
</SC>
</div>,
];

return (
<div style={{background:T.bg,color:T.text,fontFamily:"Satoshi,sans-serif",minHeight:"100vh",width:"100%",margin:0,padding:0,overflowX:"hidden"}}>
<Cursor/>

{/* BG glow */}
<div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse 75% 55% at 20% 20%,rgba(240,165,0,.032) 0%,transparent 60%),radial-gradient(ellipse 55% 45% at 80% 80%,rgba(0,212,170,.022) 0%,transparent 60%)"}}/>
<div style={{position:"fixed",inset:"-50%",zIndex:1,pointerEvents:"none",opacity:.02,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,animation:"noise 8s steps(10) infinite"}}/>

{/* NAV */}
<nav style={{position:"sticky",top:0,zIndex:500,height:62,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:"rgba(2,6,15,.78)",backdropFilter:"blur(28px) saturate(1.8)",borderBottom:`1px solid ${T.bord}`,animation:"fadeUp .6s ease both"}}>
<div style={{display:"flex",alignItems:"center",gap:14}}>
<div style={{display:"flex",alignItems:"center",gap:9}}>
<div style={{width:32,height:32,borderRadius:9,background:G.gold,display:"grid",placeItems:"center",fontSize:".88rem",boxShadow:"0 0 16px rgba(240,165,0,.35)"}}>🎓</div>
<span style={{fontFamily:"Fraunces,serif",fontSize:"1.05rem",fontWeight:800,letterSpacing:"-.04em"}}>Learn<b style={{color:T.gold}}>Verse</b></span>
</div>
<div style={{width:1,height:20,background:T.bord}}/>
<div style={{display:"flex",alignItems:"center",gap:7,fontSize:".82rem",color:T.text2}}>
<span style={{cursor: "pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.text} onMouseLeave={e=>e.target.style.color=T.text2}>Profile</span>
<span style={{color:T.text3}}>›</span>
<span style={{color:T.gold,fontWeight:700}}>Edit Profile</span>
</div>
</div>
<div style={{display:"flex",gap:10,alignItems:"center"}}>
<button className="cn-btn" onClick={() => navigate('/profile')}>← Back</button>
<button className="sv-btn" onClick={save} disabled={saving}>
<span className="shine"/>
{saving?<span style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:13,height:13,border:"2px solid #030810",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>Saving…</span>:"💾 Save Changes"}
</button>
</div>
</nav>

{/* BODY */}
<div style={{maxWidth:1040,margin:"0 auto",padding:"34px 20px 100px",position:"relative",zIndex:2}}>
{/* Header */}
<div style={{marginBottom:28,animation:"fadeUp .6s .05s both"}}>
<div style={{fontFamily:"Fraunces,serif",fontSize:"2rem",fontWeight:900,letterSpacing:"-.06em",marginBottom:5}}>Edit <em style={{fontStyle:"italic",color:T.gold}}>Profile</em></div>
<div style={{fontSize:".87rem",color:T.text2}}>Update your personal, academic, and professional information</div>
</div>

{/* Completion */}
<div style={{marginBottom:24}}>
<CompletionRing pct={pct}/>
</div>

{/* Steps */}
<ProgressSteps steps={TABS} cur={tab}/>

{/* Tabs */}
<div style={{display:"flex",gap:5,marginBottom:24,background:T.card,padding:"6px",borderRadius:14,border:`1px solid ${T.bord}`,flexWrap:"wrap",animation:"fadeUp .6s .22s both"}}>
{TABS.map((t,i)=>(
<button key={t} className={`tab-pill${tab===i?" on":""}`} onClick={()=>setTab(i)} style={{display:"flex",alignItems:"center",gap:5}}>
<span>{ICONS[i]}</span>{t}
</button>
))}
</div>

{/* Panel */}
<div key={tab} style={{animation:"fadeUp .4s ease both"}}>
{panels[tab]}
</div>

{/* Bottom Save */}
<div style={{display:"flex",gap:12,justifyContent:"flex-end",alignItems:"center",marginTop:30,paddingTop:20,borderTop:`1px solid ${T.bord}`,animation:"fadeUp .6s .3s both"}}>
<div style={{flex:1,fontSize:".77rem",color:T.text3,display:"flex",alignItems:"center",gap:6}}>
<span style={{color:T.green,fontSize:".95rem"}}>🔒</span>Your data is encrypted and stored securely.
</div>
<button className="cn-btn" onClick={() => navigate('/profile')}>Discard</button>
<button className="sv-btn" onClick={save} disabled={saving}>
<span className="shine"/>
{saving?<span style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:13,height:13,border:"2px solid #030810",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>Saving…</span>:"💾 Save Profile"}
</button>
</div>
</div>

{toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
</div>
);
}

