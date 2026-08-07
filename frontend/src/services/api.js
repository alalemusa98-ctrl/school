import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT Bearer Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('school_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle session expiration
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    // If unauthorized, clear token and redirect to login if not already on login
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('school_token');
      localStorage.removeItem('school_user');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
