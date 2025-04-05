import axios from 'axios';

const api = axios.create({
  baseURL: 'https://billing-backend-ss94.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
