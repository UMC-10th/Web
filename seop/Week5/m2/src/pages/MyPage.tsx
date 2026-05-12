import { useAuth } from '../context/AuthContext';

export default function MyPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <h1 className="text-2xl font-bold">{user?.name}님 환영합니다.</h1>
      <p className="text-gray-600">{user?.email}</p>
      <button
        onClick={logout}
        className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-500 transition"
      >
        로그아웃
      </button>
    </div>
  );
}