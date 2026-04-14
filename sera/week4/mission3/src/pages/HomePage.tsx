import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <h1 className="text-white text-3xl font-bold">홈</h1>
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      >
        로그인하러 가기
      </button>
    </div>
  );
};

export default HomePage;
