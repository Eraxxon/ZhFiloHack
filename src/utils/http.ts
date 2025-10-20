import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: false,
  timeout: 15000
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `JWT ${token}`
    };
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const http = instance;


