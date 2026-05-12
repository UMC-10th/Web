import axios, { type InternalAxiosRequestConfig } from 'axios';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '../utils/auth';

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

const API_BASE_URL = 'http://localhost:8000/v1';

let refreshPromise: Promise<TokenResponse> | null = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token is missing.');
  }

  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refresh: refreshToken,
  });

  const nextTokens = data.data ?? data;
  const tokens = {
    accessToken: nextTokens.accessToken,
    refreshToken: nextTokens.refreshToken,
  };

  setAuthTokens(tokens);
  return tokens;
};

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken();
      const tokens = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default axiosInstance;
