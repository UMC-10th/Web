import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [message, setMessage] = useState('');

  // protected API 호출 테스트 (토큰 만료 시 자동 재발급 확인용)
  useEffect(() => {
    axiosInstance.get('/auth/protected')
      .then((res) => setMessage(res.data.data))
      .catch(() => setMessage('API 호출 실패'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl">
        👤
      </div>
      <h2 className="text-2xl font-bold">마이페이지</h2>
      <p className="text-gray-400">로그인한 사용자만 볼 수 있는 페이지입니다.</p>
      {message && (
        <p className="text-green-400 text-sm bg-gray-800 px-4 py-2 rounded-lg">
          {message}
        </p>
      )}
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
