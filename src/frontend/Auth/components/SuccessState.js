import React from 'react';
import { useNavigate } from 'react-router-dom';

const msgs = {
  login:    { ico: '🎉', title: 'Welcome back!',     sub: 'Redirecting you to your dashboard…',          btn: 'Go to Dashboard →' },
  register: { ico: '🚀', title: 'Account created!',  sub: 'Your LearnVerse account is ready. Start learning today!', btn: 'Start Learning →' },
  forgot:   { ico: '✅', title: 'Password reset!',   sub: 'Your password has been updated successfully.', btn: 'Sign In →' },
};

function SuccessState({ type, onContinue }) {
  const navigate = useNavigate();
  const m = msgs[type] || msgs.login;

  const handleClick = () => {
    if (type === 'login' || type === 'register') {
      navigate('/');
    } else {
      onContinue && onContinue();
    }
  };

  return (
    <div className="success-state show">
      <div className="success-circle">{m.ico}</div>
      <h2 className="success-title">{m.title}</h2>
      <p className="success-sub">{m.sub}</p>
      <button className="submit-btn" onClick={handleClick}>
        <span className="btn-text">{m.btn}</span>
      </button>
    </div>
  );
}

export default SuccessState;
