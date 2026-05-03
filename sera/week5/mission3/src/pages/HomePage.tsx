import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { tokens } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <h1 className="text-3xl font-bold">홈</h1>
      <p className="text-gray-400">
        {tokens ? '로그인 상태입니다.' : '로그인이 필요한 페이지는 보호됩니다.'}
      </p>
      <div className="flex gap-3">
        {!tokens && (
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            로그인
          </button>
        )}
        <button
          onClick={() => navigate('/my')}
          className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          마이페이지 (보호됨)
        </button>
      </div>
    </div>
  );
};

export default HomePage;
