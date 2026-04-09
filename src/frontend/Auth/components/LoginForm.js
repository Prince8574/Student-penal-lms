import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authAPI } from '../../../services/api';
import API_BASE from '../../../config/api';

function LoginForm({ onSuccess, switchToRegister, switchToForgot }) {
  const navigate = useNavigate();
  const { login, loginWithToken } = useAuth();

  const [step, setStep]           = useState(1); // 1=credentials, 2=otp
  const [email, setEmail]         = useState('');
  const [pwd, setPwd]             = useState('');
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [err, setErr]             = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const otpRefs                   = useRef([]);
  const timerRef                  = useRef(null);

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  // Step 1 — verify credentials then send OTP
  const submitCredentials = async (e) => {
    e && e.preventDefault();
    setErr('');
    if (!email || !pwd)       { setErr('Please fill in all fields.'); return; }
    if (!email.includes('@')) { setErr('Enter a valid email address.'); return; }

    setLoading(true);
    try {
      const result = await login(email, pwd);
      if (!result.success) { setErr(result.message || 'Invalid credentials.'); return; }

      // Send OTP after credentials verified
      await authAPI.sendOtp(email, 'login');
      setStep(2);
      setCountdown(60);
    } catch {
      setErr('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP then navigate
  const submitOtp = async () => {
    setErr('');
    const code = otp.join('');
    if (code.length < 6) { setErr('Enter the complete 6-digit code.'); return; }
    setLoading(true);
    try {
      const res = await authAPI.verifyOtp(email, code, 'login');
      if (res.data?.success) {
        if (res.data.token) await loginWithToken(res.data.token);
        onSuccess('login');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setErr(res.data?.message || 'Invalid or expired OTP.');
      }
    } catch (e) {
      setErr(e.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setErr('');
    setResending(true);
    try {
      await authAPI.sendOtp(email, 'login');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      setCountdown(60);
    } catch {
      setErr('Failed to resend. Try again.');
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (val, i) => {
    const v = val.replace(/\D/, '').slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div>
      {/* Eyebrow */}
      <div className="card-eyebrow">
        <div className="eyebrow-dot" />
        {step === 1 ? 'WELCOME BACK' : 'VERIFY YOUR IDENTITY'}
      </div>
      <div className="card-title">
        {step === 1 ? 'Sign in to your account' : 'Enter verification code'}
      </div>
      <div className="card-sub">
        {step === 1 ? 'Continue your learning journey' : `Code sent to ${email}`}
      </div>

      {/* ── Step 1: Credentials ── */}
      {step === 1 && (
        <>
          <div className="social-row">
            <button className="social-btn" type="button" style={{width:'100%',justifyContent:'center'}}
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

          <div className="or-divider">
            <div className="or-line" />
            <div className="or-text">OR CONTINUE WITH EMAIL</div>
            <div className="or-line" />
          </div>

          <form onSubmit={submitCredentials}>
            <div className="field-wrap">
              <div className="field-label"><span>Email Address</span></div>
              <div className="field-box">
                <span className="field-icon">✉</span>
                <input
                  className={`field-input${err && !email ? ' error' : email.includes('@') ? ' success' : ''}`}
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <div className="field-focus-line" />
              </div>
            </div>

            <div className="field-wrap">
              <div className="field-label">
                <span>Password</span>
                <a onClick={switchToForgot} style={{ cursor: 'pointer' }}>Forgot password?</a>
              </div>
              <div className="field-box">
                <span className="field-icon">🔒</span>
                <input
                  className={`field-input${err && !pwd ? ' error' : ''}`}
                  type={showPwd ? 'text' : 'password'} placeholder="••••••••••"
                  value={pwd} onChange={e => setPwd(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="field-focus-line" />
                <button className="field-suffix-btn" type="button" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {err && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(240,32,121,.08)', border: '1px solid rgba(240,32,121,.2)',
                fontSize: '.8rem', color: '#f02079', display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span>⚠</span>{err}
              </div>
            )}

            <button className="btn-cta" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span style={{
                    width: 18, height: 18, border: '2.5px solid rgba(255,255,255,.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin .65s linear infinite', display: 'inline-block'
                  }} />
                  Sending OTP…
                </>
              ) : 'Continue →'}
            </button>
          </form>
        </>
      )}

      {/* ── Step 2: OTP ── */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(124,47,255,.12)', border: '1px solid rgba(124,47,255,.25)',
              display: 'grid', placeItems: 'center', margin: '0 auto 14px', fontSize: '1.4rem'
            }}>🔐</div>
            <div style={{ fontSize: '.84rem', color: 'var(--t2, #aaa)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              Check <strong>{email}</strong> for the code
            </div>
          </div>

          <div className="otp-inputs" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {otp.map((v, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                className="otp-input"
                type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={e => handleOtpChange(e.target.value, i)}
                onKeyDown={e => handleOtpKeyDown(e, i)}
              />
            ))}
          </div>

          {err && (
            <div style={{
              textAlign: 'center', fontSize: '.8rem', color: '#f02079', marginBottom: 12
            }}>⚠ {err}</div>
          )}

          <button className="btn-cta" onClick={submitOtp} disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, border: '2.5px solid rgba(255,255,255,.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin .65s linear infinite', display: 'inline-block'
                }} />
                Verifying…
              </>
            ) : 'Sign In → Dashboard'}
          </button>

          {/* Resend */}
          <div style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--t2, #aaa)' }}>
            Didn't get it?{' '}
            {countdown > 0 ? (
              <span>Resend in <strong style={{ color: '#7c2fff' }}>{countdown}s</strong></span>
            ) : (
              <a
                style={{ color: resending ? '#aaa' : '#7c2fff', cursor: resending ? 'default' : 'pointer', fontWeight: 600 }}
                onClick={handleResend}
              >
                {resending ? 'Sending…' : 'Resend OTP'}
              </a>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 10, fontSize: '.8rem' }}>
            <a
              style={{ color: '#aaa', cursor: 'pointer' }}
              onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setErr(''); }}
            >
              ← Back to login
            </a>
          </div>
        </div>
      )}

      <div className="card-footer">
        Don't have an account? <a onClick={switchToRegister}>Create one free</a>
      </div>
    </div>
  );
}

export default LoginForm;
