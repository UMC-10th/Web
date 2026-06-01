import { Navigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [accessToken] = useLocalStorage('accessToken', '');
  const location = useLocation();

  if (!accessToken) {
    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
