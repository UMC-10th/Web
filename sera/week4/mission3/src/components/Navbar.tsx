import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black px-6 py-3 flex items-center justify-between">
      <span
        className="text-pink-500 font-bold text-lg cursor-pointer"
        onClick={() => navigate('/')}
      >
        돌려돌려LP판
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="text-white text-sm px-3 py-1 hover:text-gray-300 transition"
        >
          로그인
        </button>
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
