import { useRef } from 'react';
import { useGSAP } from '../../hooks/useGSAP';
import { SecHead } from '../SecHead';
import { Toggle } from '../Toggle';

export function PrivacyPanel({ form, setForm }) {
  const panelRef = useRef(null);

  useGSAP(
    (gsap) => {
      if (!panelRef.current) return;
      gsap.fromTo(
        panelRef.current.querySelectorAll('.scard'),
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
      );
    },
    []
  );

  return (
    <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="scard">
        <SecHead icon="👁️" title="Profile Visibility" />
        {[
          { k: 'profilePublic', l: 'Public Profile', d: 'Anyone on LearnVerse can view your profile' },
          { k: 'showEmail', l: 'Show Email Address', d: 'Display email on your public profile page' },
          { k: 'showPhone', l: 'Show Phone Number', d: 'Display mobile number publicly' },
          { k: 'showActivity', l: 'Show Learning Activity', d: 'Others can see your heatmap and learning streak' },
          { k: 'showCourses', l: 'Show Enrolled Courses', d: "Display courses you're currently taking" },
          { k: 'showBadges', l: 'Show Achievements', d: 'Display your earned badges and certificates' },
          { k: 'allowMessages', l: 'Allow Direct Messages', d: 'Let other learners send you messages' },
          { k: 'showOnline', l: 'Show Online Status', d: "Let others see when you're active" },
        ].map(({ k, l, d }) => (
          <div key={k} className="srow">
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: '.74rem', color: '#3a4f6e' }}>{d}</div>
            </div>
            <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
          </div>
        ))}
      </div>

      <div className="scard">
        <SecHead icon="🔍" title="Data & Analytics" />
        {[
          { k: 'shareAnalytics', l: 'Share Usage Analytics', d: 'Help improve LearnVerse by sharing anonymous usage data' },
          { k: 'personalizedAds', l: 'Personalized Recommendations', d: 'Use your learning history to recommend courses' },
          { k: 'cookieConsent', l: 'Analytics Cookies', d: 'Allow performance and analytics cookies' },
          { k: 'thirdParty', l: 'Third-party Integrations', d: 'Share data with connected apps (Notion, GitHub, etc.)' },
        ].map(({ k, l, d }) => (
          <div key={k} className="srow">
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: '.74rem', color: '#3a4f6e' }}>{d}</div>
            </div>
            <Toggle on={form[k] !== false} onChange={() => setForm((p) => ({ ...p, [k]: !p[k] }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

