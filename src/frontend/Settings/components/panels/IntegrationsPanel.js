import { useRef } from 'react';
import { T } from '../../utils/designTokens';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';

export function IntegrationsPanel({ form, setForm, showToast }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.secitem'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }
      );
    },
    []
  );

  const integrations = [
    { id: 'github', ico: '⚫', name: 'GitHub', desc: 'Sync your coding assignments and projects', connected: true, user: '@rahulkhan' },
    { id: 'notion', ico: '⬜', name: 'Notion', desc: 'Export notes and learning logs to Notion', connected: false },
    {
      id: 'google',
      ico: '🔵',
      name: 'Google Calendar',
      desc: 'Sync deadlines and schedules to Google Calendar',
      connected: true,
      user: 'rahul.s@gmail.com',
    },
    { id: 'linkedin', ico: '🔷', name: 'LinkedIn', desc: 'Share certificates directly to your LinkedIn', connected: false },
    { id: 'discord', ico: '🟣', name: 'Discord', desc: 'Get assignment reminders via Discord bot', connected: false },
    { id: 'slack', ico: '🟡', name: 'Slack', desc: 'Course notifications in your Slack workspace', connected: false },
    {
      id: 'vscode',
      ico: '🔵',
      name: 'VS Code Extension',
      desc: 'Access course resources inside VS Code',
      connected: true,
      user: 'Installed v2.1.0',
    },
    { id: 'kaggle', ico: '🔶', name: 'Kaggle', desc: 'Import datasets for Data Science assignments', connected: false },
  ];

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="scard">
        <SecHead icon="🔗" title="Connected Apps" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {integrations.map((app) => (
            <div key={app.id} className="secitem">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,.06)',
                  border: `1px solid ${T.bord}`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                {app.ico}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: '.88rem', fontWeight: 700 }}>{app.name}</span>
                  {app.connected && (
                    <span
                      style={{
                        fontSize: '.62rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 5,
                        background: 'rgba(74,222,128,.1)',
                        color: T.green,
                        border: '1px solid rgba(74,222,128,.22)',
                      }}
                    >
                      Connected
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '.73rem', color: T.text3 }}>{app.connected ? app.user : app.desc}</div>
              </div>
              <button
                onClick={() =>
                  showToast(
                    app.connected ? `${app.name} disconnected` : `${app.name} connected! `,
                    app.connected ? 'info' : 'success'
                  )
                }
                className={app.connected ? 'btn-out' : 'btn-gold'}
                style={{ fontSize: '.75rem', padding: '7px 14px', flexShrink: 0 }}
              >
                {app.connected ? (
                  'Disconnect'
                ) : (
                  <>
                    <span className="sh" />
                    Connect
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

