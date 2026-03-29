import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Auth.css';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { initAuthBackground } from './utils/authAnimations';

function Auth() {
  const location = useLocation();
  const bgCanvasRef = useRef(null);
  
  // Set initial tab based on URL
  const getInitialTab = React.useCallback(() => {
    if (location.pathname === '/register') return 'register';
    return 'login'; // default to login for /auth and /login
  }, [location.pathname]);
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

  useEffect(() => {
    // Update tab when URL changes
    setActiveTab(getInitialTab());
  }, [location.pathname, getInitialTab]);

  useEffect(() => {
    initAuthBackground(bgCanvasRef.current);
    
    // GSAP entrance animations
    if (window.gsap) {
      window.gsap.to('#auth-card', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      window.gsap.to('#fi1', { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 });
      window.gsap.to('#fi2', { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.65 });
      window.gsap.to('#fi3', { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.8 });
    }
  }, []);

  return (
    <div className="auth-page">
      <div className="noise"></div>
      <canvas id="bg-canvas" ref={bgCanvasRef}></canvas>

      <div className="page">
        <LeftPanel />
        <RightPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default Auth;
