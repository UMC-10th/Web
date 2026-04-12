import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black px-6 py-3 flex items-center justify-between">
      {/* 로고: 클릭 시 홈으로 이동 */}
      <span
        className="text-pink-500 font-bold text-lg cursor-pointer"
        onClick={() => navigate('/')}
      >
        돌려돌려LP판
      </span>

      {/* 우측 버튼 영역 */}
      <div className="flex items-center gap-2">
        {/* 로그인 버튼: 텍스트 스타일 */}
        <button
          onClick={() => navigate('/login')}
          className="text-white text-sm px-3 py-1 hover:text-gray-300 transition"
        >
          로그인
        </button>
        {/* 회원가입 버튼: 핑크 배경 */}
        <button
          onClick={() => navigate('/signup')}
          className="bg-pink-500 text-white text-sm px-4 py-1.5 rounded hover:bg-pink-600 transition"
        >
          회원가입
        </button>
      </div>
    </nav>
  );
};

export default Navbar;