import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f1014] gap-6">
      <h1 className="text-[#FF1493] text-8xl font-bold">404</h1>
      <p className="text-white text-xl">페이지를 찾을 수 없습니다.</p>
      <button
        onClick={() => navigate("/")}
        className="px-8 py-3 bg-[#FF1493] text-white font-bold rounded-md hover:opacity-90 transition-opacity"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFoundPage;