import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // Debug logging
  console.log('🎨 Header render:', { isAuthenticated, user });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header id="site-header">
      <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
        <div className="logo-mark">🎓</div>
        <span className="logo-text">Learn<span>Verse</span></span>
      </a>
      
      <nav>
        <a href="#" className="nav-link active" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/explore'); }}>Explore</a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/course/1'); }}>Courses</a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); }}>Paths</a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); }}>Community</a>
        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); }}>Pricing</a>
      </nav>

      <div className="header-right">
        {!isAuthenticated ? (
          <>
            <button className="btn-login" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="btn-cta" onClick={() => navigate('/register')}>
              Start Free →
            </button>
          </>
        ) : (
          <>
            <div 
              className="avatar-btn" 
              id="av-btn"
              onMouseEnter={() => setShowAvatarMenu(true)}
              onMouseLeave={() => setShowAvatarMenu(false)}
            >
            <div className="av-ring"></div>
            <div className="av-img">
              <AvatarSVG />
            </div>
            <div className="av-online"></div>
            
            {showAvatarMenu && (
              <div className="av-menu">
                <div className="av-head">
                  <div className="av-head-img">
                    <AvatarSVGSmall />
                  </div>
                  <div>
                    <div className="av-head-name">{user?.name || 'User'}</div>
                    <div className="av-head-badge">⭐ Pro Learner</div>
                  </div>
                </div>
                <div className="av-item" onClick={() => navigate('/profile')}><span>👤</span> View Profile</div>
                <div className="av-item" onClick={() => navigate('/explore')}><span>📚</span> My Courses</div>
                <div className="av-item" onClick={() => navigate('/assignments')}><span>🏆</span> Achievements</div>
                <div className="av-item"><span>📊</span> Progress</div>
                <div className="av-item"><span>👥</span> Community</div>
                <div className="av-sep"></div>
                <div className="av-item" onClick={() => navigate('/settings')}><span>⚙️</span> Settings</div>
                <div className="av-item" onClick={handleLogout} style={{color:'#f87171'}}><span>🚪</span> Sign Out</div>
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </header>
  );
}

const AvatarSVG = () => (
  <svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" width="42" height="42">
    <defs>
      <linearGradient id="bg1" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0d2040"/>
        <stop offset="100%" stopColor="#1e0d38"/>
      </linearGradient>
      <linearGradient id="skin1" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f9c8a0"/>
        <stop offset="100%" stopColor="#e8a87a"/>
      </linearGradient>
      <clipPath id="cc1">
        <circle cx="21" cy="21" r="21"/>
      </clipPath>
    </defs>
    <circle cx="21" cy="21" r="21" fill="url(#bg1)"/>
    <g clipPath="url(#cc1)">
      <path d="M0 36 Q10 30 21 31 Q32 30 42 36 L42 50 L0 50Z" fill="#f0a500" opacity=".9"/>
      <ellipse cx="21" cy="20.5" rx="9.5" ry="10.5" fill="url(#skin1)"/>
      <ellipse cx="17" cy="20.5" rx="2.2" ry="2.5" fill="#1a0d30"/>
      <ellipse cx="25" cy="20.5" rx="2.2" ry="2.5" fill="#1a0d30"/>
      <path d="M17.5 25 Q21 28 24.5 25" stroke="#c47e5a" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

const AvatarSVGSmall = () => (
  <svg viewBox="0 0 36 36" width="36" height="36">
    <defs>
      <linearGradient id="bg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0d2040"/>
        <stop offset="100%" stopColor="#1e0d38"/>
      </linearGradient>
      <linearGradient id="skin2" x1="0" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f9c8a0"/>
        <stop offset="100%" stopColor="#e8a87a"/>
      </linearGradient>
      <clipPath id="cc2">
        <circle cx="18" cy="18" r="18"/>
      </clipPath>
    </defs>
    <circle cx="18" cy="18" r="18" fill="url(#bg2)"/>
    <g clipPath="url(#cc2)">
      <path d="M0 30 Q9 26 18 27 Q27 26 36 30 L36 44 L0 44Z" fill="#f0a500" opacity=".9"/>
      <ellipse cx="18" cy="17" rx="8" ry="9" fill="url(#skin2)"/>
      <ellipse cx="14.5" cy="17.2" rx="1.9" ry="2.1" fill="#1a0d30"/>
      <ellipse cx="21.5" cy="17.2" rx="1.9" ry="2.1" fill="#1a0d30"/>
      <path d="M15 21.5 Q18 24 21 21.5" stroke="#c47e5a" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

export default Header;
