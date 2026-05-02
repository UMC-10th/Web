import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
