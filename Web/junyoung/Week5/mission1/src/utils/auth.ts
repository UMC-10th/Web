export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

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

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
