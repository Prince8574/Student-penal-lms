import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <a href="#" className="logo">
          <div className="logo-mark" style={{width:'28px', height:'28px', borderRadius:'8px', fontSize:'13px'}}>
            🎓
          </div>
          <span className="logo-text" style={{fontSize:'1.05rem'}}>
            Learn<span>Verse</span>
          </span>
        </a>
        <div className="footer-copy">© 2026 LearnVerse Technologies</div>
      </div>
      
      <div className="footer-links">
        <a href="#">Courses</a>
        <a href="#">Pricing</a>
        <a href="#">Blog</a>
        <a href="#">Careers</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
      
      <div className="footer-right">
        <button className="social-btn">𝕏</button>
        <button className="social-btn">in</button>
        <button className="social-btn">▶</button>
        <button className="social-btn">📷</button>
      </div>
    </footer>
  );
}

export default Footer;
