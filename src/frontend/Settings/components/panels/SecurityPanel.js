import { useRef } from 'react';
import { T, G } from '../../utils/designTokens';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';
import { Toggle } from '../Toggle';

export function SecurityPanel({ form, setForm, showToast }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.secitem'),
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.1 }
      );
    },
    []
  );

  const strength = form.newPwd
    ? Math.min(4, [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(form.newPwd)).length)
    : 0;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', T.red, T.amber, T.gold, T.green][strength];

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="scard">
        <SecHead icon="🔑" title="Change Password" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Current Password', 'currentPwd'],
            ['New Password', 'newPwd'],
            ['Confirm New Password', 'confirmPwd'],
          ].map(([lbl, key]) => (
            <div key={key}>
              <div
                style={{
                  fontSize: '.68rem',
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: T.text3,
                  marginBottom: 6,
                }}
              >
                {lbl}
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '.85rem',
                    pointerEvents: 'none',
                    opacity: 0.45,
                  }}
                >
                  🔒
                </span>
                <input
                  type="password"
                  className="si"
                  value={form[key] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                  style={{ paddingLeft: 36 }}
                />
              </div>
              {key === 'newPwd' && form.newPwd && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 99,
                          background: i <= strength ? strengthColor : 'rgba(255,255,255,.06)',
                          transition: 'background .3s',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '.7rem', color: strengthColor, fontWeight: 700 }}>{strengthLabel}</div>
                </div>
              )}
            </div>
          ))}
          <button
            className="btn-gold"
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
            onClick={() => showToast('Password updated successfully!', 'success')}
          >
            <span className="sh" />
            🔒 Update Password
          </button>
        </div>
      </div>

      <div className="scard">
        <SecHead icon="🛡️" title="Two-Factor Authentication" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            {
              ico: '📱',
              l: 'Authenticator App',
              d: 'Google Authenticator or Authy',
              k: 'twoFaApp',
              badge: form.twoFaApp ? 'Active' : null,
              badgeCol: T.green,
            },
            { ico: '💬', l: 'SMS Authentication', d: 'OTP sent to +91 987XX XX210', k: 'twoFaSms', badge: null },
            { ico: '📧', l: 'Email Authentication', d: 'Backup codes sent to your email', k: 'twoFaEmail', badge: 'Backup' },
          ].map(({ ico, l, d, k, badge, badgeCol }) => (
            <div key={k} className="secitem">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: 'rgba(74,222,128,.08)',
                  border: '1px solid rgba(74,222,128,.2)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {ico}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: '.88rem', fontWeight: 600 }}>{l}</span>
                  {badge && (
                    <span
                      style={{
                        fontSize: '.62rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 5,
                        background: `${badgeCol || T.teal}14`,
                        color: badgeCol || T.teal,
                        border: `1px solid ${badgeCol || T.teal}28`,
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '.74rem', color: T.text3 }}>{d}</div>
              </div>
              <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} color={G.green} />
            </div>
          ))}
        </div>
      </div>

      <div className="scard">
        <SecHead icon="📟" title="Active Sessions" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { d: 'Chrome on macOS', loc: 'Mumbai, India', t: 'Current session', ico: '💻', current: true },
            { d: 'Safari on iPhone 14', loc: 'Mumbai, India', t: '2 hours ago', ico: '📱' },
            { d: 'Firefox on Windows', loc: 'Pune, India', t: 'Yesterday, 3:22 PM', ico: '🖥️' },
          ].map((s, i) => (
            <div key={i} className="secitem">
              <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{s.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.87rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s.d}
                  {s.current && (
                    <span
                      style={{
                        fontSize: '.62rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 5,
                        background: 'rgba(74,222,128,.12)',
                        color: T.green,
                        border: '1px solid rgba(74,222,128,.25)',
                      }}
                    >
                      You
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '.73rem', color: T.text3, marginTop: 2 }}>
                  {s.loc} · {s.t}
                </div>
              </div>
              {!s.current && (
                <button className="btn-red" style={{ fontSize: '.73rem', padding: '5px 12px' }}>
                  Revoke
                </button>
              )}
            </div>
          ))}
          <button className="btn-red" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Log Out All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

