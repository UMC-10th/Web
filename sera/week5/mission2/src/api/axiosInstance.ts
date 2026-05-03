import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// _retry 플래그를 위한 타입 확장
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
});

// 요청 인터셉터: 모든 요청에 accessToken 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('tokens');
  if (stored) {
    const { accessToken } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 발생 시 refreshToken으로 재발급 후 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig;

    // 401이고 아직 재시도 안 한 경우에만 갱신 시도 (무한 루프 방지)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const stored = localStorage.getItem('tokens');
      if (!stored) return Promise.reject(error);

      const { refreshToken } = JSON.parse(stored);

      try {
        const { data } = await axios.post('http://localhost:8000/v1/auth/refresh', {
          refresh: refreshToken,
        });

        const newTokens = {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        };

        // 새 토큰 localStorage에 저장
        localStorage.setItem('tokens', JSON.stringify(newTokens));

        // 실패했던 요청 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        // refresh도 실패하면 로그아웃 처리
        localStorage.removeItem('tokens');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
