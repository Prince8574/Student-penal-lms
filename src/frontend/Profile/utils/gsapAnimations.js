/* ═══════════════════════════════════════
GSAP ANIMATION UTILITIES
═══════════════════════════════════════ */

// Note: This file is prepared for GSAP integration
// Currently using CSS animations for React compatibility
// Uncomment and install GSAP when ready to use advanced animations

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
ANIMATION PRESETS
═══════════════════════════════════════ */

// Fade animations
export const fadeAnimations = {
  fadeIn: (element, duration = 0.6, delay = 0) => {
    // CSS fallback
    if (element) {
      element.style.animation = `fadeIn ${duration}s ease ${delay}s both`;
    }
    
    // GSAP version (uncomment when GSAP is installed)
    // return gsap.fromTo(element, 
    //   { opacity: 0 }, 
    //   { opacity: 1, duration, delay, ease: "power2.out" }
    // );
  },
  
  fadeUp: (element, duration = 0.6, delay = 0) => {
    if (element) {
      element.style.animation = `fadeUp ${duration}s ease ${delay}s both`;
    }
    
    // GSAP version
    // return gsap.fromTo(element,
    //   { opacity: 0, y: 30 },
    //   { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
    // );
  },
  
  fadeLeft: (element, duration = 0.6, delay = 0) => {
    if (element) {
      element.style.animation = `slideLeft ${duration}s ease ${delay}s both`;
    }
    
    // GSAP version
    // return gsap.fromTo(element,
    //   { opacity: 0, x: -30 },
    //   { opacity: 1, x: 0, duration, delay, ease: "power2.out" }
    // );
  }
};

// Scale animations
export const scaleAnimations = {
  popIn: (element, duration = 0.5, delay = 0) => {
    if (element) {
      element.style.animation = `popIn ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`;
    }
    
    // GSAP version
    // return gsap.fromTo(element,
    //   { scale: 0, opacity: 0 },
    //   { scale: 1, opacity: 1, duration, delay, ease: "back.out(1.7)" }
    // );
  },
  
  scaleHover: (element) => {
    // CSS hover effect
    if (element) {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
      });
    }
    
    // GSAP version
    // element.addEventListener('mouseenter', () => {
    //   gsap.to(element, { scale: 1.05, duration: 0.2, ease: "power2.out" });
    // });
    // element.addEventListener('mouseleave', () => {
    //   gsap.to(element, { scale: 1, duration: 0.2, ease: "power2.out" });
    // });
  }
};

// Progress bar animations
export const progressAnimations = {
  animateProgressBar: (element, targetWidth, duration = 2) => {
    if (!element) return;
    
    // CSS animation fallback
    element.style.width = '0%';
    element.style.transition = `width ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    
    setTimeout(() => {
      element.style.width = `${targetWidth}%`;
    }, 100);
    
    // GSAP version
    // return gsap.fromTo(element,
    //   { width: "0%" },
    //   { width: `${targetWidth}%`, duration, ease: "power2.out" }
    // );
  },
  
  animateNumber: (element, targetNumber, duration = 2) => {
    if (!element) return;
    
    // Simple JavaScript counter
    let currentNumber = 0;
    const increment = targetNumber / (duration * 60); // 60fps
    
    const counter = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber;
        clearInterval(counter);
      }
      element.textContent = Math.floor(currentNumber);
    }, 1000 / 60);
    
    // GSAP version
    // const obj = { number: 0 };
    // return gsap.to(obj, {
    //   number: targetNumber,
    //   duration,
    //   ease: "power2.out",
    //   onUpdate: () => {
    //     element.textContent = Math.floor(obj.number);
    //   }
    // });
  }
};

// Stagger animations
export const staggerAnimations = {
  staggerFadeIn: (elements, duration = 0.6, stagger = 0.1) => {
    elements.forEach((element, index) => {
      if (element) {
        element.style.animation = `fadeUp ${duration}s ease ${index * stagger}s both`;
      }
    });
    
    // GSAP version
    // return gsap.fromTo(elements,
    //   { opacity: 0, y: 30 },
    //   { opacity: 1, y: 0, duration, stagger, ease: "power2.out" }
    // );
  },
  
  staggerScale: (elements, duration = 0.5, stagger = 0.08) => {
    elements.forEach((element, index) => {
      if (element) {
        element.style.animation = `popIn ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * stagger}s both`;
      }
    });
    
    // GSAP version
    // return gsap.fromTo(elements,
    //   { scale: 0, opacity: 0 },
    //   { scale: 1, opacity: 1, duration, stagger, ease: "back.out(1.7)" }
    // );
  }
};

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInOnScroll: (element, options = {}) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeAnimations.fadeUp(entry.target, options.duration || 0.6, options.delay || 0);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: options.threshold || 0.1 });
    
    if (element) observer.observe(element);
    
    // GSAP ScrollTrigger version
    // return gsap.fromTo(element,
    //   { opacity: 0, y: 30 },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     duration: options.duration || 0.6,
    //     scrollTrigger: {
    //       trigger: element,
    //       start: "top 80%",
    //       toggleActions: "play none none none"
    //     }
    //   }
    // );
  }
};

// Timeline utilities
export const timelineUtils = {
  createTimeline: () => {
    // Simple timeline simulation
    const timeline = {
      animations: [],
      add: function(animation, delay = 0) {
        this.animations.push({ animation, delay });
        return this;
      },
      play: function() {
        this.animations.forEach(({ animation, delay }) => {
          setTimeout(() => {
            if (typeof animation === 'function') {
              animation();
            }
          }, delay * 1000);
        });
        return this;
      }
    };
    
    return timeline;
    
    // GSAP Timeline version
    // return gsap.timeline();
  }
};

// Particle effects (placeholder for GSAP integration)
export const particleEffects = {
  createBurst: (x, y, color = '#f0a500', count = 12) => {
    // Simple CSS particle burst simulation
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.animation = `particleBurst 0.8s ease-out forwards`;
      particle.style.animationDelay = `${i * 0.02}s`;
      
      const angle = (i / count) * Math.PI * 2;
      particle.style.setProperty('--dx', `${Math.cos(angle) * 50}px`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * 50}px`);
      
      container.appendChild(particle);
    }
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      document.body.removeChild(container);
    }, 1000);
    
    // GSAP version would create more sophisticated particle effects
  }
};

// Hover effects
export const hoverEffects = {
  lift: (element, liftAmount = 2) => {
    if (!element) return;
    
    element.addEventListener('mouseenter', () => {
      element.style.transform = `translateY(-${liftAmount}px)`;
      element.style.transition = 'transform 0.2s ease';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0)';
    });
    
    // GSAP version
    // element.addEventListener('mouseenter', () => {
    //   gsap.to(element, { y: -liftAmount, duration: 0.2, ease: "power2.out" });
    // });
    // element.addEventListener('mouseleave', () => {
    //   gsap.to(element, { y: 0, duration: 0.2, ease: "power2.out" });
    // });
  },
  
  glow: (element, color = '#f0a500') => {
    if (!element) return;
    
    el