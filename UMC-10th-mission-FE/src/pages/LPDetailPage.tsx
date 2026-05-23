// src/pages/LPDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";
import { useGetLpComments } from "../hooks/useGetLpComments";
import { deleteLp, postLpLike } from "../apis/lp";
import type { Like, LpDetailResponse } from "../types/lp";

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
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [order, setOrder] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다! 🚨");
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);

  const { ref, inView } = useInView();
  const {
    data: commentsData,
    isPending: isCommentsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpComments(lpid, order);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const commentsList = commentsData?.pages.flatMap((page) => page.data.data) || [];

  // LP 삭제
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLp(Number(lpid)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/lps");
    },
  });

  // 좋아요 토글 (낙관적 업데이트)
  const { mutate: handleLike, isPending: isLiking } = useMutation({
    mutationFn: () => postLpLike(Number(lpid)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpid] });
      const previousData = queryClient.getQueryData<LpDetailResponse>(["lp", lpid]);

      // 좋아요 상태 즉시 토글 (likes는 객체 배열 — 가짜 항목 추가/제거로 개수 반영)
      queryClient.setQueryData<LpDetailResponse>(["lp", lpid], (old) => {
        if (!old) return old;
        const liked = old.data.isLiked ?? false;
        const currentLikes: Like[] = old.data.likes ?? [];
        return {
          ...old,
          data: {
            ...old.data,
            isLiked: !liked,
            likes: liked
              ? currentLikes.slice(0, -1)
              : [...currentLikes, { id: Date.now(), userId: 0, lpId: Number(lpid) }],
          },
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["lp", lpid], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

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
            <span>❤️ 좋아요 {lp?.likes?.length ?? 0}개</span>
            {lp?.artist && <span>🎤 아티스트: {lp.artist}</span>}
          </div>
          {lp?.tags && lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {lp.tags.map((tag: string) => (
                <span key={tag} className="bg-[#2a2a2a] text-[#FF1493] text-xs px-3 py-1 rounded-full border border-[#FF1493]/30">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <hr className="border-[#333]" />

        <div className="text-white text-lg leading-relaxed min-h-[150px]">
          {lp?.content || "본문 내용이 없습니다."}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => handleLike()}
            disabled={isLiking}
            className="flex items-center gap-2 px-6 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <Heart size={16} className={lp?.isLiked ? "fill-[#FF1493] text-[#FF1493]" : "text-white"} />
            좋아요 {lp?.likes?.length ?? 0}
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("이 LP를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) {
                handleDelete();
              }
            }}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        </div>

        {/* 댓글 영역 */}
        <hr className="border-[#333] my-8" />

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">댓글 ({commentsList.length})</h2>
            <button
              onClick={() => setOrder(prev => prev === "latest" ? "oldest" : "latest")}
              className="text-gray-400 hover:text-white px-3 py-1 bg-[#1a1a1a] rounded border border-[#333] transition-colors"
            >
              {order === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
            </button>
          </div>

          <div className="bg-[#111] p-4 rounded-xl border border-[#333] mb-8">
            <textarea
              placeholder="따뜻한 댓글을 남겨보세요..."
              className="w-full bg-transparent text-white resize-none outline-none placeholder-gray-500 h-20"
            />
            <div className="flex justify-between items-center mt-2 border-t border-[#222] pt-3">
              <span className="text-xs text-[#FF1493]">※ 타인을 비방하는 댓글은 삭제될 수 있습니다.</span>
              <button className="bg-[#FF1493] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                등록
              </button>
            </div>
          </div>

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

          {isFetchingNextPage && (
            <div className="flex flex-col gap-4 mt-4">
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          )}

          <div ref={ref} className="h-10 mt-2" />
        </div>
      </div>

    </div>
  );
};

export default LPDetailPage;
