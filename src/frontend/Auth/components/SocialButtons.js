import React from 'react';

const socialProviders = [
  { name: 'Google', icon: '🌐' },
  { name: 'GitHub', icon: '⚫' },
  { name: 'LinkedIn', icon: '🔷' }
];

function SocialButtons() {
  const handleSocialAuth = (provider) => {
    console.log(`Authenticating with ${provider}`);
    // Add your social auth logic here
  };

  return (
    <div className="social-login">
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          className="social-auth-btn"
          onClick={() => handleSocialAuth(provider.name)}
        >
          <span className="soc-icon">{provider.icon}</span>
          {provider.name}
        </button>
      ))}
    </div>
  );
}

export default SocialButtons;
