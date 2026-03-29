import { useRef } from 'react';
import { T } from '../../utils/designTokens';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';

export function AccountPanel({ form, setForm, showToast }) {
  const accentColors = [T.gold, T.teal, T.blue, T.purple, T.pink, T.green, T.red, T.cyan];
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

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Profile header card */}
      <div
        className="scard"
        style={{ background: 'linear-gradient(135deg,rgba(8,14,32,.94),rgba(14,8,32,.9))' }}
      >
        <SecHead icon="📸" title="Profile Identity" />
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              flexShrink: 0,
            }}
          >
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg,${form.accent},${form.accent}88,${form.accent})`,
                  animation: 'spin 5s linear infinite',
                  filter: 'blur(5px)',
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg,${form.accent},${form.accent}55,${form.accent})`,
                  animation: 'spin 5s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 3,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg,${form.accent}22,${form.accent}44)`,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'avatarGlow 3s ease-in-out infinite',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Fraunces,serif',
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    color: form.accent,
                  }}
                >
                  RK
                </span>
              </div>
            </div>
            <button className="btn-out" style={{ fontSize: '.75rem', padding: '7px 14px' }}>
              📷 Change Photo
            </button>
          </div>

          {/* Fields */}
          <div
            style={{
              flex: 1,
              minWidth: 220,
              display: 'flex',
              flexDirection: 'column',
              gap: 13,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['First Name', 'firstName', '👤'],
                ['Last Name', 'lastName', ''],
              ].map(([lbl, key, ico]) => (
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
                  <input
                    className="si"
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={lbl}
                    style={{ paddingLeft: ico ? 36 : 14 }}
                  />
                </div>
              ))}
            </div>

            <div>
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
                Username
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '.85rem',
                    color: T.text3,
                    pointerEvents: 'none',
                  }}
                >
                  @
                </span>
                <input
                  className="si"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  placeholder="username"
                  style={{ paddingLeft: 30 }}
                />
              </div>
            </div>

            <div>
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
                Bio
              </div>
              <textarea
                className="si"
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell the world about yourself…"
                style={{ minHeight: 70, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>
          </div>
        </div>

        {/* Accent color */}
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.bord}` }}>
          <div
            style={{
              fontSize: '.68rem',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: T.text3,
              marginBottom: 12,
            }}
          >
            Profile Accent Color
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {accentColors.map((c) => (
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

      {/* Personal info */}
      <div className="scard">
        <SecHead icon="📋" title="Personal Information" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Email', 'email', '✉️'],
              ['Phone', 'phone', '📱'],
            ].map(([lbl, key, ico]) => (
              <div key={key}>
                <div
                  style={{
                    fontSize: '.68rem',
                    fontWeight: 700,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    color: T.text3,
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {lbl}
                  {key === 'email' && (
                    <span
                      style={{
                        color: T.green,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '.68rem',
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '.82rem',
                      pointerEvents: 'none',
                      opacity: 0.5,
                    }}
                  >
                    {ico}
                  </span>
                  <input
                    className="si"
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ paddingLeft: 36 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
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
                Date of Birth
              </div>
              <input
                type="date"
                className="si"
                value={form.dob}
                onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
              />
            </div>
            <div>
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
                Gender
              </div>
              <select
                className="si-sel"
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
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
                Language
              </div>
              <select
                className="si-sel"
                value={form.language}
                onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
              >
                {['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
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
                Timezone
              </div>
              <select
                className="si-sel"
                value={form.timezone}
                onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))}
              >
                {['IST (UTC+5:30)', 'UTC', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT (UTC+0)'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="scard" style={{ borderColor: 'rgba(239,68,68,.12)' }}>
        <SecHead icon="⚠️" title="Danger Zone" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              l: 'Export My Data',
              d: 'Download all your account data as a JSON file',
              btn: 'Export',
              col: T.gold,
            },
            {
              l: 'Reset Learning Progress',
              d: 'Wipe all XP, streaks, and course progress',
              btn: 'Reset',
              col: T.orange,
            },
            {
              l: 'Deactivate Account',
              d: 'Temporarily pause your account — reactivate anytime',
              btn: 'Deactivate',
              col: T.amber,
            },
            {
              l: 'Delete Account',
              d: 'Permanently delete your account and all associated data',
              btn: 'Delete',
              col: T.red,
            },
          ].map(({ l, d, btn, col }) => (
            <div key={l} className="secitem danger" style={{ cursor: "pointer" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.87rem', fontWeight: 700, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: '.75rem', color: T.text2 }}>{d}</div>
              </div>
              <button
                className="btn-red"
                style={{
                  borderColor: `${col}33`,
                  color: col,
                  background: `${col}0a`,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${col}66`;
                  e.currentTarget.style.background = `${col}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${col}33`;
                  e.currentTarget.style.background = `${col}0a`;
                }}
              >
                {btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

