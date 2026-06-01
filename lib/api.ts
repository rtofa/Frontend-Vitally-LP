import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // CORREÇÃO: Usando a chave exata que o auth.ts utiliza para salvar o token
    const token = typeof window !== 'undefined' ? localStorage.getItem('vitally_token') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        localStorage.removeItem('vitally_token');
        document.cookie = `vitally_token=; Path=/; Max-Age=0; SameSite=Lax`;
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;