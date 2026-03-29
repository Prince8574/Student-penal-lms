import React from 'react';

const testimonialsData = [
  {
    quote: 'LearnVerse\'s adaptive paths helped me go from zero to landing a ₹14LPA frontend role in 7 months. The live labs were the real game-changer — I was shipping code from day one.',
    avatar: '🧑‍💻',
    name: 'Sahil Verma',
    role: 'Frontend Dev @ Razorpay'
  },
  {
    quote: 'Switching careers from finance to data science felt impossible until LearnVerse. The cohort model kept me accountable. Cracked ₹18LPA at Flipkart in 9 months!',
    avatar: '👩‍💼',
    name: 'Meera Krishnan',
    role: 'Data Analyst @ Flipkart'
  },
  {
    quote: 'The UI/UX course was a masterpiece. Real project briefs, Figma labs, and 1:1 mentor feedback made it feel like a bootcamp — at 10% of the price.',
    avatar: '🧑‍🎨',
    name: 'Rohan Dubey',
    role: 'Product Designer @ Swiggy'
  }
];

function Testimonials() {
  return (
    <section className="testi-section" id="testimonials">
      <p className="sec-eyebrow" id="t-eye">Student Stories</p>
      <h2 className="sec-h2" id="t-h2">Real results from <em>real learners</em></h2>
      
      <div className="testi-grid">
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="testi-card">
      <div className="testi-quote">"</div>
      <p className="testi-text">{testimonial.quote}</p>
      
      <div className="testi-user">
        <div className="testi-av">{testimonial.avatar}</div>
        <div>
          <div className="testi-name">{testimonial.name}</div>
          <div className="testi-role">{testimonial.role}</div>
          <div className="testi-stars">★★★★★</div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
