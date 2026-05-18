import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const id = Number(lpid);
  const { data: lp, isPending, isError, refetch } = useGetLpDetail(id);

  useEffect(() => {
    if (!accessToken) {
      setShowLoginModal(true);
    }
  }, [accessToken]);

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  if (showLoginModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-[#242424] p-6 rounded-xl max-w-sm w-full shadow-xl">
          <h2 className="text-xl font-bold mb-4">로그인 필요</h2>
          <p className="mb-6 text-gray-300">상세 정보를 보려면 로그인이 필요합니다.</p>
          <div className="flex justify-end">
            <button
              onClick={handleLoginRedirect}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 font-semibold"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto w-full animate-pulse flex flex-col gap-6">
        <div className="h-10 bg-white/5 rounded-md w-1/3"></div>
        <div className="h-96 bg-white/5 rounded-xl w-full"></div>
        <div className="h-32 bg-white/5 rounded-md w-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-xl gap-4 max-w-4xl mx-auto w-full">
        <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!lp) {
    return <div className="text-center text-gray-400">데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{lp.title}</h1>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30">수정</button>
            <button className="px-3 py-1.5 text-sm bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30">삭제</button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
            <span>작성자: {lp.authorId}</span>
          </div>
          <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{lp.likes?.length || 0} 좋아요</span>
          </button>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative">
        {lp.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="text-gray-200 leading-relaxed whitespace-pre-wrap mt-4 bg-white/5 p-6 rounded-xl min-h-[200px]">
        {lp.content}
      </div>
      
      {/* Tags Section */}
      {lp.tags && lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {lp.tags.map((tag: any) => (
            <span key={tag.id} className="px-3 py-1 bg-white/10 text-sm rounded-full text-gray-300">
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default LpDetailPage;
