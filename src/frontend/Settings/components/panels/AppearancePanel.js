import { useRef } from 'react';
import { T } from '../../utils/designTokens';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';
import { Toggle } from '../Toggle';

export function AppearancePanel({ form, setForm }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.scard'),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' }
      );
    },
    []
  );

  const themes = [
    { id: 'dark', label: 'Cosmic Dark', preview: ['#02060f', '#0c1628', '#f0a500'] },
    { id: 'midnight', label: 'Deep Midnight', preview: ['#000510', '#080e22', '#00d4aa'] },
    { id: 'aurora', label: 'Aurora', preview: ['#050a18', '#0d1530', '#a78bfa'] },
    { id: 'ocean', label: 'Deep Ocean', preview: ['#020b12', '#061828', '#22d3ee'] },
  ];

  const fonts = ['Satoshi', 'DM Sans', 'Plus Jakarta', 'Outfit', 'Nunito'];
  const densities = ['Compact', 'Default', 'Comfortable'];
  const radii = ['None', 'Small', 'Medium', 'Large', 'Full'];

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Theme */}
      <div className="scard">
        <SecHead icon="🎨" title="Theme" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {themes.map((th) => (
            <div
              key={th.id}
              className={`theme-prev${form.theme === th.id ? ' sel' : ''}`}
              onClick={() => setForm((p) => ({ ...p, theme: th.id }))}
            >
              <div style={{ height: 72, background: th.preview[0], position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 8, left: 8, right: 8, height: 8, borderRadius: 4, background: th.preview[1] }} />
                <div style={{ position: 'absolute', top: 22, left: 8, width: '60%', height: 5, borderRadius: 3, background: th.preview[1] }} />
                <div style={{ position: 'absolute', top: 33, left: 8, width: '40%', height: 4, borderRadius: 3, background: th.preview[1], opacity: 0.6 }} />
                <div style={{ position: 'absolute', bottom: 8, right: 8, width: 24, height: 10, borderRadius: 5, background: th.preview[2] }} />
              </div>
              <div style={{ padding: '8px 10px', background: th.preview[0], borderTop: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: th.preview[2] }}>{th.label}</div>
              </div>
              {form.theme === th.id && (
                <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: T.gold, display: 'grid', placeItems: 'center', animation: 'checkBounce .35s cubic-bezier(.34,1.56,.64,1) both', fontSize: '.65rem', fontWeight: 900, color: '#030810' }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Accent colors */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text3, marginBottom: 12 }}>
            Accent Color
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[T.gold, T.teal, T.blue, T.purple, T.pink, T.green, T.cyan, T.indigo].map((c) => (
              <div
                key={c}
                className={`cswatch${form.accent === c ? ' sel' : ''}`}
                style={{ background: c, color: c }}
                onClick={() => setForm((p) => ({ ...p, accent: c }))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Typography & Density */}
      <div className="scard">
        <SecHead icon="✏️" title="Typography & Layout" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text3, marginBottom: 10 }}>
              Font Family
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {fonts.map((f) => (
                <button
                  key={f}
                  onClick={() => setForm((p) => ({ ...p, font: f }))}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 10,
                    border: `1px solid ${form.font === f ? T.bordG : T.bord}`,
                    background: form.font === f ? 'rgba(240,165,0,.08)' : 'transparent',
                    color: form.font === f ? T.gold : T.text2,
                    fontSize: '.8rem',
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: 'all .2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text3, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              Font Size
              <span style={{ color: T.gold, textTransform: 'none', letterSpacing: 0 }}>{form.fontSize}px</span>
            </div>
            <input
              type="range"
              className="slider-inp"
              min={12}
              max={20}
              value={form.fontSize}
              onChange={(e) => setForm((p) => ({ ...p, fontSize: +e.target.value }))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: T.text3, marginTop: 5 }}>
              <span>Small (12px)</span>
              <span>Large (20px)</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text3, marginBottom: 10 }}>
              UI Density
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {densities.map((d) => (
                <div
                  key={d}
                  className={`radio-opt${form.density === d ? ' sel' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, density: d }))}
                >
                  <div className={`radio-dot${form.density === d ? ' sel' : ''}`} />
                  <span style={{ fontSize: '.82rem', fontWeight: 600, color: form.density === d ? T.gold : T.text2 }}>
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text3, marginBottom: 10 }}>
              Border Radius
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {radii.map((r, i) => (
                <button
                  key={r}
                  onClick={() => setForm((p) => ({ ...p, radius: r }))}
                  style={{
                    padding: '7px 14px',
                    borderRadius: [0, 6, 10, 14, 99][i],
                    border: `1px solid ${form.radius === r ? T.bordG : T.bord}`,
                    background: form.radius === r ? 'rgba(240,165,0,.08)' : 'transparent',
                    color: form.radius === r ? T.gold : T.text2,
                    fontSize: '.8rem',
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: 'all .2s',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <div className="scard">
        <SecHead icon="✨" title="Animations & Effects" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { k: 'animEnabled', l: 'Enable animations', d: 'Page transitions, hover effects, stagger reveals' },
            { k: 'particles', l: 'Three.js particle background', d: 'Animated 3D particle system in background' },
            { k: 'gsapEffects', l: 'GSAP scroll animations', d: 'Elements animate as they enter the viewport' },
            { k: 'reducedMotion', l: 'Respect reduced motion', d: 'Honor system prefers-reduced-motion setting' },
            { k: 'cursorFx', l: 'Custom cursor effects', d: 'Gold glowing cursor with ring follower' },
          ].map(({ k, l, d }) => (
            <div key={k} className="srow">
              <div>
                <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: '.75rem', color: T.text3 }}>{d}</div>
              </div>
              <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

