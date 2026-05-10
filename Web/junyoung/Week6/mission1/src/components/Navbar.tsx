import { NavLink, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const Navbar = () => {
  const navigate = useNavigate();
  const [accessToken, , removeAccessToken] = useLocalStorage('accessToken', '');
  const [nickname, , removeNickname] = useLocalStorage('nickname', '준영');

  const handleLogout = () => {
    removeAccessToken();
    removeNickname();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 bg-[#151515] border-b border-gray-800 px-5 py-4 flex items-center justify-between">
      <NavLink to="/" className="text-xl font-bold text-pink-500">
        돌려돌려LP판
      </NavLink>
      {accessToken ? (
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-200 sm:inline">
            {nickname}님 반갑습니다.
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white border border-gray-500 hover:border-gray-300 px-4 py-1.5 rounded-md"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-300 hover:text-white border border-gray-500 hover:border-gray-300 px-4 py-1.5 rounded-md"
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md"
          >
            회원가입
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label="LP 추가"
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-3xl leading-none text-white shadow-lg shadow-pink-950/40 hover:bg-pink-600"
      >
        +
      </button>
    </nav>
  );
};

export default Navbar;
