import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";
import { useGetComments } from "../hooks/useGetComments";
import {
  deleteLp,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
} from "../apis/lp";
import type { Comment } from "../types/lp";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const CommentSkeleton = () => (
  <div className="flex gap-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-[#333] shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 bg-[#333] w-24 rounded" />
      <div className="h-4 bg-[#333] w-full rounded" />
    </div>
  </div>
);

const LPDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [commentOrder, setCommentOrder] = useState<"latest" | "oldest">("latest");
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const commentBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [accessToken, navigate, location]);

  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);
  const lpId = Number(lpid);

  const {
    data: commentsData,
    isPending: isCommentsPending,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
  } = useGetComments(lpId, commentOrder);

  const comments: Comment[] =
    commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  useEffect(() => {
    const el = commentBottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextComments && !isFetchingNextComments) {
          fetchNextComments();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextComments, isFetchingNextComments, fetchNextComments]);

  const { mutate: mutateDeleteLp } = useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/lps");
    },
  });

  const { mutate: mutateLike } = useMutation({
    mutationFn: () => toggleLike(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  const { mutate: mutateCreateComment, isPending: isCreatingComment } = useMutation({
    mutationFn: (content: string) => createComment({ lpId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
      setCommentInput("");
    },
  });

  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment({ lpId, commentId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
      setEditingCommentId(null);
    },
  });

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment({ lpId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });

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
  const myUserId = lp?.author?.id;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* LP 카드 */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {lp?.author?.avatar ? (
                <img src={lp.author.avatar} alt={lp.author.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-white font-bold">
                  {lp?.author?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
              <span className="text-white font-semibold">{lp?.author?.name ?? "알 수 없음"}</span>
            </div>
            <span className="text-gray-400 text-sm">{lp?.createdAt ? timeAgo(lp.createdAt) : ""}</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">{lp?.title ?? "제목 없음"}</h1>
            <button
              onClick={() => { if (confirm("이 LP를 삭제할까요?")) mutateDeleteLp(); }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              🗑️
            </button>
          </div>

          <div className="flex justify-center">
            {lp?.thumbnail ? (
              <img src={lp.thumbnail} alt={lp.title} className="w-64 h-64 rounded-full object-cover border-4 border-[#333]" />
            ) : (
              <div className="w-64 h-64 rounded-full bg-[#222] flex items-center justify-center border-4 border-[#333]">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <p className="text-gray-300 text-base leading-relaxed text-center">{lp?.content ?? "본문 내용이 없습니다."}</p>

          {lp?.tags && lp.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {lp.tags.map((tag: { id: number; name: string }) => (
                <span key={tag.id} className="px-3 py-1 rounded-full border border-[#444] text-gray-300 text-sm">
                  # {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-2 pt-2">
            <button
              onClick={() => mutateLike()}
              className="text-[#FF1493] text-2xl hover:scale-110 transition-transform"
            >
              ❤️
            </button>
            <span className="text-white font-bold text-lg">{lp?.likes?.length ?? 0}</span>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">댓글</h2>
            <button
              onClick={() => setCommentOrder((prev) => (prev === "latest" ? "oldest" : "latest"))}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              {commentOrder === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentInput.trim()) mutateCreateComment(commentInput);
              }}
              placeholder="댓글을 입력하세요..."
              className="flex-1 bg-[#222] text-white text-sm px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493] placeholder-gray-500"
            />
            <button
              onClick={() => { if (commentInput.trim()) mutateCreateComment(commentInput); }}
              disabled={!commentInput.trim() || isCreatingComment}
              className="px-4 py-2 bg-[#FF1493] text-white text-sm rounded-lg disabled:opacity-40 hover:bg-[#e0117e] transition-colors"
            >
              등록
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {isCommentsPending ? (
              Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {comment.author.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-semibold">{comment.author.name}</span>
                        <span className="text-gray-500 text-xs">{timeAgo(comment.createdAt)}</span>
                      </div>
                      {comment.authorId === myUserId && (
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                            className="text-gray-400 hover:text-white px-2"
                          >
                            ···
                          </button>
                          {openMenuId === comment.id && (
                            <div className="absolute right-0 top-6 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-lg z-10 min-w-[80px]">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                  setOpenMenuId(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333]"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => {
                                  mutateDeleteComment(comment.id);
                                  setOpenMenuId(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#333]"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="flex-1 bg-[#222] text-white text-sm px-3 py-1 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493]"
                        />
                        <button
                          onClick={() => mutateUpdateComment({ commentId: comment.id, content: editingContent })}
                          className="px-3 py-1 bg-[#FF1493] text-white text-xs rounded-lg"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 bg-[#333] text-white text-xs rounded-lg"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}

            {isFetchingNextComments &&
              Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={`sk-${i}`} />)}

            <div ref={commentBottomRef} className="h-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPDetailPage;
