import { T, G } from './designTokens';

/* ═══════════════════════════════════════
PROFILE DATA - SEPARATED FOR BETTER ORGANIZATION
═══════════════════════════════════════ */

// Skills data
export const skills = [
  { l: 'React', c: 'gold' }, 
  { l: 'Node.js', c: 'teal' }, 
  { l: 'TypeScript', c: 'blue' },
  { l: 'Python', c: 'purple' }, 
  { l: 'Figma', c: 'pink' }, 
  { l: 'AWS', c: 'gold' },
  { l: 'Docker', c: 'teal' }, 
  { l: 'PostgreSQL', c: 'blue' }, 
  { l: 'GraphQL', c: 'purple' },
  { l: 'TensorFlow', c: 'pink' }, 
  { l: 'Next.js', c: 'gold' }, 
  { l: 'PyTorch', c: 'teal' },
  { l: 'Redis', c: 'blue' }, 
  { l: 'Kubernetes', c: 'purple' },
];

// Courses data
export const courses = [
  { 
    icon: '💻', 
    name: 'Full Stack with React, Node & AWS', 
    ch: '18 of 24', 
    rem: '~3h', 
    pct: 78, 
    col: T.gold, 
    g: G.gold, 
    bg: 'linear-gradient(135deg,#071838,#14083a)' 
  },
  { 
    icon: '🤖', 
    name: 'Deep Learning with PyTorch & HuggingFace', 
    ch: '9 of 20', 
    rem: '~8h', 
    pct: 45, 
    col: T.teal, 
    g: G.teal, 
    bg: 'linear-gradient(135deg,#072219,#081628)' 
  },
  { 
    icon: '🎨', 
    name: 'Figma to Code: Design System Mastery', 
    ch: 'All complete ✓', 
    rem: 'Cert earned', 
    pct: 100, 
    col: T.green, 
    g: G.green, 
    bg: 'linear-gradient(135deg,#280c17,#160728)' 
  },
  { 
    icon: '☁️', 
    name: 'AWS Solutions Architect Associate', 
    ch: '4 of 18', 
    rem: '~14h', 
    pct: 22, 
    col: T.orange, 
    g: G.pink, 
    bg: 'linear-gradient(135deg,#18180a,#091524)' 
  },
];

// Badges data
export const badges = [
  { ico: '🔥', nm: '7-Day Streak', earn: true }, 
  { ico: '⚡', nm: 'Speed Learner', earn: true },
  { ico: '🏅', nm: 'First Cert', earn: true }, 
  { ico: '🧠', nm: '100% Quiz', earn: true },
  { ico: '👥', nm: 'Community', earn: true }, 
  { ico: '💡', nm: 'Problem Solver', earn: true },
  { ico: '🚀', nm: 'Rocket Launch', earn: false }, 
  { ico: '🏆', nm: 'Master', earn: false },
];

// Goals data
export const goals = [
  { 
    ico: '🎯', 
    title: 'Become Full Stack Ready', 
    pct: 78, 
    g: G.gold, 
    note: 'Finish React + Node · 3 modules left', 
    target: 'Mar 30, 2025' 
  },
  { 
    ico: '🤖', 
    title: 'Master Machine Learning', 
    pct: 45, 
    g: G.teal, 
    note: 'Complete PyTorch Fundamentals · 11 left', 
    target: 'May 15, 2025' 
  },
  { 
    ico: '☁️', 
    title: 'Get AWS Certified', 
    pct: 22, 
    g: G.purple, 
    note: 'AWS Solutions Architect · Exam booked', 
    target: 'Jun 10, 2025' 
  },
];

// Activity feed data
export const feed = [
  { 
    ico: '✅', 
    bg: 'rgba(240,165,0,.1)', 
    title: 'Completed Chapter 18 — "Advanced React Patterns"', 
    meta: 'Full Stack with React · +120 XP', 
    time: '2h ago' 
  },
  { 
    ico: '🏅', 
    bg: 'rgba(74,222,128,.1)', 
    title: 'Earned "Speed Learner" badge', 
    meta: 'Completed 3 chapters in under 2 hours', 
    time: '5h ago' 
  },
  { 
    ico: '📝', 
    bg: 'rgba(167,139,250,.1)', 
    title: 'Scored 94% on "React Hooks Quiz"', 
    meta: 'Top 8% globally · +80 XP', 
    time: 'Yesterday' 
  },
  { 
    ico: '💬', 
    bg: 'rgba(0,212,170,.1)', 
    title: 'Posted answer in Community Forum', 
    meta: '42 upvotes · "Async/Await vs Promises"', 
    time: '2 days ago' 
  },
  { 
    ico: '🎓', 
    bg: 'rgba(240,165,0,.1)', 
    title: 'Enrolled in "AWS Solutions Architect" course', 
    meta: '18 chapters · ~22 hours total', 
    time: '3 days ago' 
  },
];

