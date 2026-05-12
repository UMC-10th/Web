import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});