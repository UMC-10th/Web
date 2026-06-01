import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#1a1a1a] border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <NavLink to="/" className="text-xl font-bold text-pink-500">
        돌려돌려LP판
      </NavLink>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-gray-300 hover:text-white border border-gray-500 hover:border-gray-300 px-4 py-1.5 rounded-md"
        >
          로그인
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="text-sm text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md"
        >
          회원가입
        </button>
      </div>
    </nav>
  );
};

export default Navbar;