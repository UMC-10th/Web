import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-700">
      <span
        className="text-white font-bold text-lg cursor-pointer"
        onClick={() => navigate('/')}
      >
        Home
      </span>
      <div className="flex items-center gap-2">
        {tokens ? (
          <>
            <button
              onClick={() => navigate('/my')}
              className="text-white text-sm px-3 py-1 hover:text-gray-300 transition"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white text-sm px-4 py-1.5 rounded hover:bg-gray-600 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition"
            >
              로그인
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
