export default function Avatar() {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0c1e3a"/>
          <stop offset="100%" stopColor="#1e0c32"/>
        </linearGradient>
        <linearGradient id="sk1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9c8a0"/>
          <stop offset="100%" stopColor="#e89470"/>
        </linearGradient>
        <radialGradient id="blush" cx="50%" cy="60%" r="30%">
          <stop offset="0%" stopColor="#e87a6a" stopOpacity=".28"/>
          <stop offset="100%" stopColor="#e87a6a" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0a500"/>
          <stop offset="100%" stopColor="#ff7a30"/>
        </linearGradient>
        <clipPath id="cc">
          <circle cx="60" cy="60" r="60"/>
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#bg1)"/>
      <ellipse cx="60" cy="118" rx="55" ry="24" fill="rgba(240,165,0,.14)"/>
      <g clipPath="url(#cc)">
        <path d="M18 110 Q30 90 60 88 Q90 90 102 110 L120 140 L0 140Z" fill="url(#shirt)" opacity=".92"/>
        <path d="M42 88 Q60 80 78 88 L74 118 Q60 126 46 118Z" fill="#ff9940" opacity=".85"/>
        <path d="M50 88 Q60 95 70 88 L68 100 Q60 108 52 100Z" fill="rgba(0,0,0,.2)"/>
        <rect x="52" y="74" width="16" height="20" rx="8" fill="url(#sk1)"/>
        <ellipse cx="60" cy="56" rx="27" ry="29" fill="url(#sk1)"/>
        <ellipse cx="42" cy="60" rx="9" ry="6" fill="url(#blush)"/>
        <ellipse cx="78" cy="60" rx="9" ry="6" fill="url(#blush)"/>
        <path d="M33 44 Q33 24 60 22 Q87 24 87 44 Q83 32 60 33 Q37 32 33 44Z" fill="#1a0d2e"/>
        <ellipse cx="60" cy="25" rx="24" ry="10" fill="#1a0d2e"/>
        <path d="M33 38 Q29 44 31 56L35 50Q34 42 33 38Z" fill="#1a0d2e"/>
        <path d="M87 38 Q91 44 89 56L85 50Q86 42 87 38Z" fill="#1a0d2e"/>
        <ellipse cx="33" cy="58" rx="5" ry="7" fill="url(#sk1)"/>
        <ellipse cx="87" cy="58" rx="5" ry="7" fill="url(#sk1)"/>
        <path d="M41 48 Q49 44 55 47" stroke="#1a0d2e" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M65 47 Q71 44 79 48" stroke="#1a0d2e" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="48" cy="57" rx="7" ry="8" fill="#1a0d2e"/>
        <ellipse cx="72" cy="57" rx="7" ry="8" fill="#1a0d2e"/>
        <rect x="38" y="50" width="20" height="14" rx="7" fill="none" stroke="#f0a500" strokeWidth="2" opacity=".85"/>
        <rect x="62" y="50" width="20" height="14" rx="7" fill="none" stroke="#f0a500" strokeWidth="2" opacity=".85"/>
        <line x1="58" y1="57" x2="62" y2="57" stroke="#f0a500" strokeWidth="2" opacity=".85"/>
        <circle cx="50" cy="55" r="2.4" fill="white" opacity=".9"/>
        <circle cx="74" cy="55" r="2.4" fill="white" opacity=".9"/>
        <path d="M57 64 Q60 70 63 64" stroke="#d4906a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M50 72 Q60 81 70 72" stroke="#b8764a" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M52 72.5 Q60 80 68 72.5" fill="white" opacity=".5"/>
      </g>
    </svg>
  );
}