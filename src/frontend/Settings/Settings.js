import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Settings.css';
import { T, G } from './utils/designTokens';
import { TABS } from './utils/settingsData';
import { useBackground } from './hooks/useBackground';
import { useAuth } from '../../context/AuthContext';
import Cursor from '../Explore/components/Cursor';
import Sidebar from '../../components/Sidebar';
import { Toast } from './components/Toast';
import { AppearancePanel } from './components/panels/AppearancePanel';
import { NotificationsPanel } from './components/panels/NotificationsPanel';
import { PrivacyPanel } from './components/panels/PrivacyPanel';
import { SecurityPanel } from './components/panels/SecurityPanel';
import { LearningPanel } from './components/panels/LearningPanel';
import { AccessibilityPanel } from './components/panels/AccessibilityPanel';

const API_URL = 'http://localhost:5001/api/settings';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userInitials = (user?.name || 'ST').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const bgRef = useRef(null);
  useBackground(bgRef);

  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    dob: '',
    gender: '',
    language: 'English',
    timezone: 'IST (UTC+5:30)',
    accent: T.gold,
    theme: 'dark',
    font: 'Satoshi',
    fontSize: 15,
    density: 'Default',
    radius: 'Large',
    animEnabled: true,
    particles: true,
    gsapEffects: true,
    reducedMotion: false,
    cursorFx: true,
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    inAppNotif: true,
    assignNotif: true,
    gradeNotif: true,
    msgNotif: true,
    announceNotif: true,
    streakNotif: true,
    achieveNotif: true,
    eventNotif: false,
    weeklyDigest: true,
    quietHours: false,
    quietFrom: '22:00',
    quietTo: '07:00',
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showActivity: true,
    showCourses: true,
    showBadges: true,
    allowMessages: true,
    showOnline: true,
    shareAnalytics: false,
    personalizedAds: true,
    cookieConsent: true,
    thirdParty: false,
    twoFaApp: false,
    twoFaSms: false,
    twoFaEmail: false,
    studyTime: 'Evening (4–8 PM)',
    dailyGoal: 2,
    videoSpeed: '1.0x',
    autoPlay: true,
    subtitles: false,
    downloadMode: '720p',
    certReminder: true,
    pomodoroDefault: '25 min',
  });

  // Apply theme to document when form.theme changes
  useEffect(() => {
    const themeMap = {
      dark:     { '--bg': '#02060f', '--bg2': '#0c1628', '--accent': '#f0a500' },
      midnight: { '--bg': '#000510', '--bg2': '#080e22', '--accent': '#00d4aa' },
      aurora:   { '--bg': '#050a18', '--bg2': '#0d1530', '--accent': '#a78bfa' },
      ocean:    { '--bg': '#020b12', '--bg2': '#061828', '--accent': '#22d3ee' },
    };
    const vars = themeMap[form.theme] || themeMap.dark;
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    document.documentElement.setAttribute('data-theme', form.theme);
  }, [form.theme]);

  // Apply accent color
  useEffect(() => {
    if (form.accent) document.documentElement.style.setProperty('--accent-color', form.accent);
  }, [form.accent]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-base', `${form.fontSize}px`);
  }, [form.fontSize]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
  }, []);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      const token = getAuthToken();
      if (!token) {
        console.log('No token found, using default settings');
        setLoading(false);
        showToast('Not logged in. Using default settings.', 'info');
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const data = response.data.data;
          setForm({
            // Basic fields
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            username: data.username || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            dob: data.dob ? data.dob.split('T')[0] : '',
            gender: data.gender || '',
            language: data.language || 'English',
            timezone: data.timezone || 'IST (UTC+5:30)',
            accent: data.accent || T.gold,
            // Appearance
            theme: data.theme || 'dark',
            font: data.font || 'Satoshi',
            fontSize: data.fontSize || 15,
            density: data.density || 'Default',
            radius: data.radius || 'Large',
            animEnabled: data.animEnabled !== false,
            particles: data.particles !== false,
            gsapEffects: data.gsapEffects !== false,
            reducedMotion: data.reducedMotion || false,
            cursorFx: data.cursorFx !== false,
            // Notifications
            emailNotif: data.emailNotif !== false,
            pushNotif: data.pushNotif !== false,
            smsNotif: data.smsNotif || false,
            inAppNotif: data.inAppNotif !== false,
            assignNotif: data.assignNotif !== false,
            gradeNotif: data.gradeNotif !== false,
            msgNotif: data.msgNotif !== false,
            announceNotif: data.announceNotif !== false,
            streakNotif: data.streakNotif !== false,
            achieveNotif: data.achieveNotif !== false,
            eventNotif: data.eventNotif || false,
            weeklyDigest: data.weeklyDigest !== false,
            quietHours: data.quietHours || false,
            quietFrom: data.quietFrom || '22:00',
            quietTo: data.quietTo || '07:00',
            // Privacy
            profilePublic: data.profilePublic !== false,
            showEmail: data.showEmail || false,
            showPhone: data.showPhone || false,
            showActivity: data.showActivity !== false,
            showCourses: data.showCourses !== false,
            showBadges: data.showBadges !== false,
            allowMessages: data.allowMessages !== false,
            showOnline: data.showOnline !== false,
            shareAnalytics: data.shareAnalytics || false,
            personalizedAds: data.personalizedAds !== false,
            cookieConsent: data.cookieConsent !== false,
            thirdParty: data.thirdParty || false,
            // Security
            twoFaApp: data.twoFaApp || false,
            twoFaSms: data.twoFaSms || false,
            twoFaEmail: data.twoFaEmail || false,
            // Learning
            studyTime: data.studyTime || 'Evening (4–8 PM)',
            dailyGoal: data.dailyGoal || 2,
            videoSpeed: data.videoSpeed || '1.0x',
            autoPlay: data.autoPlay !== false,
            subtitles: data.subtitles || false,
            downloadMode: data.downloadMode || '720p',
            certReminder: data.certReminder !== false,
            pomodoroDefault: data.pomodoroDefault || '25 min',
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        if (error.response?.status === 401) {
          showToast('Session expired. Please login to save changes.', 'error');
        } else {
          showToast('Failed to load settings. Using defaults.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [navigate, showToast]);

  /* Ensure header is always visible + Add GSAP animations */
  useEffect(() => {
    // Force header visible immediately
    if (headerRef.current) {
      headerRef.current.style.opacity = '1';
      headerRef.current.style.visibility = 'visible';
      headerRef.current.style.display = 'flex';
      headerRef.current.style.transform = 'translateY(0)';
    }
    if (tabsRef.current) {
      const tabs = tabsRef.current.querySelectorAll('.stab');
      tabs.forEach(tab => {
        tab.style.opacity = '1';
        tab.style.visibility = 'visible';
        tab.style.transform = 'translateX(0)';
      });
    }

    // Permanent fix: Keep header visible at all times
    const headerInterval = setInterval(() => {
      if (headerRef.current) {
        headerRef.current.style.opacity = '1';
        headerRef.current.style.visibility = 'visible';
        headerRef.current.style.display = 'flex';
      }
    }, 100);

    // Load GSAP for smooth animations
    const loadGSAP = () => {
      if (window.gsap) {
        // GSAP already loaded
        const gsap = window.gsap;
        if (headerRef.current) {
          gsap.from(headerRef.current, {
            y: -20,
            duration: 0.7,
            ease: 'power3.out'
          });
        }
        if (tabsRef.current) {
          gsap.from(tabsRef.current.querySelectorAll('.stab'), {
            x: -16,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.2
          });
        }
      } else {
        // Load GSAP from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = () => {
          const gsap = window.gsap;
          if (headerRef.current) {
            gsap.from(headerRef.current, {
              y: -20,
              duration: 0.7,
              ease: 'power3.out'
            });
          }
          if (tabsRef.current) {
            gsap.from(tabsRef.current.querySelectorAll('.stab'), {
              x: -16,
              duration: 0.55,
              stagger: 0.06,
              ease: 'power3.out',
              delay: 0.2
            });
          }
        };
        document.head.appendChild(script);
      }
    };

    // Load GSAP after ensuring header is visible
    setTimeout(loadGSAP, 200);

    // Cleanup interval on unmount
    return () => clearInterval(headerInterval);
  }, []);

  /* Tab change animation */
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    const gsap = window.gsap;
    if (gsap && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 14, scale: 0.99 },
        { opacity: 1, x: 0, scale: 1, duration: 0.42, ease: 'power3.out' }
      );
    }
    setActiveTab(tabId);
  };

  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      showToast('Please login to save settings', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(API_URL, form, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSaved(true);
        showToast('Settings saved successfully! ✨', 'success');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      if (error.response?.status === 401) {
        showToast('Session expired. Please login again', 'error');
        navigate('/auth');
      } else {
        showToast(error.response?.data?.message || 'Failed to save settings', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const activeTabData = TABS.find((t) => t.id === activeTab);

  const renderPanel = () => {
    const props = { form, setForm, showToast };
    switch (activeTab) {
      case 'appearance':
        return <AppearancePanel {...props} />;
      case 'notifications':
        return <NotificationsPanel {...props} />;
      case 'privacy':
        return <PrivacyPanel {...props} />;
      case 'security':
        return <SecurityPanel {...props} />;
      case 'learning':
        return <LearningPanel {...props} />;
      case 'accessibility':
        return <AccessibilityPanel {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--bg, #02060f)',
        color: T.text,
        fontFamily: 'Satoshi, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {loading ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: T.bg,
          zIndex: 9999,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              border: `4px solid ${T.bord}`,
              borderTopColor: T.gold,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{
              fontSize: '0.9rem',
              color: T.text2,
              fontWeight: 600,
            }}>Loading settings...</div>
          </div>
        </div>
      ) : (
        <>
      <Cursor />

      {/* BG */}
      <canvas
        ref={bgRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div
        style={{
          position: 'fixed',
          inset: '-50%',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.016,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: 'noise 8s steps(10) infinite',
        }}
      />

      {/* Left nav - Use existing Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* TOP BAR - Enhanced Header */}
        <header
          ref={headerRef}
          style={{
            height: 80,
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 28px',
            paddingTop: 20,
            marginTop: 0,
            background: 'linear-gradient(135deg, rgba(2,6,15,.95) 0%, rgba(11,20,42,.92) 100%)',
            backdropFilter: 'blur(28px) saturate(180%)',
            borderBottom: `1px solid ${T.bord}`,
            boxShadow: '0 4px 24px rgba(0,0,0,.12)',
            flexShrink: 0,
            opacity: 1,
            visibility: 'visible',
            position: 'relative',
            zIndex: 1000,
          }}
        >
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${T.gold}08 50%, transparent 100%)`,
            pointerEvents: 'none',
          }} />

          {/* Menu toggle */}
          <button 
            className="icon-btn" 
            onClick={() => setCollapsed((s) => !s)}
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              background: 'rgba(255,255,255,.04)',
              border: `1px solid ${T.bord}`,
              color: T.text2,
              cursor: 'pointer',
              transition: 'all .3s ease',
              fontSize: '1rem',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,.08)';
              e.currentTarget.style.borderColor = T.gold;
              e.currentTarget.style.color = T.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,.04)';
              e.currentTarget.style.borderColor = T.bord;
              e.currentTarget.style.color = T.text2;
            }}
          >
            {collapsed ? '▶' : '◀'}
          </button>

          {/* Title with icon */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            zIndex: 1,
          }}>
            <div style={{
              width: 42,
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 11,
              background: `linear-gradient(135deg, ${T.gold}22 0%, ${T.gold}08 100%)`,
              border: `1px solid ${T.gold}33`,
              fontSize: '1.3rem',
            }}>
              ⚙️
            </div>
            <div>
              <div style={{ 
                fontSize: '1.15rem', 
                fontWeight: 800, 
                letterSpacing: '-.04em',
                background: `linear-gradient(135deg, ${T.text} 0%, ${T.text2} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}>
                Settings & Preferences
              </div>
              <div style={{
                fontSize: '.72rem',
                color: T.text3,
                fontWeight: 500,
                letterSpacing: '.02em',
                marginTop: 2,
              }}>
                Customize your learning experience
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Save indicator */}
          {saved && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 16px',
                borderRadius: 11,
                background: `linear-gradient(135deg, ${T.green}18 0%, ${T.green}08 100%)`,
                border: `1px solid ${T.green}44`,
                animation: 'popIn .35s cubic-bezier(.34,1.56,.64,1) both',
                boxShadow: `0 0 20px ${T.green}22`,
                zIndex: 1,
              }}
            >
              <span style={{ 
                color: T.green, 
                animation: 'checkBounce .4s ease',
                fontSize: '1.1rem',
              }}>✓</span>
              <span style={{ 
                fontSize: '.82rem', 
                fontWeight: 700, 
                color: T.green,
                letterSpacing: '.02em',
              }}>Saved!</span>
            </div>
          )}

          {/* Action buttons */}
          <button 
            className="btn-out" 
            style={{ 
              fontSize: '.82rem',
              padding: '9px 18px',
              borderRadius: 10,
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            Discard
          </button>
          <button 
            className="btn-gold" 
            onClick={handleSave} 
            style={{ 
              fontSize: '.84rem',
              padding: '10px 22px',
              borderRadius: 10,
              fontWeight: 700,
              boxShadow: `0 4px 16px ${T.gold}33`,
              zIndex: 1,
            }}
          >
            <span className="sh" />
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: '2.5px solid #030810',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin .7s linear infinite',
                    display: 'inline-block',
                  }}
                />
                Saving…
              </span>
            ) : (
              '💾 Save Settings'
            )}
          </button>

          <button className="icon-btn" style={{ position: 'relative' }}>
            🔔
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: T.red,
                border: `2px solid ${T.bg}`,
              }}
            />
          </button>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg,rgba(240,165,0,.22),rgba(255,122,48,.14))',
              border: '1px solid rgba(240,165,0,.22)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '.68rem',
              fontWeight: 900,
              color: T.gold,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => navigate('/profile')}
          >
            {userInitials}
          </div>
        </header>

        {/* BODY */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* SETTINGS NAV */}
          <div
            ref={tabsRef}
            style={{
              width: 220,
              minWidth: 220,
              borderRight: `1px solid ${T.bord}`,
              background: 'rgba(4,8,20,.8)',
              backdropFilter: 'blur(20px)',
              padding: '20px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: '.6rem',
                fontWeight: 800,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: T.text3,
                padding: '0 8px 10px',
              }}
            >
              Settings
            </div>

            {TABS.map((tab) => (
              <div
                key={tab.id}
                className={`stab${activeTab === tab.id ? ' on' : ''}`}
                style={{ '--tab-glow': `linear-gradient(90deg,${tab.color}08,transparent)`, cursor: "pointer" }}
                onClick={() => handleTabChange(tab.id)}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: activeTab === tab.id ? `${tab.color}18` : 'rgba(255,255,255,.04)',
                    border: `1px solid ${activeTab === tab.id ? tab.color + '35' : T.bord}`,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '.88rem',
                    flexShrink: 0,
                    transition: 'all .22s',
                  }}
                >
                  {tab.icon}
                </div>
                <span
                  style={{
                    fontSize: '.82rem',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? T.gold : T.text2,
                    transition: 'color .2s',
                  }}
                >
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: tab.color,
                      boxShadow: `0 0 6px ${tab.color}`,
                    }}
                  />
                )}
              </div>
            ))}

            {/* Profile completion */}
            <div
              style={{
                marginTop: 'auto',
                padding: '14px 10px 0',
                borderTop: `1px solid ${T.bord}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '.7rem',
                  marginBottom: 7,
                }}
              >
                <span style={{ color: T.text3, fontWeight: 600 }}>Profile Complete</span>
                <span style={{ color: T.gold, fontWeight: 800 }}>78%</span>
              </div>
              <div className="pbar">
                <div className="pfill" style={{ width: '78%', background: G.gold }} />
              </div>
              <div style={{ fontSize: '.67rem', color: T.text3, marginTop: 6 }}>
                Add photo to reach 85%
              </div>
            </div>
          </div>

          {/* PANEL CONTENT */}
          <div ref={contentRef} className="ms" style={{ flex: 1, padding: '24px 28px 40px' }}>
            {/* Panel header */}
            <div style={{ marginBottom: 22, animation: 'fadeUp .5s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${activeTabData?.color}14`,
                    border: `1px solid ${activeTabData?.color}30`,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '1rem',
                  }}
                >
                  {activeTabData?.icon}
                </div>
                <div
                  className="ff"
                  style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-.05em' }}
                >
                  {activeTabData?.label}{' '}
                  <em style={{ fontStyle: 'italic', color: T.gold }}>Settings</em>
                </div>
              </div>
              <div style={{ fontSize: '.82rem', color: T.text3, marginLeft: 46 }}>
                {
                  {
                    appearance: 'Customize the look and feel of LearnVerse',
                    notifications: 'Control how and when you receive notifications',
                    privacy: 'Manage your visibility and data sharing preferences',
                    security: 'Keep your account protected with strong security',
                    learning: 'Personalize your learning experience and schedule',
                    accessibility: 'Adjust accessibility options for a better experience',
                    integrations: 'Connect LearnVerse with your favorite tools',
                  }[activeTab]                }
              </div>
            </div>

            {/* Active panel */}
            {renderPanel()}
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        </>
      )}
    </div>
  );
}

