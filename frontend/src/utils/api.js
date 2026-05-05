import axios from 'axios';

// Works with CRA proxy, Vite proxy, or direct URL
const BASE_URL = process.env.REACT_APP_API_URL
  || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
  || '/api';   // ← relative path: works with both CRA proxy AND Vite proxy

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const userId = localStorage.getItem('interviewai_userId');
  if (userId) config.headers['x-user-id'] = userId;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    // Surface the backend's validation details if present
    const backendMsg = err.response?.data?.details || err.response?.data?.error;
    const message = backendMsg || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const analysisApi = {
  submit: (data) => api.post('/analysis/submit', data),
  retry:  (data) => api.post('/analysis/retry',  data),
  getQuestions: (mode) => api.get(`/analysis/questions?mode=${mode}`)
};

export const sessionsApi = {
  getAll:   (userId)    => api.get(`/sessions/${userId}`),
  getStats: (userId)    => api.get(`/sessions/stats/${userId}`),
  getDetail:(sessionId) => api.get(`/sessions/detail/${sessionId}`),
  delete:   (sessionId) => api.delete(`/sessions/${sessionId}`)
};

export const usersApi = {
  create: (name) => api.post('/users/create', { name }),
  get:    (userId) => api.get(`/users/${userId}`)
};

export default api;
