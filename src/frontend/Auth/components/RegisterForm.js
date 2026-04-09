import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authAPI } from '../../../services/api';
import API_BASE from '../../../config/api';

function getPwdStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (pwd.length >= 12)         score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: '#f02079' };
  if (score <= 3) return { score, label: 'Fair',   color: '#f59e0b' };
  if (score <= 4) return { score, label: 'Good',   color: '#8b5cf6' };
  return               { score, label: 'Strong', color: '#00d97e' };
}

const STEPS = ['Account Info', 'Security', 'Verify Email'];

function RegisterForm({ onSuccess, switchToLogin }) {
  const navigate = useNavigate();
  const { register: registerUser, loginWithToken } = useAuth();

  const [step, setStep]           = useState(1);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [pwd, setPwd]             = useState('');
  const [confirm, setConfirm]     = useState('');
  const [agreed, setAgreed]       = useState(false);
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showCfm, setShowCfm]     = useState(false);
  const otpRefs  = useRef([]);
  const timerRef = useRef(null);
  const strength = getPwdStrength(pwd);

  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  const validate1 = () => {
    const e = {};
    if (!name.trim())         e.name  = 'Full name is required';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    return e;
  };

  const validate2 = () => {
    const e = {};
    if (pwd.length < 8)  e.pwd     = 'At least 8 characters required';
    if (pwd !== confirm) e.confirm = "Passwords don't match";
    if (!agreed)         e.agreed  = 'Please accept the terms';
    return e;
  };

  const nextStep = async () => {
    if (step === 1) {
      const e = validate1();
      setErrors(e);
      if (!Object.keys(e).length) setStep(2);

    } else if (step === 2) {
      const e = validate2();
      setErrors(e);
      if (!Object.keys(e).length) {
        setLoading(true);
        const userData = {
          name: name.trim(),
          email,
          password: pwd,
          ...(phone.trim() ? { phone: phone.replace(/\D/g, '') } : {}),
        };
        const result = await registerUser(userData);
        setLoading(false);
        if (result.success) {
          // Send OTP for email verification
          try {
            await authAPI.sendOtp(email, 'registration');
          } catch (_) {}
          setCountdown(60);
          setStep(3);
        } else {
          setErrors({ general: result.message });
        }
      }

    } else {
      const code = otp.join('');
      if (code.length < 6) { setErrors({ otp: 'Enter the 6-digit code' }); return; }
      setLoading(true);
      try {
        const res = await authAPI.verifyOtp(email, code, 'registration');
        setLoading(false);
        if (res.data.success) {
          // Backend returns full auth token for registration
          if (res.data.token) {
            await loginWithToken(res.data.token);
          }
          onSuccess('register');
          navigate('/');
        } else {
          setErrors({ otp: res.data.message || 'Invalid OTP' });
        }
      } catch (err) {
        setLoading(false);
        setErrors({ otp: err.response?.data?.message || 'Invalid or expired OTP' });
      }
    }
  };

  const handleOtp = (val, i) => {
    const v = val.replace(/\D/, '').slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
    if (!v && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div>
      {/* Progress bar */}
      <div className="step-bar">
        {STEPS.map((_, i) => (
          <div key={i} className={`step-seg${i + 1 === step ? ' active' : i + 1 < step ? ' done' : ''}`} />
        ))}
      </div>

      <div className="card-eyebrow">
        <div className="eyebrow-dot" /> STEP {step} OF 3 — {STEPS[step - 1].toUpperCase()}
      </div>
      <div className="card-title">
        {step === 1 ? 'Create your account' : step === 2 ? 'Secure your account' : 'Verify your email'}
      </div>
      <div className="card-sub">
        {step === 1
          ? 'Join thousands of learners on LearnVerse'
          : step === 2
          ? 'Set a strong password to protect your account'
          : `We sent a 6-digit code to ${email}`}
      </div>

      {errors.general && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          background: 'rgba(240,32,121,.08)', border: '1px solid rgba(240,32,121,.2)',
          fontSize: '.8rem', color: '#f02079', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>⚠</span>{errors.general}
        </div>
      )}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div>
          <div className="field-wrap">
            <div className="field-label"><span>Full Name</span></div>
            <div className="field-box">
              <span className="field-icon">👤</span>
              <input
                className={`field-input${errors.name ? ' error' : name.length > 2 ? ' success' : ''}`}
                type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)} autoComplete="name"
              />
              <div className="field-focus-line" />
            </div>
            {errors.name && <div className="field-hint error"><span>⚠</span> {errors.name}</div>}
          </div>

          <div className="field-wrap">
            <div className="field-label"><span>Email Address</span></div>
            <div className="field-box">
              <span className="field-icon">✉</span>
              <input
                className={`field-input${errors.email ? ' error' : email.includes('@') ? ' success' : ''}`}
                type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
              />
              <div className="field-focus-line" />
            </div>
            {errors.email && <div className="field-hint error"><span>⚠</span> {errors.email}</div>}
          </div>

          <div className="field-wrap">
            <div className="field-label"><span>Phone (Optional)</span></div>
            <div className="field-box">
              <span className="field-icon">📱</span>
              <input
                className="field-input" type="tel" placeholder="+91 98765 43210"
                value={phone} onChange={e => setPhone(e.target.value)}
              />
              <div className="field-focus-line" />
            </div>
          </div>

          <div className="social-row" style={{ marginBottom: 20 }}>
            <button className="social-btn" type="button" style={{ width:'100%', justifyContent:'center' }}
              onClick={() => window.location.href = `${API_BASE}/api/auth/google`}>
              <span style={{
                width: 20, height: 20, borderRadius: 4, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </span>
              Google
            </button>

          </div>

          <button className="btn-cta" type="button" onClick={nextStep}>Continue →</button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div>
          <div className="field-wrap">
            <div className="field-label"><span>Password</span></div>
            <div className="field-box">
              <span className="field-icon">🔒</span>
              <input
                className={`field-input${errors.pwd ? ' error' : ''}`}
                type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters"
                value={pwd} onChange={e => setPwd(e.target.value)} autoComplete="new-password"
              />
              <div className="field-focus-line" />
              <button className="field-suffix-btn" type="button" onClick={() => setShowPwd(s => !s)}>
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
            {errors.pwd && <div className="field-hint error"><span>⚠</span> {errors.pwd}</div>}
          </div>

          {pwd && (
            <div className="pwd-strength" style={{ marginTop: -8, marginBottom: 16 }}>
              <div className="pwd-bars">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className="pwd-bar"
                    style={{ background: n <= strength.score ? strength.color : 'rgba(255,255,255,.08)' }} />
                ))}
              </div>
              <div className="pwd-label" style={{ color: strength.color }}>{strength.label} password</div>
            </div>
          )}

          <div className="field-wrap">
            <div className="field-label"><span>Confirm Password</span></div>
            <div className="field-box">
              <span className="field-icon">🔒</span>
              <input
                className={`field-input${errors.confirm ? ' error' : confirm && confirm === pwd ? ' success' : ''}`}
                type={showCfm ? 'text' : 'password'} placeholder="Repeat your password"
                value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password"
              />
              <div className="field-focus-line" />
              <button className="field-suffix-btn" type="button" onClick={() => setShowCfm(s => !s)}>
                {showCfm ? '🙈' : '👁'}
              </button>
            </div>
            {errors.confirm && <div className="field-hint error"><span>⚠</span> {errors.confirm}</div>}
          </div>

          {/* Requirements */}
          <div style={{
            padding: '12px 14px', borderRadius: 12, marginBottom: 16,
            background: 'rgba(124,47,255,.06)', border: '1px solid rgba(124,47,255,.14)', fontSize: '.8rem',
          }}>
            {[
              { t: 'At least 8 characters',  ok: pwd.length >= 8 },
              { t: 'Uppercase letter',        ok: /[A-Z]/.test(pwd) },
              { t: 'Number',                  ok: /[0-9]/.test(pwd) },
              { t: 'Special character',       ok: /[^A-Za-z0-9]/.test(pwd) },
            ].map(({ t, ok }) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, color: ok ? '#00d97e' : '#6b5b8e' }}>
                <span style={{ fontSize: '.75rem' }}>{ok ? '✓' : '○'}</span>{t}
              </div>
            ))}
          </div>

          {/* Terms */}
          <div className="agree-row">
            <div className={`checkbox${agreed ? ' checked' : ''}`} onClick={() => setAgreed(a => !a)} />
            <div className="agree-text">
              I agree to LearnVerse's <a href="#terms" onClick={e => e.preventDefault()}>Terms of Service</a> and{' '}
              <a href="#privacy" onClick={e => e.preventDefault()}>Privacy Policy</a>.
              {errors.agreed && <div style={{ color: '#f02079', marginTop: 4, fontSize: '.74rem' }}>⚠ {errors.agreed}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn-outline" type="button" onClick={() => setStep(1)} style={{ width: 'auto', flexShrink: 0, padding: '12px 20px' }}>← Back</button>
            <button className="btn-cta" type="button" onClick={nextStep} disabled={loading} style={{ flex: 1 }}>
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin .65s linear infinite', display: 'inline-block',
                  }} />
                  {' '}Creating account…
                </>
              ) : 'Create Account →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 — OTP ── */}
      {step === 3 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'rgba(124,47,255,.12)', border: '1px solid rgba(124,47,255,.25)',
              display: 'grid', placeItems: 'center', margin: '0 auto 16px', fontSize: '1.6rem',
            }}>📧</div>
            <div style={{ fontSize: '.84rem', color: '#6b5b8e', lineHeight: 1.65, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              Check <span style={{ color: '#ede8ff', fontWeight: 600 }}>{email}</span> for your verification code.
              <br />It expires in <span style={{ color: '#f02079', fontWeight: 700 }}>10 minutes</span>.
            </div>
          </div>

          <div className="otp-inputs" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            {otp.map((v, i) => (
              <input
                key={i} ref={el => otpRefs.current[i] = el}
                className="otp-input" type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={e => handleOtp(e.target.value, i)}
                onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) otpRefs.current[i - 1]?.focus(); }}
                style={{ borderColor: v ? 'rgba(124,47,255,.4)' : 'rgba(255,255,255,.1)' }}
              />
            ))}
          </div>

          {errors.otp && (
            <div style={{ textAlign: 'center', fontSize: '.8rem', color: '#f02079', marginBottom: 12 }}>
              ⚠ {errors.otp}
            </div>
          )}

          <button className="btn-cta" type="button" onClick={nextStep} disabled={loading} style={{ marginBottom: 14 }}>
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, border: '2.5px solid rgba(255,255,255,.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin .65s linear infinite', display: 'inline-block',
                }} />
                {' '}Verifying…
              </>
            ) : 'Verify & Complete Setup ✓'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '.8rem', color: '#6b5b8e' }}>
            Didn't receive it?{' '}
            {countdown > 0 ? (
              <span style={{ color: '#6b5b8e' }}>Resend in <strong style={{ color: '#8b5cf6' }}>{countdown}s</strong></span>
            ) : (
              <a style={{ color: resending ? '#6b5b8e' : '#8b5cf6', cursor: resending ? 'default' : 'pointer', fontWeight: 600 }}
                onClick={async () => {
                  if (resending || countdown > 0) return;
                  setResending(true);
                  try {
                    await authAPI.sendOtp(email);
                    setOtp(['', '', '', '', '', '']);
                    otpRefs.current[0]?.focus();
                    setCountdown(60);
                  } catch (_) {}
                  setResending(false);
                }}>
                {resending ? 'Sending…' : 'Resend code'}
              </a>
            )}
            <span style={{ margin: '0 8px', color: '#1a1540' }}>·</span>
            <a style={{ color: '#8b5cf6', cursor: 'pointer' }} onClick={() => setStep(1)}>Wrong email?</a>
          </div>

          <button className="btn-outline" type="button" onClick={() => setStep(2)} style={{ marginTop: 12, width: '100%' }}>
            ← Change Password
          </button>
        </div>
      )}

      <div className="card-footer">
        Already have an account? <a onClick={switchToLogin}>Sign in</a>
      </div>
    </div>
  );
}

export default RegisterForm;
