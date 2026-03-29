import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function Hero({ heroCanvasRef }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <section style={{position:'relative', zIndex:2}}>
      <div className="hero" id="hero">
        <div className="hero-left">
          <div className="hero-tag" id="h-tag">
            <div className="tag-dot">✦</div>
            {isAuthenticated ? `Welcome back, ${firstName} 👋` : 'Reimagine Learning'}
          </div>
          
          <h1 className="hero-h1" id="h-title">
            {isAuthenticated ? (
              <>
                <span>Continue</span><br/>
                <em>Your</em> Learning<br/>
                <span className="glow-word">Journey</span>
              </>
            ) : (
              <>
                <span>Learn the</span><br/>
                <em>Skills</em> That<br/>
                <span className="glow-word">Matter Most</span>
              </>
            )}
          </h1>
          
          <p className="hero-desc" id="h-desc">
            LearnVerse blends AI-powered personalization with world-class instructors — creating the most adaptive learning experience ever built.
          </p>
          
          <div className="hero-actions" id="h-actions">
            {isAuthenticated ? (
              <button className="hero-btn" onClick={() => navigate('/explore')}>Explore Courses →</button>
            ) : (
              <button className="hero-btn" onClick={() => navigate('/register')}>Start Learning Free →</button>
            )}
            <button className="hero-btn2">
              <div className="play-circle">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                  <path d="M0 0L8 5L0 10V0Z" fill="white"/>
                </svg>
              </div>
              See How It Works
            </button>
          </div>
          
          <div className="hero-trust" id="h-trust">
            <div className="trust-avatars">
              <div className="trust-av">👩‍💻</div>
              <div className="trust-av">👨‍🎨</div>
              <div className="trust-av">👩‍🔬</div>
              <div className="trust-av">👨‍💼</div>
              <div className="trust-av">+</div>
            </div>
            <div className="trust-text">
              <span className="trust-stars">★★★★★</span>
              <strong>50,000+ learners</strong> trust LearnVerse worldwide
            </div>
          </div>
        </div>
        
        <div className="hero-right" id="h-right">
          <canvas id="hero-canvas" ref={heroCanvasRef}></canvas>
          <div className="hero-canvas-overlay"></div>
          
          <div className="float-card fc1" id="fc1">
            <div className="fc-icon">📈</div>
            <div className="fc-label">Completion Rate</div>
            <div className="fc-val green">94.7%</div>
          </div>
          
          <div className="float-card fc2" id="fc2">
            <div className="fc-icon">🏅</div>
            <div className="fc-label">Avg. Salary Boost</div>
            <div className="fc-val gold">+₹4.2L</div>
          </div>
          
          <div className="float-card fc3" id="fc3">
            <div className="fc-icon">⚡</div>
            <div className="fc-label">Active Right Now</div>
            <div className="fc-val">3,241</div>
          </div>
        </div>
      </div>
      
      <div className="scroll-ind" id="scroll-ind">
        <div className="scroll-ind-line"></div>
        <div className="scroll-ind-text">Scroll</div>
      </div>
    </section>
  );
}

export default Hero;
