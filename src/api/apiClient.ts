import axios from 'axios';
import { tokenStorage } from '../save/tokenStorage';

const API_URL = 'https://backend-todo-kolpakov.vercel.app';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
