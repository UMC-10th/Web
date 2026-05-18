import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL || "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config as CustomAxiosRequestConfig;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/v1/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/v1/auth/refresh`, {
            refreshToken: localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN),
          })
          .then(({ data }) => {
            const { accessToken: newAccess, refreshToken: newRefresh } = data.data;
            localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccess);
            localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, newRefresh);
            return newAccess;
          })
          .catch((refreshErr) => {
            localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            window.location.href = "/login";
            return Promise.reject(refreshErr);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(err);
  }
);
