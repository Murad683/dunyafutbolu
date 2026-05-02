import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');
  return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
};

// Request interceptor — log outgoing requests
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error.message);
    return Promise.reject(error);
  },
);

// Response interceptor — log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 'NETWORK_ERROR';
    const url = error.config?.url ?? 'unknown';
    console.error(`[API] ${status} on ${url}:`, error.message);
    return Promise.reject(error);
  },
);
