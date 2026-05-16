import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요펑의 Promise를 저장해서 중복 요청을 방지한다.
let refreshPromise: Promise<string> | null = null;

// plain client for token refresh to avoid interceptor recursion
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
  },
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다.
axiosInstance.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem(); // localStorage에서 accessToken을 가져온다.

    // accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가한다.
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 수정된 요청 설정을 반환합니다.
    return config;
  },

  //요청 인터셉터가 실패하면 에러 발생
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신을 처리합니다.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    //401 에러면서, 아직 재시도 하지 않은 요청 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 엔드포인트에ㅓㅅ 401 에러가 발생한 경우 (Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리.
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken,
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken,
        );
        removeAccessToken();
        removeRefreshToken();

        window.location.href = "/login";

        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 이미 리프레시 요청이 진행중이면, 그 Promise를 재사용합니다.
      if (!refreshPromise) {
        // refresh 토큰 가져오기
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            // 리프레시 토큰이 없으면 강제 로그아웃
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            throw new Error("No refresh token available");
          }

          // plain axios client 사용 (인터셉터 재귀 방지)
          const resp = await refreshClient.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          const respData = resp?.data;

          const newAccess =
            respData?.data?.accessToken ?? respData?.data?.access;
          const newRefresh =
            respData?.data?.refreshToken ?? respData?.data?.refresh;

          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          if (newAccess) setAccessToken(newAccess);
          if (newRefresh) setRefreshToken(newRefresh);

          return newAccess;
        })()
          .catch(() => {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            removeAccessToken();
            removeRefreshToken();
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
        return axiosInstance.request(originalRequest);
      });
    }
    //401에러가 아닌 경우에 그대로 오류를 반환
    return Promise.reject(error);
  },
);
