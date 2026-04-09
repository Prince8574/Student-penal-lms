const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5001';

export const API_URL = `${API_BASE}/api`;
export default API_BASE;
