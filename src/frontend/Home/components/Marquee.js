import React from 'react';

const topics = [
  'React & Next.js',
  'Machine Learning',
  'UI/UX Design',
  'Data Science',
  'DevOps & Cloud',
  'Blockchain',
  'Product Management',
  'iOS & Android Dev',
  'Cybersecurity'
];

function Marquee() {
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {[...topics, ...topics].map((topic, index) => (
          <div className="marquee-item" key={index}>
            <div className="marquee-dot"></div>
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
