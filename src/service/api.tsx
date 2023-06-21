import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-76cb.up.railway.app',
});

export default api;
