import React from 'react';
import { useNavigate } from 'react-router-dom';

function CTAStrip() {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="cta-strip" id="cta-strip">
      <div className="cta-strip-left">
        <h2>Your next chapter starts<br/><em>today</em></h2>
        <p>Join 50,000+ professionals building in-demand skills with LearnVerse. First 14 days are completely free.</p>
      </div>
      
      <div className="cta-strip-right">
        <button className="hero-btn" onClick={handleCreateAccount}>Create Free Account →</button>
        <span className="cta-note">No credit card required · Cancel anytime</span>
      </div>
    </div>
  );
}

export default CTAStrip;
