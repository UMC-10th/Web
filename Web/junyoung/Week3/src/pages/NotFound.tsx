import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-gray-600">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">페이지를 찾을 수 없어요.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