// Certificates data
export const certs = [
  { 
    ico: '🎨', 
    name: 'Figma to Code: Design System Mastery', 
    grade: 'Distinction', 
    gradeCol: T.gold, 
    date: 'Dec 2024' 
  },
  { 
    ico: '📊', 
    name: 'Data Analytics with Python & Pandas', 
    grade: 'Merit', 
    gradeCol: T.blue, 
    date: 'Oct 2024' 
  },
  { 
    ico: '🔒', 
    name: 'Web Security Fundamentals', 
    grade: 'Pass', 
    gradeCol: T.teal, 
    date: 'Aug 2024' 
  },
];

// Milestones data
export const milestones = [
  { ico: '🌱', lbl: 'Seedling', done: true }, 
  { ico: '📗', lbl: 'Student', done: true },
  { ico: '⚡', lbl: 'Builder', done: true }, 
  { ico: '🏗️', lbl: 'Architect', done: true, now: true },
  { ico: '🚀', lbl: 'Expert', done: false }, 
  { ico: '🏆', lbl: 'Master', done: false },
];

// User profile chips data
export const profileChips = [
  { l: '🔥 Pro Learner', s: 'gold' }, 
  { l: '💼 TCS · Mumbai', s: 'teal' }, 
  { l: '🎓 IIT Bombay', s: 'muted' }, 
  { l: '🇮🇳 India', s: 'muted' }, 
  { l: '🏅 Dean\'s List', s: 'purple' }
];

// User details data
export const userDetails = [
  { ico: '📱', val: '+91 98765 43210', lab: 'Mobile' },
  { ico: '✉️', val: 'rahul.s@tcs.com', lab: 'Work Email' },
  { ico: '📍', val: 'Mumbai, Maharashtra', lab: 'Location · 400053' },
  { ico: '🏢', val: 'Tata Consultancy Services', lab: 'Organization' },
  { ico: '🎓', val: 'B.Tech CSE — IIT Bombay', lab: 'Education · 8.7 CGPA' },
  { ico: '🎂', val: '15 August 2000 (24 yrs)', lab: 'Date of Birth' },
  { ico: '🪪', val: 'XXXX XXXX 4321', lab: '✓ Aadhaar Verified', labCol: T.green },
  { ico: '🌐', val: 'rahulsharma.dev', lab: 'Portfolio Website' },
];

// Social links data
export const socialLinks = [
  { ico: '𝕏', bg: 'rgba(255,255,255,.07)', label: '@rahulsharma_dev', meta: '4.2k followers' },
  { ico: 'in', bg: 'rgba(59,130,246,.12)', label: 'linkedin.com/in/rahul', meta: 'Open to work', metaCol: T.green },
  { ico: '⚫', bg: 'rgba(255,255,255,.07)', label: 'github.com/rahuls', meta: '★ 312' },
  { ico: '🌐', bg: 'rgba(240,165,0,.1)', label: 'rahulsharma.dev', meta: 'Portfolio' },
];

// Academic info data
export const academicInfo = [
  { ico: '🏛️', label: 'Institution', val: 'IIT Bombay', sub: 'B.Tech CSE · 2018–2022 · 8.7 CGPA' },
  { ico: '🎓', label: 'Qualification', val: 'B.Tech / B.E.', sub: 'Computer Science · Graduated 2022' },
  { ico: '🏢', label: 'Organization', val: 'Tata Consultancy Services', sub: 'Software Engineer · 2022–Present' },
  { ico: '🌍', label: 'Nationality', val: 'Indian 🇮🇳', sub: 'English, Hindi · Mumbai, MH 400053' },
];

// Stats data
export const statsData = [
  { num: 421, lbl: 'Days Active', col: T.teal }, 
  { num: 12, lbl: 'Courses', col: T.gold }, 
  { num: 3, lbl: 'Certs', col: T.gold }
];

export default {
  skills,
  courses,
  badges,
  goals,
  feed,
  certs,
  milestones,
  profileChips,
  userDetails,
  socialLinks,
  academicInfo,
  statsData
};