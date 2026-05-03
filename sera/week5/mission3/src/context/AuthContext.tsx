import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  tokens: AuthTokens | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(() => {
    const stored = localStorage.getItem('tokens');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (tokens: AuthTokens) => {
    setTokens(tokens);
    localStorage.setItem('tokens', JSON.stringify(tokens));
  };

  const logout = () => {
    setTokens(null);
    localStorage.removeItem('tokens');
  };

  return (
    <AuthContext.Provider value={{ tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
