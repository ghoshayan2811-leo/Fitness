import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  deleteAccount: () => api.delete('/auth/account')
};

export const aiAPI = {
  generateTrialPlan: (data) => api.post('/ai/trial', data),
  generatePlan: (data) => api.post('/ai/generate-plan', data),
  generateDiet: (data) => api.post('/ai/diet-suggestion', data),
  getPlans: () => api.get('/ai/plans'),
  getPlan: (id) => api.get(`/ai/plans/${id}`),
  deletePlan: (id) => api.delete(`/ai/plans/${id}`)
};

export default api;
