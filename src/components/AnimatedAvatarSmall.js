import { useRef, useEffect } from 'react';

export function AnimatedAvatarSmall({ avatarUrl, initials = 'ST', size = 34, borderRadius = '50%' }) {
  const ringRef = useRef(null);

  useEffect(() => {
    try {
      const { gsap } = require('gsap');
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: 1.2, opacity: 0.9, duration: 1.4,
          repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
      }
    } catch (_) {}
  }, []);

  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 360;
    const r = size * 0.72;
    const x = Math.cos((angle * Math.PI) / 180) * r;
    const y = Math.sin((angle * Math.PI) / 180) * r;
    return { x, y, delay: i * 0.18 };
  });

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Orbiting dots */}
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: size * 0.1, height: size * 0.1,
          borderRadius: '50%',
          background: 'rgba(240,165,0,0.7)',
          top: '50%', left: '50%',
          transform: `translate(calc(-50% + ${d.x}px), calc(-50% + ${d.y}px))`,
          animation: `stAvatarDotPulse 2s ease-in-out ${d.delay}s infinite`,
          zIndex: 0,
        }} />
      ))}

      {/* Pulse ring */}
      <div ref={ringRef} style={{
        position: 'absolute', inset: -2, borderRadius,
        border: '1.5px solid rgba(240,165,0,.65)',
        zIndex: 1, pointerEvents: 'none',
        transformOrigin: 'center',
        animation: 'stAvatarRingPulse 1.8s ease-in-out infinite',
      }} />

      {/* Avatar */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius,
        background: 'linear-gradient(135deg,#F0A500,#FF7A30)',
        display: 'grid', placeItems: 'center',
        overflow: 'hidden', zIndex: 2,
        fontSize: size * 0.28 + 'px', fontWeight: 900, color: '#fff',
        border: '1.5px solid rgba(240,165,0,.5)',
        boxShadow: '0 0 14px rgba(240,165,0,.4)',
      }}>
        {avatarUrl
          ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials
        }
      </div>

      <style>{`
        @keyframes stAvatarRingPulse {
          0%,100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }
        @keyframes stAvatarDotPulse {
          0%,100% { opacity: 0.2; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(0.7); }
          50% { opacity: 0.8; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(1.2); }
        }
      `}</style>
    </div>
  );
}
