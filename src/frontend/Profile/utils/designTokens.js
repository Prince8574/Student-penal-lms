/* ═══════════════════════════════════════
DESIGN TOKENS - SHARED ACROSS PROFILE COMPONENTS
═══════════════════════════════════════ */

// Color palette
export const T = {
  // Background colors
  bg: "#02060f", 
  s1: "#07101f", 
  s2: "#0b1526", 
  card: "rgba(11,20,42,0.88)",
  
  // Brand colors
  gold: "#f0a500", 
  gold2: "#fcd34d", 
  orange: "#ff7a30",
  teal: "#00d4aa", 
  blue: "#3b82f6", 
  purple: "#a78bfa",
  pink: "#f472b6", 
  green: "#4ade80", 
  red: "#ef4444",
  
  // Text colors
  text: "#f0f6ff", 
  text2: "#8899b8", 
  text3: "#3d4f6e",
  
  // Border colors
  bord: "rgba(255,255,255,0.06)", 
  bordGold: "rgba(240,165,0,0.22)",
};

// Gradient definitions
export const G = {
  gold: "linear-gradient(135deg,#f0a500,#ff7a30)",
  teal: "linear-gradient(135deg,#00d4aa,#3b82f6)",
  green: "linear-gradient(135deg,#4ade80,#00d4aa)",
  purple: "linear-gradient(135deg,#a78bfa,#f472b6)",
  pink: "linear-gradient(135deg,#f472b6,#ff7a30)",
  blue: "linear-gradient(135deg,#3b82f6,#a78bfa)",
  orange: "linear-gradient(135deg,#ff7a30,#f472b6)",
};

// Typography
export const typography = {
  fontFamily: {
    primary: 'Satoshi, sans-serif',
    serif: 'Fraunces, serif'
  },
  fontSize: {
    xs: '.68rem',
    sm: '.78rem',
    base: '.87rem',
    lg: '1rem',
    xl: '1.15rem',
    '2xl': '1.6rem',
    '3xl': '2.3rem'
  },
  fontWeight: {
    normal: 400,
    medium: 600,
    bold: 700,
    black: 900
  },
  letterSpacing: {
    tight: '-.06em',
    normal: '0',
    wide: '.07em'
  }
};

// Spacing scale
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '48px'
};

// Border radius
export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '50%'
};

// Shadows
export const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.1)',
  md: '0 4px 18px rgba(0,0,0,0.15)',
  lg: '0 8px 28px rgba(0,0,0,0.2)',
  glow: '0 0 20px rgba(240,165,0,0.35)',
  glowStrong: '0 0 30px rgba(240,165,0,0.5)'
};

// Animation durations
export const animations = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',
  verySlow: '0.8s'
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Z-index scale
export const zIndex = {
  base: 0,
  overlay: 10,
  dropdown: 100,
  modal: 500,
  tooltip: 1000
};

// Skill color mapping
export const skillColors = {
  gold: { 
    bg: 'rgba(240,165,0,.1)', 
    color: T.gold, 
    border: 'rgba(240,165,0,.2)' 
  },
  teal: { 
    bg: 'rgba(0,212,170,.08)', 
    color: T.teal, 
    border: 'rgba(0,212,170,.16)' 
  },
  blue: { 
    bg: 'rgba(59,130,246,.08)', 
    color: T.blue, 
    border: 'rgba(59,130,246,.16)' 
  },
  purple: { 
    bg: 'rgba(167,139,250,.08)', 
    color: T.purple, 
    border: 'rgba(167,139,250,.16)' 
  },
  pink: { 
    bg: 'rgba(244,114,182,.08)', 
    color: T.pink, 
    border: 'rgba(244,114,182,.16)' 
  },
};

// Utility functions
export const utils = {
  // Convert hex to rgba
  hexToRgba: (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Get contrasting text color
  getContrastColor: (bgColor) => {
    // Simple contrast logic - can be enhanced
    return bgColor.includes('dark') || bgColor.includes('#0') ? T.text : T.bg;
  },
  
  // Generate random color from palette
  getRandomColor: () => {
    const colors = [T.gold, T.teal, T.blue, T.purple, T.pink, T.green, T.orange];
    return colors[Math.floor(Math.random() * colors.length)];
  }
};

export default { T, G, typography, spacing, borderRadius, shadows, animations, breakpoints, zIndex, skillColors, utils };