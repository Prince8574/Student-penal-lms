import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

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
  register:       (data)          => api.post('/auth/register', data),
  login:          (data)          => api.post('/auth/login', data),
  logout:         ()              => api.get('/auth/logout'),
  getMe:          ()              => api.get('/auth/me'),
  forgotPassword: (email)         => api.post('/auth/forgot-password', { email }),
  sendOtp:        (email, purpose)  => api.post('/auth/send-otp', { email, purpose }),
  verifyOtp:      (email, otp, purpose)    => api.post('/auth/verify-otp', { email, otp, purpose }),
  resetPassword:  (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
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
