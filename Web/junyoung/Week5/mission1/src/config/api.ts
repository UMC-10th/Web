const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/v1',
);

export const GOOGLE_LOGIN_URL = `${API_BASE_URL}/auth/google/login`;

