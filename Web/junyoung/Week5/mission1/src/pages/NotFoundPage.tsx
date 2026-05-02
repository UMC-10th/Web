import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 px-6 text-center text-white">
      <h1 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-gray-400">요청한 경로가 존재하지 않습니다.</p>
      <Link
        to="/"
        className="rounded-md bg-pink-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-600"
      >
        홈으로 이동
      </Link>
    </main>
  );
};

export default NotFoundPage;
