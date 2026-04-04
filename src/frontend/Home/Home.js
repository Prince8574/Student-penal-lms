import React, { useEffect, useRef } from 'react';
import './Home.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Features from './components/Features';
import Courses from './components/Courses';
import Testimonials from './components/Testimonials';
import CTAStrip from './components/CTAStrip';
import Footer from './components/Footer';
import { initBentoCardGlow, initBackgroundCanvas, initHeroCanvas, initGSAPAnimations } from './utils/animations';

function Home() {
  const bgCanvasRef = useRef(null);
  const heroCanvasRef = useRef(null);

  useEffect(() => {
    let rafId;
    const init = () => {
      initBentoCardGlow();
      initBackgroundCanvas(bgCanvasRef.current);
      // Hero canvas needs parent to be sized first
      setTimeout(() => {
        initHeroCanvas(heroCanvasRef.current);
        setTimeout(() => initGSAPAnimations(), 150);
      }, 50);
    };
    rafId = requestAnimationFrame(() => requestAnimationFrame(init));
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="home-page home-container">
      <div className="noise"></div>
      <canvas id="bg-canvas" ref={bgCanvasRef}></canvas>

      <Header />
      <Hero heroCanvasRef={heroCanvasRef} />
      <Marquee />
      <Features />
      <Courses />
      <Testimonials />
      <CTAStrip />
      <Footer />
    </div>
  );
}

export default Home;
