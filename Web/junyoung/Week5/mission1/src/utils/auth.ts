export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const readStorageValue = (key: string) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return '';
  }

  try {
    const parsedValue = JSON.parse(value);
    return typeof parsedValue === 'string' ? parsedValue : '';
  } catch {
    return value;
  }
};

export const getAccessToken = () => readStorageValue(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => readStorageValue(REFRESH_TOKEN_KEY);

export const isAuthenticated = () => Boolean(getAccessToken());

export const setAuthTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(accessToken));
  localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
