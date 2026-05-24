import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useAuth } from '../context/AuthContext';

export default function GoogleLoginRedirectPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      refetchUser().then(() => {
        navigate('/');
      });
    } else {
      navigate('/login');
    }
  }, [navigate, refetchUser, setAccessToken, setRefreshToken]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500">로그인 처리 중...</p>
    </div>
  );
}
