import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedLayout = () => {
  const { accessToken } = useAuth(); // AuthContext에서 토큰 상태 구독 [cite: 116]

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다."); // 사용자 경험 고려 [cite: 120]
    return <Navigate to="/login" replace />; // 리다이렉트 처리 [cite: 110, 119]
  }

  return <Outlet />; // 인증된 경우 하위 경로(LPListPage 등) 렌더링
};