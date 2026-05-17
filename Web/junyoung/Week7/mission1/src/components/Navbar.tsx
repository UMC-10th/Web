import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/lps';
import useLocalStorage from '../hooks/useLocalStorage';

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [accessToken, , removeAccessToken] = useLocalStorage('accessToken', '');
  const [nickname, , removeNickname] = useLocalStorage('nickname', '준영');
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeAccessToken();
      removeNickname();
      queryClient.clear();
      navigate('/');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
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
            disabled={logoutMutation.isPending}
            className="text-sm text-gray-300 hover:text-white border border-gray-500 hover:border-gray-300 px-4 py-1.5 rounded-md"
          >
            {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
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
    </nav>
  );
};

export default Navbar;
