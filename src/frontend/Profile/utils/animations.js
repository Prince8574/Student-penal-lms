/* ═══════════════════════════════════════
GSAP ANIMATION UTILITIES
═══════════════════════════════════════ */

// Note: This file contains CSS-based animations that can be enhanced with GSAP
// Currently using CSS animations for better performance and React compatibility

export const animationClasses = {
  // Fade animations
  fadeUp: 'fadeUp',
  fadeIn: 'fadeIn',
  fadeLeft: 'fadeLeft',
  fadeRight: 'fadeRight',
  
  // Slide animations
  slideLeft: 'slideLeft',
  slideRight: 'slideRight',
  slideUp: 'slideUp',
  slideDown: 'slideDown',
  
  // Scale animations
  popIn: 'popIn',
  scaleIn: 'scaleIn',
  
  // Special effects
  shimmer: 'shimmer',
  pulse: 'pulse',
  spin: 'spin',
  bounce: 'bounce',
  
  // Interactive animations
  hover: 'hover-lift',
  glow: 'glow-effect'
};

// Animation timing utilities
export const animationTimings = {
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s',
  verySlow: '0.8s'
};

// Easing functions (CSS cubic-bezier equivalents)
export const easings = {
  easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// Stagger animation helper
export const createStaggeredAnimation = (baseDelay = 0, increment = 0.1) => {
  return (index) => `${baseDelay + (index * increment)}s`;
};

// Intersection Observer for scroll animations
export const useScrollAnimation = (threshold = 0.1) => {
  const { useEffect, useRef, useState } = require('react');
  
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Animation style generators
export const generateAnimationStyle = (
  animationType, 
  delay = 0, 
  duration = animationTimings.normal,
  easing = easings.easeOut
) => ({
  animation: `${animationType} ${duration} ${easing} ${delay}s both`
});

// Hover animation utilities
export const hoverEffects = {
  lift: {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }
  },
  
  scale: {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  },
  
  glow: (color = '#f0a500') => ({
    onMouseEnter: (e) => {
      e.currentTarget.style.boxShadow = `0 0 20px ${color}40`;
      e.currentTarget.style.borderColor = `${color}60`;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
    }
  })
};

// Progress bar animation
export const animateProgressBar = (element, targetWidth, duration = 2000) => {
  if (!element) return;
  
  let start = null;
  const startWidth = 0;
  
  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const currentWidth = startWidth + (targetWidth - startWidth) * progress;
    
    element.style.width = `${currentWidth}%`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Number counting animation
export const animateNumber = (element, targetNumber, duration = 2000) => {
  if (!element) return;
  
  let start = null;
  const startNumber = 0;
  
  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * progress);
    
    element.textContent = currentNumber;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Particle effect utilities (for future GSAP integration)
export const particleEffects = {
  burst: (x, y, color = '#f0a500') => {
    // Placeholder for GSAP particle burst animation
    console.log(`Particle burst at ${x}, ${y} with color ${color}`);
  },
  
  trail: (element, color = '#f0a500') => {
    // Placeholder for GSAP trail effect
    console.log(`Trail effect on element with color ${color}`);
  }
};

// Timeline utilities (for complex animations)
export const createTimeline = () => {
  // Placeholder for GSAP timeline
  return {
    to: (target, props) => console.log('Timeline to:', target, props),
    from: (target, props) => console.log('Timeline from:', target, props),
    play: () => console.log('Timeline play'),
    pause: () => console.log('Timeline pause'),
    reverse: () => console.log('Timeline reverse')
  };
};