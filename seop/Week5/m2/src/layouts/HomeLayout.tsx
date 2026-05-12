import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomeLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <Link to="/" className="font-bold text-xl">홈</Link>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/my" className="text-gray-600 hover:text-black">마이페이지</Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-black"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-black">로그인</Link>
              <Link to="/signup" className="text-gray-600 hover:text-black">회원가입</Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}