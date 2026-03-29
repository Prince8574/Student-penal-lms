import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';
import SuccessState from './SuccessState';

function RightPanel({ activeTab, setActiveTab }) {
  const [mode, setMode] = React.useState(activeTab || 'login');
  const [successType, setSuccessType] = React.useState('');

  // sync with URL-driven tab changes
  React.useEffect(() => {
    setMode(activeTab);
  }, [activeTab]);

  const handleSuccess = (type) => {
    setSuccessType(type);
    setMode('success');
  };

  return (
    <div className="right-panel">
      <div className="auth-card" id="auth-card">
        {mode === 'success' ? (
          <SuccessState
            type={successType}
            onContinue={() => { setMode('login'); setActiveTab('login'); }}
          />
        ) : mode === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            switchToRegister={() => { setMode('register'); setActiveTab('register'); }}
            switchToForgot={() => setMode('forgot')}
          />
        ) : mode === 'register' ? (
          <RegisterForm
            onSuccess={handleSuccess}
            switchToLogin={() => { setMode('login'); setActiveTab('login'); }}
          />
        ) : (
          <ForgotPassword
            onSuccess={handleSuccess}
            switchToLogin={() => { setMode('login'); setActiveTab('login'); }}
          />
        )}
      </div>
    </div>
  );
}

export default RightPanel;
