import { useRef } from 'react';
import { T } from '../../utils/designTokens';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';
import { Toggle } from '../Toggle';

export function LearningPanel({ form, setForm }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.scard'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }
      );
    },
    []
  );

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="scard">
        <SecHead icon="⏱️" title="Study Schedule" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div
              style={{
                fontSize: '.68rem',
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: T.text3,
                marginBottom: 10,
              }}
            >
              Preferred Study Time
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {['Morning (6–10 AM)', 'Afternoon (12–4 PM)', 'Evening (4–8 PM)', 'Night (8 PM–12 AM)'].map((t) => (
                <div
                  key={t}
                  className={`radio-opt${form.studyTime === t ? ' sel' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, studyTime: t }))}
                >
                  <div className={`radio-dot${form.studyTime === t ? ' sel' : ''}`} />
                  <span style={{ fontSize: '.82rem', fontWeight: 600, color: form.studyTime === t ? T.gold : T.text2 }}>
                    {t}
                  </span>
                </div>
              ))}
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
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              Daily Goal
              <span style={{ color: T.gold, textTransform: 'none', letterSpacing: 0 }}>{form.dailyGoal || 2}h / day</span>
            </div>
            <input
              type="range"
              className="slider-inp"
              min={0.5}
              max={8}
              step={0.5}
              value={form.dailyGoal || 2}
              onChange={(e) => setForm((p) => ({ ...p, dailyGoal: +e.target.value }))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: T.text3, marginTop: 5 }}>
              <span>30 min</span>
              <span>8 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scard">
        <SecHead icon="🎯" title="Learning Style" />
        {[
          {
            k: 'videoSpeed',
            l: 'Default Video Playback Speed',
            d: 'Set your preferred playback speed',
            type: 'select',
            opts: ['0.75x', '1.0x', '1.25x', '1.5x', '1.75x', '2.0x'],
          },
          { k: 'autoPlay', l: 'Auto-play Next Lesson', d: 'Automatically start the next video', type: 'toggle' },
          { k: 'subtitles', l: 'Auto-enable Subtitles', d: 'Show captions by default', type: 'toggle' },
          {
            k: 'downloadMode',
            l: 'Offline Download Quality',
            d: 'Default quality for offline content',
            type: 'select',
            opts: ['360p', '480p', '720p', '1080p'],
          },
          { k: 'certReminder', l: 'Certificate Reminders', d: 'Remind me when close to completing a course', type: 'toggle' },
          {
            k: 'pomodoroDefault',
            l: 'Default Pomodoro Duration',
            d: 'Study session length in minutes',
            type: 'select',
            opts: ['20 min', '25 min', '30 min', '45 min', '60 min'],
          },
        ].map(({ k, l, d, type, opts }) => (
          <div key={k} className="srow">
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: '.74rem', color: T.text3 }}>{d}</div>
            </div>
            {type === 'toggle' ? (
              <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
            ) : (
              <select
                className="si-sel"
                style={{ width: 110, padding: '7px 30px 7px 11px' }}
                value={form[k] || opts[1]}
                onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
              >
                {opts?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

