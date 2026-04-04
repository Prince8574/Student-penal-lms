import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// ─── Browser Console Logger ──────────────────────────────
const clog = (type, action, msg, data = null) => {
  const cfg = {
    INFO:    { bg: '#1e1b4b', color: '#a78bfa', icon: 'ℹ️' },
    SUCCESS: { bg: '#052e16', color: '#4ade80', icon: '✅' },
    WARN:    { bg: '#2d1b00', color: '#fbbf24', icon: '⚠️' },
    ERROR:   { bg: '#2d0a0a', color: '#f87171', icon: '❌' },
  };
  const { bg, color, icon } = cfg[type] || cfg.INFO;
  const ts = new Date().toLocaleTimeString();
  console.log(
    `%c ${icon} %c [AUTH] %c ${action} %c ${msg} %c ${ts}`,
    `background:${bg};color:${color};font-weight:900;padding:3px 6px;border-radius:4px 0 0 4px`,
    `background:#0f172a;color:#7c3aed;font-weight:700;padding:3px 6px`,
    `background:#1e293b;color:${color};font-weight:700;padding:3px 8px`,
    `background:#0f172a;color:#e2e8f0;padding:3px 8px`,
    `background:#0f172a;color:#475569;font-size:0.75em;padding:3px 6px;border-radius:0 4px 4px 0`
  );
  if (data) console.log('%c   ↳', 'color:#475569', data);
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (data) => {
    clog('INFO', 'REGISTER', `Registering account for ${data.email}`);
    return api.post('/auth/register', data).then(res => {
      if (res.data?.success) clog('SUCCESS', 'REGISTER', `Account created — verify your email`, { email: data.email });
      else clog('WARN', 'REGISTER', res.data?.message || 'Registration failed');
      return res;
    }).catch(err => {
      clog('ERROR', 'REGISTER', err.response?.data?.message || 'Network error');
      throw err;
    });
  },

  login: (data) => {
    clog('INFO', 'LOGIN', `Login attempt for ${data.email}`);
    return api.post('/auth/login', data).then(res => {
      if (res.data?.success) clog('SUCCESS', 'LOGIN', `Credentials verified — OTP step`);
      else clog('WARN', 'LOGIN', res.data?.message || 'Login failed');
      return res;
    }).catch(err => {
      clog('ERROR', 'LOGIN', err.response?.data?.message || 'Network error');
      throw err;
    });
  },

  logout: () => {
    clog('INFO', 'LOGOUT', 'Session ended');
    return api.get('/auth/logout');
  },

  getMe: () => api.get('/auth/me'),

  forgotPassword: (email) => {
    clog('INFO', 'FORGOT-PWD', `Password reset requested for ${email}`);
    return api.post('/auth/forgot-password', { email }).then(res => {
      if (res.data?.success) clog('SUCCESS', 'FORGOT-PWD', 'Reset OTP sent to email');
      else clog('WARN', 'FORGOT-PWD', res.data?.message);
      return res;
    });
  },

  sendOtp: (email, purpose) => {
    clog('INFO', 'SEND-OTP', `Sending OTP to ${email}`, { purpose });
    return api.post('/auth/send-otp', { email, purpose }).then(res => {
      if (res.data?.success) clog('SUCCESS', 'SEND-OTP', 'OTP sent successfully');
      else clog('WARN', 'SEND-OTP', res.data?.message);
      return res;
    }).catch(err => {
      clog('ERROR', 'SEND-OTP', err.response?.data?.message || 'Failed to send OTP');
      throw err;
    });
  },

  verifyOtp: (email, otp, purpose) => {
    clog('INFO', 'VERIFY-OTP', `Verifying OTP for ${email}`, { purpose });
    return api.post('/auth/verify-otp', { email, otp, purpose }).then(res => {
      if (res.data?.success) clog('SUCCESS', 'VERIFY-OTP', `OTP verified — ${purpose === 'login' ? 'Login successful' : 'Proceeding'}`);
      else clog('WARN', 'VERIFY-OTP', res.data?.message || 'Invalid OTP');
      return res;
    }).catch(err => {
      clog('ERROR', 'VERIFY-OTP', err.response?.data?.message || 'Verification failed');
      throw err;
    });
  },

  resetPassword: (token, newPassword) => {
    clog('INFO', 'RESET-PWD', 'Submitting new password');
    return api.post('/auth/reset-password', { token, newPassword }).then(res => {
      if (res.data?.success) clog('SUCCESS', 'RESET-PWD', 'Password reset successfully');
      else clog('WARN', 'RESET-PWD', res.data?.message);
      return res;
    });
  },
};

// ─── User / Profile ──────────────────────────────────────
export const userAPI = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addWishlist:   (id)   => api.post(`/users/wishlist/${id}`),
  removeWishlist:(id)   => api.delete(`/users/wishlist/${id}`),
  getWishlist:   ()     => api.get('/users/wishlist'),
};

// ─── Courses ─────────────────────────────────────────────
export const courseAPI = {
  getAll:    (params) => api.get('/courses', { params }),
  getOne:    (id)     => api.get(`/courses/${id}`),
  getMyCourses: ()    => api.get('/courses/my-courses'),
  addReview: (id, data) => api.post(`/courses/${id}/reviews`, data),
};

// ─── Enrollments ─────────────────────────────────────────
export const enrollmentAPI = {
  enroll:         (courseId, paymentData) => api.post(`/enrollments/${courseId}`, paymentData || {}),
  getMyEnrollments: ()             => api.get('/enrollments/my-courses'),
  getEnrollment:  (courseId)       => api.get(`/enrollments/course/${courseId}`),
  updateProgress: (enrollmentId, data) => api.put(`/enrollments/${enrollmentId}/progress`, data),
  updateLesson:   (enrollmentId, data) => api.put(`/enrollments/${enrollmentId}/lesson`, data),
  completeCourse: (enrollmentId)   => api.put(`/enrollments/${enrollmentId}/complete`),
};

// ─── Payments ────────────────────────────────────────────
export const paymentAPI = {
  checkout:      (courseId, data) => api.post(`/payments/checkout/${courseId}`, data),
  getMyHistory:  ()               => api.get('/payments/my-history'),
  getPayment:    (orderId)        => api.get(`/payments/${orderId}`),
};

// ─── Assignments ─────────────────────────────────────────
export const assignmentAPI = {
  getAll:   ()   => api.get('/assignments'),
  getOne:   (id) => api.get(`/assignments/${id}`),
  // Instructor
  create:   (data)       => api.post('/assignments', data),
  update:   (id, data)   => api.put(`/assignments/${id}`, data),
  remove:   (id)         => api.delete(`/assignments/${id}`),
  getSubmissions: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
};

// ─── Submissions ─────────────────────────────────────────
export const submissionAPI = {
  submit:  (assignmentId, formData) =>
    api.post(`/submissions/${assignmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getMine: (assignmentId) => api.get(`/submissions/my/${assignmentId}`),
  // Instructor
  grade:   (id, data)    => api.put(`/submissions/${id}/grade`, data),
  getForAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
};

// ─── Settings ────────────────────────────────────────────
export const settingsAPI = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export default api;
