// src/pages/LPDetailPage.tsx
import { useEffect, useState } from "react"; // 👈 useState 추가
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";
import { useInView } from "react-intersection-observer";
import { useGetLpComments } from "../hooks/useGetLpComments";

// 🦴 댓글용 스켈레톤 컴포넌트 (초기 로딩 & 추가 로딩 때 사용)
const CommentSkeleton = () => (
  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#222] animate-pulse">
    <div className="flex justify-between mb-2">
      <div className="h-4 bg-[#333] w-24 rounded"></div>
      <div className="h-3 bg-[#333] w-16 rounded"></div>
    </div>
    <div className="h-4 bg-[#333] w-full rounded mt-2"></div>
    <div className="h-4 bg-[#333] w-2/3 rounded mt-1"></div>
  </div>
);

const LPDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

  // 🛡️ [체크리스트] 비로그인 사용자 차단!
  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다! 🚨");
      navigate("/login", { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [accessToken, navigate, location]);

  // 1️⃣ 상세 정보 비서 출동!
  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);

  // 2️⃣ 💬 댓글 무한스크롤 비서 & 상태 세팅!
  const [order, setOrder] = useState<"latest" | "oldest">("latest");
  const { ref, inView } = useInView();
  
  const {
    data: commentsData,
    isPending: isCommentsPending, // 첫 댓글 로딩 상태
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage // 추가 댓글 로딩 상태
  } = useGetLpComments(lpid, order);

  // 📸 화면 바닥(ref)에 닿으면 다음 댓글 가져오기!
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 받아온 댓글 페이지들 납작하게 펴기
  const commentsList = commentsData?.pages.flatMap((page) => page.data.data) || [];

  if (!accessToken) return null; 

  // 에러 UI
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">다시 시도</button>
      </div>
    );
  }

  // 상세 페이지 로딩 UI
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
        
        {/* --- 💿 기존 LP 상세 정보 영역 --- */}
        {lp?.thumbnail ? (
          <img src={lp.thumbnail} alt={lp.title} className="w-full aspect-video object-cover rounded-xl border border-[#333]" />
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
          <button className="px-6 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg font-bold transition-colors">❤️ 좋아요</button>
          <button className="px-6 py-2 border border-[#FF1493] text-[#FF1493] hover:bg-[#FF1493] hover:text-white rounded-lg font-bold transition-colors">수정</button>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">삭제</button>
        </div>

        {/* --- 💬 여기서부터 댓글 영역 시작! --- */}
        <hr className="border-[#333] my-8" />

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">댓글 ({commentsList.length})</h2>
            {/* 정렬 토글 버튼 */}
            <button 
              onClick={() => setOrder(prev => prev === "latest" ? "oldest" : "latest")}
              className="text-gray-400 hover:text-white px-3 py-1 bg-[#1a1a1a] rounded border border-[#333] transition-colors"
            >
              {order === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
            </button>
          </div>

          {/* 댓글 작성란 (UI만 구현) */}
          <div className="bg-[#111] p-4 rounded-xl border border-[#333] mb-8">
            <textarea 
              placeholder="따뜻한 댓글을 남겨보세요..."
              className="w-full bg-transparent text-white resize-none outline-none placeholder-gray-500 h-20"
            ></textarea>
            <div className="flex justify-between items-center mt-2 border-t border-[#222] pt-3">
              <span className="text-xs text-[#FF1493]">※ 타인을 비방하는 댓글은 삭제될 수 있습니다.</span>
              <button className="bg-[#FF1493] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                등록
              </button>
            </div>
          </div>

          {/* 1. 최초 로딩 시 (상단 스켈레톤) */}
          {isCommentsPending ? (
            <div className="flex flex-col gap-4">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          ) : commentsList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">아직 작성된 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* 실제 댓글 데이터 렌더링 */}
              {commentsList.map((comment: any) => (
                <div key={comment.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#222]">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-white">{comment.author?.name || "익명"}</span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 2. 추가 로딩 시 (하단 스켈레톤) */}
          {isFetchingNextPage && (
            <div className="flex flex-col gap-4 mt-4">
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          )}

          {/* 📸 댓글 무한 스크롤 트리거 관찰용 div */}
          <div ref={ref} className="h-10 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default LPDetailPage;