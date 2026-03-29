import { useRef } from 'react';
import { T } from '../../utils/designTokens';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';
import { Toggle } from '../Toggle';

export function NotificationsPanel({ form, setForm }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.scard'),
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
      gsap.fromTo(
        panelRef.current.querySelectorAll('.nrow'),
        { opacity: 0, x: 14 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
      );
    },
    []
  );

  const channels = [
    { k: 'emailNotif', ico: '✉️', l: 'Email Notifications', d: 'Receive updates in your inbox' },
    { k: 'pushNotif', ico: '📱', l: 'Push Notifications', d: 'Real-time browser notifications' },
    { k: 'smsNotif', ico: '💬', l: 'SMS Alerts', d: 'Critical alerts via SMS' },
    { k: 'inAppNotif', ico: '🔔', l: 'In-App Notifications', d: 'Alerts within LearnVerse' },
  ];

  const categories = [
    { k: 'assignNotif', ico: '📝', l: 'Assignment Reminders', d: 'Due date reminders 24h and 1h before', color: T.gold },
    { k: 'gradeNotif', ico: '🏅', l: 'Grades Published', d: 'When instructor grades your work', color: T.green },
    { k: 'msgNotif', ico: '💬', l: 'New Messages', d: 'Messages from instructors and classmates', color: T.teal },
    { k: 'announceNotif', ico: '📢', l: 'Course Announcements', d: 'Important updates from your courses', color: T.blue2 },
    { k: 'streakNotif', ico: '🔥', l: 'Streak Reminders', d: 'Daily reminder to maintain your streak', color: T.orange },
    { k: 'achieveNotif', ico: '🏆', l: 'Badge & Achievements', d: 'When you earn a new badge or level up', color: T.purple },
    { k: 'eventNotif', ico: '📅', l: 'Live Events & Webinars', d: 'Upcoming sessions and office hours', color: T.pink },
    { k: 'weeklyDigest', ico: '📊', l: 'Weekly Progress Digest', d: 'Summary of your week every Sunday', color: T.cyan },
  ];

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="scard">
        <SecHead icon="📡" title="Notification Channels" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {channels.map(({ k, ico, l, d }) => (
            <div key={k} className="nrow">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,.04)',
                  border: `1px solid ${T.bord}`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {ico}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.88rem', fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: '.74rem', color: T.text3, marginTop: 2 }}>{d}</div>
              </div>
              <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
            </div>
          ))}
        </div>
      </div>

      <div className="scard">
        <SecHead icon="🗂️" title="Notification Categories" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {categories.map(({ k, ico, l, d, color }) => (
            <div key={k} className="nrow">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${color}12`,
                  border: `1px solid ${color}28`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {ico}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.87rem', fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: '.73rem', color: T.text3, marginTop: 2 }}>{d}</div>
              </div>
              <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} color={color} />
            </div>
          ))}
        </div>
      </div>

      <div className="scard">
        <SecHead icon="🕐" title="Quiet Hours" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="srow">
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 600 }}>Enable Quiet Hours</div>
              <div style={{ fontSize: '.74rem', color: T.text3 }}>Mute all non-critical notifications during set hours</div>
            </div>
            <Toggle on={form.quietHours} onChange={() => setForm((p) => ({ ...p, quietHours: !p.quietHours }))} />
          </div>
          {form.quietHours && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, animation: 'fadeUp .35s ease both' }}>
              {[
                ['From', 'quietFrom'],
                ['To', 'quietTo'],
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
                  <input
                    type="time"
                    className="si"
                    value={form[key] || '22:00'}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

