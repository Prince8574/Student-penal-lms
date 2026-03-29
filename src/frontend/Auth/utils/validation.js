export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '');
  return cleaned.length >= 10;
};

export const checkPasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels = [
    { label: '⚠ Weak password', color: '#f87171' },
    { label: '⚠ Weak password', color: '#f87171' },
    { label: '🔶 Could be stronger', color: '#fb923c' },
    { label: '✓ Good password', color: '#a3e635' },
    { label: '✅ Strong password!', color: '#4ade80' }
  ];

  return {
    score,
    ...labels[score]
  };
};
