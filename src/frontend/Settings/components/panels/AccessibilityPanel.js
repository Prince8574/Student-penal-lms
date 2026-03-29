import { useRef } from 'react';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';
import { Toggle } from '../Toggle';

export function AccessibilityPanel({ form, setForm }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.scard'),
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.55, stagger: 0.1, ease: 'power2.out' }
      );
    },
    []
  );

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="scard">
        <SecHead icon="♿" title="Visual & Motion" />
        {[
          { k: 'highContrast', l: 'High Contrast Mode', d: 'Increase contrast for better readability' },
          { k: 'largeText', l: 'Large Text Mode', d: 'Increase all text by 20% across the app' },
          { k: 'reduceMotion', l: 'Reduce Motion', d: 'Minimize animations and transitions' },
          { k: 'focusIndicators', l: 'Enhanced Focus Indicators', d: 'Stronger visible focus outlines for keyboard nav' },
          { k: 'colorBlind', l: 'Color-Blind Friendly Mode', d: 'Use patterns and icons instead of color alone' },
          { k: 'darkReader', l: 'Force Dark Mode on All Elements', d: 'Override any light-themed content' },
        ].map(({ k, l, d }) => (
          <div key={k} className="srow">
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: '.74rem', color: '#3a4f6e' }}>{d}</div>
            </div>
            <Toggle on={form[k] === true} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
          </div>
        ))}
      </div>

      <div className="scard">
        <SecHead icon="⌨️" title="Keyboard & Navigation" />
        {[
          { k: 'keyboardNav', l: 'Keyboard Navigation Mode', d: 'Navigate the entire app with keyboard shortcuts' },
          { k: 'screenReader', l: 'Screen Reader Optimizations', d: 'Enhanced ARIA labels and semantic HTML' },
          { k: 'tabIndex', l: 'Custom Tab Order', d: 'Use logical tab order through all interactive elements' },
        ].map(({ k, l, d }) => (
          <div key={k} className="srow">
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: '.74rem', color: '#3a4f6e' }}>{d}</div>
            </div>
            <Toggle on={form[k] === true} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

