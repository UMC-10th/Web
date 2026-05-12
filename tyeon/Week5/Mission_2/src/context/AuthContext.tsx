import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type ReqSignInDto } from "../types/auth";
import { postLogout } from "../apis/auth";
import { createContext, useState, useContext, type PropsWithChildren } from "react";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: ReqSignInDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }:PropsWithChildren) => {
    const {
        getItem: getAccessTokenInStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenInStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    const {
        getItem: getRefreshTokenInStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenInStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenInStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenInStorage());

    const login = async (signInData: ReqSignInDto) => {
        try {
            const {data} = await postSignin(signInData);

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;
                
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
            }

            alert("로그인 성공!");
            
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenInStorage();
            removeRefreshTokenInStorage();

            setAccessToken(null);
            setRefreshToken(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};