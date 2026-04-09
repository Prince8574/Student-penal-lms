import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentAPI } from '../../services/api';
import './Profile.css';
import { useBgScene } from './utils/threeBackground';
import { useCoverScene } from './utils/threeCover';
import { T, G } from './utils/designTokens';
import Cursor from './components/Cursor';
import AnimNumber from './components/AnimNumber';
import ProgressBar from './components/ProgressBar';
import Card from './components/Card';
import StatBox from './components/StatBox';
import SectionHeader from './components/SectionHeader';
import PomodoroTimer from './components/PomodoroTimer';
import HeatMap from './components/HeatMap';
import Avatar from './components/Avatar';
import AvatarCropModal from './components/AvatarCropModal';
import API_BASE from '../../config/api';

/* ---------------------------------------
MAIN COMPONENT
--------------------------------------- */
export default function LearnVerseProfile() {
const navigate = useNavigate();
const location = useLocation();
const { user, refreshUser } = useAuth();
const bgRef = useRef(null);
const coverRef = useRef(null);

useBgScene(bgRef);
useCoverScene(coverRef);

const pathToNav = { '/': 'Dashboard', '/explore': 'Courses', '/profile': 'Profile', '/settings': 'Settings' };
const activeNav = pathToNav[location.pathname] || 'Profile';
const [xpVisible, setXpVisible] = useState(false);
const xpRef = useRef(null);
const [enrollments, setEnrollments] = useState([]);
const [showCropModal, setShowCropModal] = useState(false);
const [avatarUrl, setAvatarUrl] = useState(null);
const [certCount, setCertCount] = useState(0);
const [assignmentCerts, setAssignmentCerts] = useState([]);

// Load avatar from DB on mount
useEffect(function() {
  if (user?.avatar && user.avatar !== 'default-avatar.png') {
    setAvatarUrl(user.avatar);
  }
}, [user?.avatar]);

function handleAvatarSave(blob) {
  var fd = new FormData();
  fd.append('avatar', blob, 'avatar.jpg');
  // Show preview immediately
  var previewUrl = URL.createObjectURL(blob);
  setAvatarUrl(previewUrl);
  setShowCropModal(false);
  fetch(`${API_BASE}/api/users/avatar`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    body: fd,
  })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.success && res.url) {
        setAvatarUrl(res.url);
        if (refreshUser) refreshUser();
      }
    })
    .catch(function() {});
}

useEffect(() => {
  enrollmentAPI.getMyEnrollments()
    .then(r => setEnrollments(r.data?.data || []))
    .catch(() => {});
}, []);

// Fetch real certificate count from grades
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;
  fetch(`${API_BASE}/api/student/assignments/grades`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const certs = (res.data || []).filter(g => g.certificateId);
        setCertCount(certs.length);
        setAssignmentCerts(certs);
      }
    })
    .catch(() => {});
}, []);

// Use logged-in user data
const displayName = user?.name || 'Student';
const displayUsername = user?.username || '';
const displayEmail = user?.email || '';
const displayBio = user?.bio || 'Welcome to LearnVerse! Update your bio in settings.';
const displayPhone = user?.phone || '';

// Member since date from createdAt
const memberSince = user?.createdAt
  ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  : null;

// Real stats from enrollments data
const enrolledCount = enrollments.length || user?.enrolledCourses?.length || 0;
const completedCount = enrollments.filter(e => e.status === 'completed' || e.progress === 100).length || user?.completedCourses?.length || 0;

// Build chips from real user data only
const dynamicChips = [
  user?.isVerified && { l: '✓ Verified', s: 'teal' },
  user?.role === 'student' && { l: '🎓 Student', s: 'gold' },
].filter(Boolean);

// Build details only from real user data (skip empty fields)
const dobDisplay = user?.dob
  ? (() => {
      const d = new Date(user.dob);
      const age = Math.floor((Date.now() - d) / (365.25 * 24 * 60 * 60 * 1000));
      return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${age} yrs)`;
    })()
  : null;

const dynamicUserDetails = [
  displayPhone && { ico: '📱', val: displayPhone, lab: 'Mobile' },
  displayEmail && { ico: '📧', val: displayEmail, lab: 'Email' },
  dobDisplay && { ico: '🎂', val: dobDisplay, lab: 'Date of Birth' },
  user?.address && { ico: '📍', val: user.address, lab: 'Location' },
  user?.institution && { ico: '🏛️', val: user.institution, lab: user.degree ? `${user.degree}${user.field ? ' · ' + user.field : ''}` : 'Institution' },
  user?.org && { ico: '🏢', val: user.org, lab: user.role ? user.role : 'Organization' },
].filter(Boolean);

// Social links from real user data
const dynamicSocialLinks = [
  user?.linkedin  && { ico: 'in', bg: 'rgba(59,130,246,.12)', label: user.linkedin,  href: user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}` },
  user?.github    && { ico: '⚫', bg: 'rgba(255,255,255,.07)', label: user.github,    href: user.github.startsWith('http') ? user.github : `https://${user.github}` },
  user?.twitter   && { ico: '𝕏',  bg: 'rgba(255,255,255,.07)', label: user.twitter,   href: user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter.replace('@','')}` },
  user?.portfolio && { ico: '🌐', bg: 'rgba(240,165,0,.1)',    label: user.portfolio, href: user.portfolio.startsWith('http') ? user.portfolio : `https://${user.portfolio}` },
].filter(Boolean);

