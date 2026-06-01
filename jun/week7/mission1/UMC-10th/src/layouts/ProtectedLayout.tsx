import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedLayout = () => {
  const { accessToken } = useAuth(); 

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" replace />; 
  }

  return <Outlet />;
};