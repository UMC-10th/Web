import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useNavigate } from "react-router-dom";

const GoogleLoginRedirectPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.ACCESS_TOKEN
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.REFRESH_TOKEN
  );
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      
      navigate("/mypage", { replace: true });
    } else {
      
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014]">
      <p className="text-gray-400 text-lg animate-pulse">로그인 처리 중...</p>
    </div>
  );
};

export default GoogleLoginRedirectPage;