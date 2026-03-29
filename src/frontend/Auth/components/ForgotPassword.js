import React, { useState, useRef, useEffect } from 'react';
import { validateEmail } from '../utils/validation';
import { authAPI } from '../../../services/api';

function ForgotPassword({ onSuccess, switchToLogin }) {
  const [step, setStep]               = useState(1);
  const [email, setEmail]             = useState('');
  const [otp, setOtp]                 = useState(['', '', '', '', '', '']);
  const [otpToken, setOtpToken]       = useState('');
  const [pwd, setPwd]                 = useState('');
  const [confirm, setConfirm]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [resending, setResending]     = useState(false);
  const [countdown, setCountdown]     = useState(0);
  const [err, setErr]                 = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const otpRefs  = useRef([]);
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  const nextStep = async () => {
    setErr('');

    // Step 1 — send OTP
    if (step === 1) {
      if (!validateEmail(email)) { setErr('Enter a valid email address'); return; }
      setLoading(true);
      try {
        const res = await authAPI.sendOtp(email);
        if (res.data.success) {
          setStep(2);
          setCountdown(60);
        } else {
          setErr(res.data.message || 'Failed to send OTP');
        }
      } catch (e) {
        setErr(e.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }

    // Step 2 — verify OTP
    } else if (step === 2) {
      if (otp.join('').length < 6) { setErr('Enter the complete 6-digit code'); return; }
      setLoading(true);
      try {
        const res = await authAPI.verifyOtp(email, otp.join(''), 'forgot-password');
        if (res.data.success) {
          setOtpToken(res.data.token);
          setStep(3);
        } else {
          setErr(res.data.message || 'Invalid OTP');
        }
      } catch (e) {
        setErr(e.response?.data?.message || 'Invalid or expired OTP');
      } finally {
        setLoading(false);
      }

    // Step 3 — reset password
    } else {
      if (pwd.length < 8)  { setErr('Password must be at least 8 characters'); return; }
      if (pwd !== confirm) { setErr("Passwords don't match"); return; }
      setLoading(true);
      try {
        const res = await authAPI.resetPassword(otpToken, pwd);
        if (res.data.success) {
          onSuccess('forgot');
        } else {
          setErr(res.data.message || 'Reset failed');
        }
      } catch (e) {
        setErr(e.response?.data?.message || 'Reset failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setErr('');
    setResending(true);
    try {
      await authAPI.sendOtp(email);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      setCountdown(60);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleOtp = (val, i) => {
    const v = val.replace(/\D/, '').slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
    if (!v && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const STEPS = ['Email', 'Verify', 'New Password'];

  return (
    <div>
      <div className="step-bar">
        {STEPS.map((_, i) => (
          <div key={i} className={`step-seg${i + 1 === step ? ' active' : i + 1 < step ? ' done' : ''}`} />
        ))}
      </div>

      <div className="card-eyebrow"><div className="eyebrow-dot" /> PASSWORD RESET</div>
      <div className="card-title">
        {step === 1 ? 'Forgot your password?' : step === 2 ? 'Enter verification code' : 'Set new password'}
      </div>
      <div className="card-sub">
        {step === 1 ? "No worries — we'll send you a reset code instantly"
          : step === 2 ? `Check ${email} for the 6-digit code`
          : 'Choose a strong new password'}
      </div>

      {/* STEP 1 — Email */}
      {step === 1 && (
        <div>
          <div className="field-wrap">
            <div className="field-label"><span>Email Address</span></div>
            <div className="field-box">
              <span className="field-icon">✉</span>
              <input
                className={`field-input${err ? ' error' : ''}`}
                type="email" placeholder="your@email.com"
                value={email} onChange={e => { setEmail(e.target.value); setErr(''); }}
              />
              <div className="field-focus-line" />
            </div>
            {err && <div className="field-hint error"><span>⚠</span> {err}</div>}
          </div>
          <button className="btn-cta" type="button" onClick={nextStep} disabled={loading} style={{ marginBottom: 12 }}>
            {loading
              ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite', display: 'inline-block' }} /> Sending…</>
              : 'Send Reset Code →'}
          </button>
          <button className="btn-outline" type="button" onClick={switchToLogin} style={{ width: '100%' }}>← Back to Sign In</button>
        </div>
      )}

      {/* STEP 2 — OTP */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '.84rem', color: '#6b5b8e' }}>
            Code sent to <strong style={{ color: '#ede8ff' }}>{email}</strong>
          </div>
          <div className="otp-inputs" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            {otp.map((v, i) => (
              <input
                key={i} ref={el => otpRefs.current[i] = el}
                className={`otp-input${v ? ' filled' : ''}`}
                type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={e => handleOtp(e.target.value, i)}
                onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) otpRefs.current[i - 1]?.focus(); }}
              />
            ))}
          </div>
          {err && <div style={{ textAlign: 'center', fontSize: '.8rem', color: '#f02079', marginBottom: 12 }}>⚠ {err}</div>}
          <button className="btn-cta" type="button" onClick={nextStep} disabled={loading} style={{ marginBottom: 12 }}>
            {loading
              ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite', display: 'inline-block' }} /> Verifying…</>
              : 'Verify Code →'}
          </button>

          {/* Resend with countdown */}
          <div style={{ textAlign: 'center', fontSize: '.8rem', color: '#6b5b8e' }}>
            Didn't get it?{' '}
            {countdown > 0
              ? <span>Resend in <strong style={{ color: '#8b5cf6' }}>{countdown}s</strong></span>
              : <a style={{ color: resending ? '#6b5b8e' : '#8b5cf6', cursor: resending ? 'default' : 'pointer', fontWeight: 600 }} onClick={handleResend}>
                  {resending ? 'Sending…' : 'Resend OTP'}
                </a>
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: '.8rem' }}>
            <a style={{ color: '#6b5b8e', cursor: 'pointer' }} onClick={() => { setStep(1); setOtp(['','','','','','']); setErr(''); }}>← Change email</a>
          </div>
        </div>
      )}

      {/* STEP 3 — New Password */}
      {step === 3 && (
        <div>
          <div className="field-wrap">
            <div className="field-label"><span>New Password</span></div>
            <div className="field-box">
              <span className="field-icon">🔒</span>
              <input
                className={`field-input${err ? ' error' : ''}`}
                type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters"
                value={pwd} onChange={e => setPwd(e.target.value)}
              />
              <div className="field-focus-line" />
              <button className="field-suffix-btn" type="button" onClick={() => setShowPwd(s => !s)}>
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div className="field-wrap">
            <div className="field-label"><span>Confirm Password</span></div>
            <div className="field-box">
              <span className="field-icon">🔒</span>
              <input
                className={`field-input${err && pwd !== confirm ? ' error' : confirm && confirm === pwd ? ' success' : ''}`}
                type={showConfirm ? 'text' : 'password'} placeholder="Repeat password"
                value={confirm} onChange={e => setConfirm(e.target.value)}
              />
              <div className="field-focus-line" />
              <button className="field-suffix-btn" type="button" onClick={() => setShowConfirm(s => !s)}>
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          {err && (
            <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 14, background: 'rgba(240,32,121,.08)', border: '1px solid rgba(240,32,121,.2)', fontSize: '.8rem', color: '#f02079' }}>
              ⚠ {err}
            </div>
          )}
          <button className="btn-cta" type="button" onClick={nextStep} disabled={loading} style={{ marginBottom: 12 }}>
            {loading
              ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite', display: 'inline-block' }} /> Updating…</>
              : 'Reset Password ✓'}
          </button>
        </div>
      )}

      <div className="switch-text" style={{ marginTop: 20, textAlign: 'center', fontSize: '.82rem', color: '#6b5b8e' }}>
        Remembered it? <a className="switch-link" onClick={switchToLogin}>Back to Sign In</a>
      </div>
    </div>
  );
}

export default ForgotPassword;
