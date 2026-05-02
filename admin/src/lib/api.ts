import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');
  return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
};

export default api;
