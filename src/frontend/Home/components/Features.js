import React from 'react';

const features = [
  {
    type: 'big',
    icon: '🧠',
    tag: '✦ AI-Powered',
    title: 'Adaptive Learning Engine',
    desc: 'Our AI studies your patterns, identifies gaps, and rebuilds your curriculum on the fly — no two learners get the same path.',
    className: 'bc-big'
  },
  {
    type: 'stat',
    number: 240,
    label: 'Expert Instructors',
    className: 'bc-stat'
  },
  {
    icon: '🎯',
    iconBg: 'gold-bg',
    title: 'Live Practice Labs',
    desc: 'Browser-based sandboxes for every course. Code, design, and experiment without leaving the platform.',
    className: 'bc-a'
  },
  {
    icon: '📊',
    iconBg: 'teal-bg',
    title: 'Deep Analytics',
    desc: 'Track skill velocity, retention, and progress in real-time with beautiful dashboards.',
    className: 'bc-b'
  },
  {
    icon: '🏅',
    iconBg: 'blue-bg',
    title: 'Verified Certs',
    desc: 'Blockchain-backed certificates trusted by 500+ hiring partners.',
    className: 'bc-c'
  },
  {
    icon: '🤝',
    iconBg: 'red-bg',
    title: 'Study Cohorts',
    desc: 'Join live cohorts, study together, and grow with peers at your exact level.',
    className: 'bc-d'
  },
  {
    icon: '⚡',
    iconBg: 'gold-bg',
    title: 'Spaced Repetition',
    desc: 'Memory science built-in. Smart review cards surface content at the perfect moment to maximize retention.',
    className: 'bc-e'
  },
  {
    icon: '📱',
    iconBg: 'teal-bg',
    title: 'Offline Mode',
    desc: 'Download any lesson and learn without internet — flights, commutes, anywhere.',
    className: 'bc-f'
  }
];

function Features() {
  return (
    <section className="bento-section" id="features">
      <p className="sec-eyebrow" id="feat-eye">What Makes Us Different</p>
      <h2 className="sec-h2" id="feat-h2">Built for how <em>you</em> actually learn</h2>
      
      <div className="bento">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature }) {
  if (feature.type === 'big') {
    return (
      <div className={`bento-card ${feature.className}`}>
        <div className="bc-big-visual">{feature.icon}</div>
        <div className="bc-tag">{feature.tag}</div>
        <h3 className="bc-title">{feature.title}</h3>
        <p className="bc-desc">{feature.desc}</p>
      </div>
    );
  }
  
  if (feature.type === 'stat') {
    return (
      <div className={`bento-card ${feature.className}`}>
        <div className="num" id="cnt1">0</div>
        <div className="lbl">{feature.label}</div>
      </div>
    );
  }
  
  return (
    <div className={`bento-card ${feature.className}`}>
      <div className={`bc-icon ${feature.iconBg}`}>{feature.icon}</div>
      <h3 className="bc-title">{feature.title}</h3>
      <p className="bc-desc">{feature.desc}</p>
    </div>
  );
}

export default Features;
