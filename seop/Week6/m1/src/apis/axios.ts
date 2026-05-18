import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터 - 토큰 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도한 적 없으면
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 무한 루프 방지 플래그
      originalRequest._retry = true;

      // 이미 리프레시 중이면 해당 Promise 재사용
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

            const { data } = await axiosInstance.post('/auth/refresh', {
              refresh: refreshToken,
            });

            // 새 토큰 저장
            const { setItem: setAccessToken } = useLocalStorageOutside(LOCAL_STORAGE_KEY.accessToken);
            setAccessToken(data.data.accessToken);

            return data.data.accessToken;
          } catch (refreshError) {
            // 리프레시 실패 시 로그아웃 처리
            const { removeItem: removeAccessToken } = useLocalStorageOutside(LOCAL_STORAGE_KEY.accessToken);
            const { removeItem: removeRefreshToken } = useLocalStorageOutside(LOCAL_STORAGE_KEY.refreshToken);
            removeAccessToken();
            removeRefreshToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

let refreshPromise: Promise<string> | null = null;

// localStorage 훅 없이 직접 사용하는 헬퍼
const useLocalStorageOutside = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, removeItem };
};