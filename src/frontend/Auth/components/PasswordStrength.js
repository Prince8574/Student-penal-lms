import React from 'react';

function PasswordStrength({ strength }) {
  if (!strength) return null;

  const { score, label, color } = strength;

  return (
    <div className="pw-strength show">
      <div className="pw-bars">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`pw-bar ${bar <= score ? (score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong') : ''}`}
          ></div>
        ))}
      </div>
      <div className="pw-label" style={{ color }}>
        {label}
      </div>
    </div>
  );
}

export default PasswordStrength;
