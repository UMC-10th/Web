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
      // window.location.href 대신 navigate 사용 (SPA 방식 유지)
      navigate("/mypage", { replace: true });
    } else {
      // 토큰이 없으면 로그인 페이지로
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
