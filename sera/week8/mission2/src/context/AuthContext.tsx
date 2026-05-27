import {
  createContext,
  useState,
  useContext,
  type PropsWithChildren,
} from "react";
import { postSignin, postLogout } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ReqSignInDto } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  login: (signInData: ReqSignInDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessToken,
    setItem: setAccessTokenStorage,
    removeItem: removeAccessToken,
  } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  const {
    setItem: setRefreshTokenStorage,
    removeItem: removeRefreshToken,
  } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken()
  );

  const login = async (signInData: ReqSignInDto) => {
    const response = await postSignin(signInData);
    const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

    setAccessTokenStorage(newAccess);
    setRefreshTokenStorage(newRefresh);
    setAccessToken(newAccess);
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (err) {
      console.error("서버 로그아웃 실패:", err);
    } finally {
      removeAccessToken();
      removeRefreshToken();
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
};
