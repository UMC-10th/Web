import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const LPDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [accessToken, navigate, location]);

  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);

  if (!accessToken) return null;

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">
          다시 시도
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8 animate-pulse">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#222]" />
            <div className="h-4 bg-[#222] w-24 rounded" />
          </div>
          <div className="h-8 bg-[#222] w-1/2 rounded" />
          <div className="w-64 h-64 rounded-full bg-[#222] mx-auto" />
          <div className="h-20 bg-[#222] w-full rounded" />
        </div>
      </div>
    );
  }

  const lp = response?.data;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-6">
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-5">
        {/* 작성자 + 날짜 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {lp?.author?.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-white font-bold">
                {lp?.author?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-white font-semibold">{lp?.author?.name ?? "알 수 없음"}</span>
          </div>
          <span className="text-gray-400 text-sm">
            {lp?.createdAt ? timeAgo(lp.createdAt) : ""}
          </span>
        </div>

        {/* 제목 + 수정/삭제 */}
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">{lp?.title ?? "제목 없음"}</h1>
          <div className="flex gap-3 text-gray-400">
            <button className="hover:text-[#FF1493] transition-colors">✏️</button>
            <button className="hover:text-red-500 transition-colors">🗑️</button>
          </div>
        </div>

        {/* 원형 LP 이미지 */}
        <div className="flex justify-center">
          {lp?.thumbnail ? (
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-64 h-64 rounded-full object-cover border-4 border-[#333]"
            />
          ) : (
            <div className="w-64 h-64 rounded-full bg-[#222] flex items-center justify-center border-4 border-[#333]">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* 본문 */}
        <p className="text-gray-300 text-base leading-relaxed text-center">
          {lp?.content ?? "본문 내용이 없습니다."}
        </p>

        {/* 태그 */}
        {lp?.tags && lp.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full border border-[#444] text-gray-300 text-sm"
              >
                # {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <button className="text-[#FF1493] text-2xl hover:scale-110 transition-transform">
            ❤️
          </button>
          <span className="text-white font-bold text-lg">{lp?.likes?.length ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LPDetailPage;
