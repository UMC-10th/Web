// src/pages/LPDetailPage.tsx
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";

const LPDetailPage = () => {
  const { lpid } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

 
  useEffect(() => {
    if (!accessToken) {
      
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다! 🚨");
      
      
      navigate("/login", { 
        state: { from: location.pathname }, 
        replace: true 
      });
    }
  }, [accessToken, navigate, location]); 

  
  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);

  
  if (!accessToken) return null; 

 
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">다시 시도</button>
      </div>
    );
  }

 
  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8 animate-pulse">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="w-full aspect-video bg-[#222] rounded-xl"></div>
          <div className="h-10 bg-[#222] w-2/3 rounded"></div>
          <div className="h-6 bg-[#222] w-1/3 rounded"></div>
          <div className="h-40 bg-[#222] w-full rounded mt-4"></div>
        </div>
      </div>
    );
  }

  
  const lp = response?.data; 

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
       
        {lp?.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full aspect-video object-cover rounded-xl border border-[#333]"
          />
        ) : (
          <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#333]">
            <span className="text-gray-500">이미지가 없습니다</span>
          </div>
        )}

        
        <div>
          <h1 className="text-[#FF1493] text-4xl font-bold">{lp?.title || "제목 없음"}</h1>
          <div className="flex gap-4 mt-2 text-gray-400 text-sm">
            <span>📅 {lp?.createdAt ? new Date(lp.createdAt).toLocaleDateString() : "업로드일 모름"}</span>
            <span>❤️ 좋아요 {lp?.likes || 0}개</span>
            {lp?.artist && <span>🎤 아티스트: {lp.artist}</span>}
          </div>
        </div>

        <hr className="border-[#333]" />

       
        <div className="text-white text-lg leading-relaxed min-h-[150px]">
          {lp?.content || "본문 내용이 없습니다."}
        </div>

        
        <div className="flex justify-end gap-3 mt-8">
          <button className="px-6 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg font-bold transition-colors">
            ❤️ 좋아요
          </button>
          <button className="px-6 py-2 border border-[#FF1493] text-[#FF1493] hover:bg-[#FF1493] hover:text-white rounded-lg font-bold transition-colors">
            수정
          </button>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">
            삭제
          </button>
        </div>

      </div>
    </div>
  );
};

export default LPDetailPage;