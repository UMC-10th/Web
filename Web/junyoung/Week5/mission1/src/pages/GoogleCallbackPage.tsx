import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthTokens } from '../utils/auth';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      alert('구글 로그인에 실패했습니다.');
      navigate('/login', { replace: true });
      return;
    }

    setAuthTokens({ accessToken, refreshToken });
    navigate('/', { replace: true });
  }, [navigate, searchParams]);

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 text-white">
      <p className="rounded-md border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-100">
        구글 로그인 정보를 확인하고 있습니다.
      </p>
    </main>
  );
};

export default GoogleCallbackPage;