useEffect(() => {
const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setXpVisible(true), 200); obs.disconnect(); } }, { threshold: 0.3 });
if (xpRef.current) obs.observe(xpRef.current);
return () => obs.disconnect();
}, []);

return (
<div className="profile-page" style={{ background: T.bg, color: T.text, fontFamily: 'inherit', minHeight: '100vh', width: '100%', margin: 0, padding: 0, overflowX: 'hidden', position: 'relative' }}>
<Cursor />
{showCropModal && <AvatarCropModal onClose={function(){setShowCropModal(false);}} onSave={handleAvatarSave}/>}

{/* BG Canvas */}
<canvas ref={bgRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh' }} />

{/* Noise */}
<div style={{ position: 'fixed', inset: '-50%', zIndex: 1, pointerEvents: 'none', opacity: .022, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`, animation: 'noise 8s steps(10) infinite' }} />

{/* NAV */}
<nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: 'rgba(2,6,15,.75)', backdropFilter: 'blur(28px) saturate(1.8)', borderBottom: `1px solid ${T.bord}` }}>

  {/* Logo */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: G.gold, display: 'grid', placeItems: 'center', fontSize: '1.1rem' }}>🎓</div>
    <span style={{ fontSize: '1.08rem', fontWeight: 800, letterSpacing: '-.03em', color: T.text }}>Learn<b style={{ color: T.gold }}>Verse</b></span>
  </div>

  {/* Nav links */}
  <div style={{ display: 'flex', gap: 2 }}>
    {[
      { label: 'Dashboard', path: '/' },
      { label: 'Courses',   path: '/explore' },
      { label: 'Profile',   path: '/profile' },
      { label: 'Settings',  path: '/settings' },
    ].map(({ label, path }) => (
      <button key={label}
        onClick={() => navigate(path)}
        className="nav-link"
        style={{ padding: '6px 14px', borderRadius: 8, fontSize: '.78rem', fontWeight: 600, background: activeNav === label ? 'rgba(255,255,255,.07)' : 'none', color: activeNav === label ? T.gold : T.text2, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color .2s,background .2s' }}>
        {label}
      </button>
    ))}
  </div>

  {/* Right actions */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <button
      style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.bord}`, background: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '1rem', color: T.text2 }}>
      🔔
      <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: T.red, border: `2px solid ${T.bg}` }} />
    </button>
    <button
      style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: G.gold, color: '#030810', fontFamily: 'inherit', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', transition: 'transform .2s,box-shadow .2s' }}
      onClick={() => navigate('/edit-profile')}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,165,0,.45)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
      ✏️ Edit Profile
    </button>
  </div>
</nav>

{/* COVER */}
<div style={{ position: 'relative', height: 290, overflow: 'hidden', marginTop: 0 }}>
<canvas ref={coverRef} className="cover-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 0%,rgba(2,6,15,.35) 50%,rgba(2,6,15,.98) 100%)' }} />
<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(240,165,0,.04) 0%,transparent 40%,transparent 60%,rgba(0,212,170,.03) 100%)' }} />
<button style={{ position: 'absolute', top: 16, right: 18, padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,.14)', background: 'rgba(2,6,15,.55)', color: T.text, fontFamily: 'inherit', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(12px)' }}>🖼️ Change Cover</button>
</div>

