import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '🧠',
    color: 'gold',
    title: 'AI-Personalized Paths',
    desc: 'Curriculum that adapts to your pace and goals'
  },
  {
    icon: '🎯',
    color: 'teal',
    title: 'Live Practice Labs',
    desc: 'Browser-based sandboxes, no setup needed'
  },
  {
    icon: '🏅',
    color: 'blue',
    title: 'Verified Certificates',
    desc: 'Trusted by 500+ hiring companies worldwide'
  }
];

function LeftPanel() {
  const navigate = useNavigate();
  
  return (
    <div className="left-panel">
      <button 
        onClick={() => navigate('/')} 
        className="back-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div className="back-arrow">←</div>
        Back to Home
      </button>

      <div className="left-content">
        <button 
          onClick={() => navigate('/')} 
          className="left-logo"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div className="logo-mark">🎓</div>
          <span className="logo-text">Learn<span>Verse</span></span>
        </button>

        <h2 className="left-headline" id="lh">
          Start your<br />
          <em>learning</em><br />
          <span className="outline">journey.</span>
        </h2>

        <p className="left-sub" id="ls">
          Join 50,000+ professionals who are building in-demand skills and landing dream careers with LearnVerse.
        </p>

        <div className="feat-list">
          {features.map((feat, index) => (
            <div className="feat-item" id={`fi${index + 1}`} key={index}>
              <div className={`feat-check ${feat.color}`}>{feat.icon}</div>
              <div className="feat-text">
                <strong>{feat.title}</strong>
                {feat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="left-bottom">
        <div className="lb-avatars">
          <div className="lb-av">👩‍💻</div>
          <div className="lb-av">👨‍🎨</div>
          <div className="lb-av">👩‍🔬</div>
          <div className="lb-av">👨‍💼</div>
        </div>
        <div className="lb-text">
          <strong>50,000+</strong> learners already enrolled
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;
