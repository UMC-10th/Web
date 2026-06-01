import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-6">
      <h1 className="text-white text-4xl font-bold">
        돌려돌려<span className="text-[#FF1493]">LP판</span>
      </h1>
      <p className="text-gray-400 text-lg">당신의 LP 컬렉션을 관리하세요</p>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => navigate("/lps")}
          className="px-8 py-3 bg-[#FF1493] text-white font-bold rounded-md hover:opacity-90 transition-opacity"
        >
          LP 둘러보기
        </button>
        {!accessToken && (
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 border border-[#FF1493] text-[#FF1493] font-bold rounded-md hover:bg-[#FF1493] hover:text-white transition-colors"
          >
            시작하기
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;