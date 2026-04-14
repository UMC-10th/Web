import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black">
      <Link to="/" className="text-pink-500 font-bold text-xl">
        돌려돌려LP판
      </Link>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="text-white border border-gray-600 px-4 py-1 rounded hover:bg-gray-800 transition"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition"
        >
          회원가입
        </Link>
      </div>
    </nav>
  );
}