{/* PROFILE HEAD */}
<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', top: -60, marginBottom: -60, gap: 20, flexWrap: 'wrap' }}>
<div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
{/* Avatar */}
<div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
<div onClick={function(){setShowCropModal(true);}}
  style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${T.gold}`, overflow: 'hidden', background: avatarUrl || user?.avatar ? 'transparent' : 'linear-gradient(145deg,#0c1e3a,#190c30)', zIndex: 2, cursor: 'pointer' }}>
  {avatarUrl || user?.avatar
    ? <img src={avatarUrl || user.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
    : <Avatar />
  }
  {/* Hover overlay */}
  <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity .2s', borderRadius:'50%' }}
    onMouseEnter={function(e){e.currentTarget.style.opacity='1';}}
    onMouseLeave={function(e){e.currentTarget.style.opacity='0';}}>
    <span style={{ fontSize:'1.4rem' }}>📷</span>
  </div>
</div>
<div style={{ position: 'absolute', bottom: 8, right: 6, zIndex: 4, width: 20, height: 20, borderRadius: '50%', background: T.green, border: `3px solid ${T.bg}` }} />
<div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '3px 11px', borderRadius: 20, background: T.gold, color: '#030810', fontSize: '.6rem', fontWeight: 900, letterSpacing: '.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 5 }}>🎓 {user?.role?.toUpperCase() || 'STUDENT'}</div>
</div>

{/* Name + chips */}
<div style={{ paddingBottom: 10 }}>
<div className="ff-serif" style={{ fontSize: '2.3rem', fontWeight: 900, letterSpacing: '-.06em', lineHeight: 1, marginBottom: 4 }}>
{displayName.split(' ')[0]} <em style={{ fontStyle: 'italic', color: T.gold }}>{displayName.split(' ').slice(1).join(' ') || ''}</em>
</div>
<div style={{ fontSize: '.85rem', color: T.text3, marginBottom: 4, fontFamily: 'inherit' }}>
{displayUsername && `@${displayUsername}`}
</div>
{user?.tagline && (
  <div style={{ fontSize: '.82rem', color: T.text2, marginBottom: 8, fontStyle: 'italic' }}>{user.tagline}</div>
)}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
{dynamicChips.map((c, i) => {
const cs = { gold: { bg: 'rgba(240,165,0,.1)', col: T.gold, bord: 'rgba(240,165,0,.22)' }, teal: { bg: 'rgba(0,212,170,.08)', col: T.teal, bord: 'rgba(0,212,170,.18)' }, muted: { bg: 'rgba(255,255,255,.05)', col: T.text2, bord: T.bord }, purple: { bg: 'rgba(167,139,250,.07)', col: T.purple, bord: 'rgba(167,139,250,.2)' } };
const s = cs[c.s];
return <span key={i} className="chip" style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 11px', borderRadius: 20, fontSize: '.71rem', fontWeight: 700, background: s.bg, color: s.col, border: `1px solid ${s.bord}`, cursor: 'pointer', transition: 'transform .2s' }}>{c.l}</span>;
})}
</div>
</div>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingBottom: 10 }}>
<button style={{ padding: '10px 22px', borderRadius: 11, border: `1.5px solid rgba(240,165,0,.3)`, background: 'rgba(240,165,0,.07)', color: T.gold, fontFamily: 'inherit', fontSize: '.81rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all .2s' }}
onClick={() => navigate('/edit-profile')}
onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,165,0,.15)'; e.currentTarget.style.borderColor = 'rgba(240,165,0,.45)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,165,0,.07)'; e.currentTarget.style.borderColor = 'rgba(240,165,0,.3)'; e.currentTarget.style.transform = 'none'; }}
>✏️ Edit Profile</button>

{['🔗', '📤', '⋯'].map(ic => (
<button key={ic} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${T.bord}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 15, transition: 'all .2s' }}
onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,165,0,.25)'; e.currentTarget.style.background = 'rgba(240,165,0,.07)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
onMouseLeave={e => { e.currentTarget.style.borderColor = T.bord; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}
>{ic}</button>
))}
</div>
</div>
</div>

{/* MAIN BODY */}
<div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 20px 100px', position: 'relative', zIndex: 2 }}>
{/* STATS STRIP */}
<div style={{ background: T.card, border: `1px solid ${T.bord}`, borderRadius: 18, overflow: 'hidden', backdropFilter: 'blur(20px)', marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
<StatBox num={enrolledCount} label="Courses Enrolled" color={T.gold} barColor={T.gold} delay={200} />
<StatBox num={completedCount} label="Completed" color={T.teal} barColor={T.teal} delay={350} />
<StatBox num={certCount} label="Certificates" color={T.blue} barColor={T.blue} delay={500} />
</div>

{/* GRID */}
<div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
{/* -- SIDEBAR -- */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
{/* Bio */}
<Card anim="slideLeft" delay={0}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
<div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
<div style={{ width: 6, height: 6, borderRadius: '50%', background: G.gold, boxShadow: `0 0 8px ${T.gold}` }} />
<div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em' }}>About</div>
</div>
<button style={{ fontSize: '.71rem', fontWeight: 700, color: T.text3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Edit ?</button>
</div>
<p style={{ fontSize: '.84rem', color: T.text2, lineHeight: 1.75 }}>
{displayBio}
</p>
</Card>

{/* Details */}
<Card anim="slideLeft" delay={80}>
<div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
<div style={{ width: 6, height: 6, borderRadius: '50%', background: G.gold, boxShadow: `0 0 8px ${T.gold}` }} />
<div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em' }}>Details</div>
</div>
<div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
{dynamicUserDetails.map(({ ico, val, lab, labCol }, i) => (
<div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontSize: '.82rem' }}>
<div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,.04)', border: `1px solid ${T.bord}`, display: 'grid', placeItems: 'center', fontSize: 12, flexShrink: 0, transition: 'all .2s' }}>{ico}</div>
<div>
<div style={{ color: T.text, fontWeight: 600 }}>{val}</div>
<div style={{ color: labCol || T.text3, fontSize: '.7rem', marginTop: 2 }}>{lab}</div>
</div>
</div>
))}
</div>
</Card>

{/* Skills - only show if user has skills data */}
{user?.skills?.length > 0 && (
<Card anim="slideLeft" delay={160}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
<div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
<div style={{ width: 6, height: 6, borderRadius: '50%', background: G.gold, boxShadow: `0 0 8px ${T.gold}` }} />
<div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em' }}>Skills</div>
</div>
</div>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
{user.skills.map((skill, i) => {
const label = typeof skill === 'string' ? skill : skill.l;
return (
<span key={i} className="sk-item" style={{ padding: '5px 12px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(240,165,0,.08)', color: T.gold, border: '1px solid rgba(240,165,0,.2)', transition: 'transform .2s,box-shadow .2s' }}>{label}</span>
);
})}
</div>
</Card>
)}

<PomodoroTimer />

{/* Connect - only show if user has any social links */}
{dynamicSocialLinks.length > 0 && (
<Card anim="slideLeft" delay={400}>
<div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
<div style={{ width: 6, height: 6, borderRadius: '50%', background: G.gold, boxShadow: `0 0 8px ${T.gold}` }} />
<div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em' }}>Connect</div>
</div>
<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
{dynamicSocialLinks.map(({ ico, bg, label, href }, i) => (
<a key={i} href={href} target="_blank" rel="noopener noreferrer" className="soc-item" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px', borderRadius: 12, background: 'rgba(255,255,255,.02)', border: `1px solid ${T.bord}`, textDecoration: 'none', fontSize: '.8rem', color: T.text2, cursor: 'pointer', transition: 'all .22s' }}>
<div style={{ width: 28, height: 28, borderRadius: 8, background: bg, display: 'grid', placeItems: 'center', fontSize: 12, flexShrink: 0, fontWeight: 700 }}>{ico}</div>
<span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
</a>
))}
</div>
</Card>
)}
</div>

{/* -- MAIN COLUMN -- */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
{/* Learning Progress */}
{enrollments.length > 0 && (() => {
  const avgPct = Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length);
  return (
  <Card delay={0}>
  <div ref={xpRef} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
  <div>
  <div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em' }}>Learning Progress</div>
  <div style={{ fontSize: '.74rem', color: T.text2, marginTop: 3 }}>{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</div>
  </div>
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', color: T.text2, marginBottom: 6 }}>
  <span>Overall Progress</span>
  <span style={{ color: T.text, fontWeight: 700 }}>{avgPct}%</span>
  </div>
  <div style={{ height: 11, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,.04)' }}>
  <div style={{ height: '100%', width: xpVisible ? `${avgPct}%` : '0%', background: 'linear-gradient(90deg,#f0a500,#ff9d45,#ff7a30)', borderRadius: 99, transition: 'width 2.2s cubic-bezier(.4,0,.2,1)', boxShadow: '0 0 14px rgba(240,165,0,.4)', position: 'relative', overflow: 'hidden' }}>
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)', animation: 'shimmer 2.5s ease-in-out infinite' }} />
  </div>
  <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '.58rem', fontWeight: 900, color: 'rgba(255,255,255,.9)', letterSpacing: '.04em' }}>{avgPct}%</div>
  </div>
  </Card>
  );
})()}

{/* Enrollment Banner */}
{memberSince && (
<div style={{ padding: 22, borderRadius: 20, background: 'linear-gradient(135deg,rgba(0,212,170,.07),rgba(59,130,246,.05))', border: '1px solid rgba(0,212,170,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, animation: 'fadeUp .7s .5s both' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
<div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(0,212,170,.1)', border: '1px solid rgba(0,212,170,.2)', display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>🎓</div>
<div>
<div className="ff-serif" style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.04em', marginBottom: 4 }}>Member since {memberSince}</div>
{user?.isVerified && <div style={{ color: T.green, fontSize: '.72rem', marginTop: 3 }}>✓ Identity Verified</div>}
</div>
</div>
<div style={{ display: 'flex', gap: 24 }}>
<div style={{ textAlign: 'center' }}>
<div className="ff-serif" style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-.06em', lineHeight: 1, color: T.gold }}>
<AnimNumber target={enrolledCount} />
</div>
<div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: T.text3 }}>Courses</div>
</div>
<div style={{ textAlign: 'center' }}>
<div className="ff-serif" style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-.06em', lineHeight: 1, color: T.teal }}>
<AnimNumber target={completedCount} />
</div>
<div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: T.text3 }}>Completed</div>
</div>
</div>
</div>
)}

{/* Active Courses */}
<Card delay={100}>
<SectionHeader title="Active Courses" />
<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
{enrollments.length === 0 ? (
  <div style={{ textAlign: 'center', padding: '24px 0', color: T.text3, fontSize: '.84rem' }}>No courses enrolled yet. <span style={{ color: T.gold, cursor: 'pointer' }} onClick={() => navigate('/explore')}>Explore courses →</span></div>
) : enrollments.map((e, i) => {
  const pct = e.progress || 0;
  const name = e.course?.title || 'Course';
  return (
  <div key={e.enrollmentId || i} className="crow-item" onClick={() => navigate(`/learn/${e.course?._id}`)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,.02)', border: `1px solid ${T.bord}`, cursor: 'pointer', transition: 'all .22s', animation: `slideRight .6s ${.2 + i * .1}s both` }}>
  <div style={{ width: 50, height: 50, borderRadius: 13, background: 'linear-gradient(135deg,#071838,#14083a)', display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>📚</div>
  <div style={{ flex: 1, minWidth: 0 }}>
  <div style={{ fontWeight: 700, fontSize: '.87rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 7 }}>{name}</div>
  <ProgressBar pct={pct} gradient={G.gold} />
  <div style={{ fontSize: '.69rem', color: T.text3, marginTop: 5 }}>{e.status === 'completed' ? 'Completed' : 'In Progress'}</div>
  </div>
  <div style={{ flexShrink: 0, textAlign: 'right', paddingLeft: 8 }}>
  <div className="ff-serif" style={{ fontSize: '1.15rem', fontWeight: 900, lineHeight: 1, color: T.gold }}>{pct}%</div>
  </div>
  </div>
  );
})}
</div>
</Card>



{/* Completed Courses as Certificates */}
{(enrollments.filter(e => e.status === 'completed').length > 0 || assignmentCerts.length > 0) && (
<Card delay={400}>
<SectionHeader title="Certificates Earned" />
<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
  {/* Course completion certificates */}
  {enrollments.filter(e => e.status === 'completed').map((e, i) => (
  <div key={i} className="certrow" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,.02)', border: `1px solid ${T.bord}`, cursor: 'pointer', transition: 'all .22s' }}>
  <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(240,165,0,.08)', border: '1px solid rgba(240,165,0,.18)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>🎓</div>
  <div style={{ flex: 1, minWidth: 0 }}>
  <div style={{ fontWeight: 700, fontSize: '.87rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course?.title}</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '.72rem', color: T.text2 }}>
  <span>LearnVerse</span><span>·</span>
  <span style={{ color: T.green, fontWeight: 700 }}>✓ Course Completed</span>
  {e.completedAt && <><span>·</span><span>{new Date(e.completedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span></>}
  </div>
  </div>
  </div>
  ))}
  {/* Assignment certificates */}
  {assignmentCerts.map((g, i) => {
    const pct = Math.round((g.score / (g.maxScore || 100)) * 100);
    return (
    <div key={'cert-' + i} className="certrow" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,.02)', border: `1px solid ${T.bord}`, transition: 'all .22s' }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(124,47,255,.08)', border: '1px solid rgba(124,47,255,.18)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>🏆</div>
    <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ fontWeight: 700, fontSize: '.87rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.courseName || g.assignmentTitle}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '.72rem', color: T.text2 }}>
    <span style={{ color: '#a78bfa', fontWeight: 700 }}>Assignment</span><span>·</span>
    <span style={{ color: T.green, fontWeight: 700 }}>Score: {pct}%</span>
    {g.gradedAt && <><span>·</span><span>{new Date(g.gradedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span></>}
    </div>
    </div>
    </div>
    );
  })}
</div>
</Card>
)}
</div>
</div>
</div>
</div>
);
}


