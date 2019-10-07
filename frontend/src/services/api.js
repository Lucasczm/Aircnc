import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ADDRESS
});

api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('user');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default api;
