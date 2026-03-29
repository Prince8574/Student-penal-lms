import React, { useState, useRef, useEffect } from 'react';

function OTPVerification({ email, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      alert('Please enter all 6 digits');
      return;
    }
    
    // Verify OTP
    setTimeout(() => {
      alert('✅ Password reset successful!');
      onBack();
    }, 1500);
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="otp-section show">
      <div className="otp-icon">📧</div>
      <h2 className="form-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
        Check your <em>inbox</em>
      </h2>
      <p className="otp-desc">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to reset your password.
      </p>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            className={`otp-input ${digit ? 'filled' : ''}`}
            maxLength="1"
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <div className="resend-row">
        Didn't receive it?{' '}
        {canResend ? (
          <button className="resend-btn" onClick={handleResend}>
            Resend Code
          </button>
        ) : (
          <span className="resend-timer">Resend in {timer}s</span>
        )}
      </div>

      <button className="submit-btn" onClick={handleVerify}>
        <span className="btn-text">Verify Code →</span>
        <div className="btn-spinner">
          <div className="spinner-ring"></div>
        </div>
      </button>

      <button className="back-to-login" onClick={onBack} style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
        ← Back
      </button>
    </div>
  );
}

export default OTPVerification;
