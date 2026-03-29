import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Settings.css';
import { T } from './utils/designTokens';
import { AppearancePanel } from './components/panels/AppearancePanel';

const API_URL = 'http://localhost:5001/api/settings';

export default function SettingsSimple() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
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
    accent: T.gold,
  });

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    const loadSettings = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        setMessage('Not logged in. Using defaults.');
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const data = response.data.data;
          setForm(prev => ({
            ...prev,
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
            accent: data.accent || T.gold,
          }));
          setMessage('Settings loaded successfully!');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setMessage('Failed to load settings. Using defaults.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      setMessage('Please login to save settings');
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
        setMessage('✅ Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('❌ Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: T.bg,
        color: T.text,
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      color: T.text,
      fontFamily: 'Satoshi, sans-serif',
    }}>
      {/* HEADER - Always Visible */}
      <div style={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(11,20,42,.9)',
        borderBottom: `1px solid ${T.bord}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,.05)',
              border: `1px solid ${T.bord}`,
              borderRadius: 8,
              color: T.text2,
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            ⚙️ Settings
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {message && (
            <div style={{
              padding: '8px 16px',
              background: 'rgba(240,165,0,.1)',
              border: `1px solid ${T.gold}`,
              borderRadius: 8,
              fontSize: '0.85rem',
            }}>
              {message}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 24px',
              background: `linear-gradient(135deg, ${T.gold}, #ff7a30)`,
              border: 'none',
              borderRadius: 10,
              color: '#030810',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 28px',
      }}>
        <div style={{
          background: 'rgba(8,14,32,.94)',
          border: `1px solid ${T.bord}`,
          borderRadius: 20,
          padding: 32,
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 900, 
            marginBottom: 8,
            color: T.gold,
          }}>
            Appearance Settings
          </h2>
          <p style={{ 
            fontSize: '0.9rem', 
            color: T.text3, 
            marginBottom: 32 
          }}>
            Customize the look and feel of your interface
          </p>

          <AppearancePanel form={form} setForm={setForm} showToast={(msg) => setMessage(msg)} />
        </div>
      </div>
    </div>
  );
}
