import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";
import { useGetLPComments } from "../hooks/useGetLPComments";
import { useInView } from "react-intersection-observer";
import { createComment, updateComment, deleteComment, toggleLike, deleteLp } from "../apis/lp";
import { getMyInfo } from "../apis/auth";

const CommentSkeleton = () => (
  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#222] animate-pulse">
    <div className="flex justify-between mb-2"><div className="h-4 bg-[#333] w-24 rounded"></div><div className="h-3 bg-[#333] w-16 rounded"></div></div>
    <div className="h-4 bg-[#333] w-full rounded mt-2"></div>
    <div className="h-4 bg-[#333] w-2/3 rounded mt-1"></div>
  </div>
);

const LPDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다! 🚨");
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [accessToken, navigate, location]);

  const { data: myInfoRes } = useQuery({ queryKey: ["user", "me"], queryFn: getMyInfo, enabled: !!accessToken });
  const myId = myInfoRes?.data?.id;

  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);
  const [order, setOrder] = useState<"latest" | "oldest">("latest");
  const { ref, inView } = useInView();
  const { data: commentsData, isPending: isCommentsPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetLPComments(lpid, order);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const commentsList = commentsData?.pages.flatMap((page: any) => page.data.data) || [];
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: createComment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] }); setCommentText(""); },
    onError: () => alert("댓글 작성에 실패했습니다."),
  });

  const { mutate: editComment } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] }); setEditingId(null); setEditingText(""); },
    onError: () => alert("댓글 수정에 실패했습니다."),
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] }); },
    onError: () => alert("댓글 삭제에 실패했습니다."),
  });

  const { mutate: handleLike, isPending: isLiking } = useMutation({
    mutationFn: () => toggleLike(Number(lpid), isLiked),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpid] });
      const previous = queryClient.getQueryData(["lp", lpid]);
      queryClient.setQueryData(["lp", lpid], (old: any) => {
        if (!old) return old;
        const likes = Array.isArray(old.data?.likes) ? old.data.likes : [];
        const isLiked = likes.some((l: any) => l.userId === myId);
        return {
          ...old,
          data: {
            ...old.data,
            likes: isLiked
              ? likes.filter((l: any) => l.userId !== myId)
              : [...likes, { userId: myId }],
          },
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["lp", lpid], context?.previous);
      alert("좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLp(Number(lpid)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["lps"] }); navigate("/", { replace: true }); },
    onError: () => alert("LP 삭제에 실패했습니다."),
  });

  if (!accessToken) return null;

  if (isError) return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
      <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
      <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">다시 시도</button>
    </div>
  );

  if (isPending) return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8 animate-pulse">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="w-full aspect-video bg-[#222] rounded-xl"></div>
        <div className="h-10 bg-[#222] w-2/3 rounded"></div>
        <div className="h-6 bg-[#222] w-1/3 rounded"></div>
        <div className="h-40 bg-[#222] w-full rounded mt-4"></div>
      </div>
    </div>
  );

  const lp = response?.data;
  const likes = Array.isArray(lp?.likes) ? lp.likes : [];
  const isLiked = likes.some((l: any) => l.userId === myId);
  const likesCount = likes.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {lp?.thumbnail
          ? <img src={lp.thumbnail} alt={lp.title} className="w-full aspect-video object-cover rounded-xl border border-[#333]" />
          : <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#333]"><span className="text-gray-500">이미지가 없습니다</span></div>
        }

        <div>
          <h1 className="text-[#FF1493] text-4xl font-bold">{lp?.title || "제목 없음"}</h1>
          <div className="flex gap-4 mt-2 text-gray-400 text-sm">
            <span>📅 {lp?.createdAt ? new Date(lp.createdAt).toLocaleDateString() : "업로드일 모름"}</span>
            <span>❤️ 좋아요 {likesCount}개</span>
            {lp?.artist && <span>🎤 아티스트: {lp.artist}</span>}
          </div>
        </div>

        <hr className="border-[#333]" />
        <div className="text-white text-lg leading-relaxed min-h-[150px]">{lp?.content || "본문 내용이 없습니다."}</div>

        <div className="flex justify-end gap-3 mt-8 items-center">
          <button
            onClick={() => handleLike()}
            disabled={isLiking}
            className="flex items-center gap-2 text-white hover:text-[#FF1493] transition-colors disabled:opacity-50"
          >
            {isLiked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF1493" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            )}
            <span className="text-lg">{likesCount}</span>
          </button>
          <button className="px-6 py-2 border border-[#FF1493] text-[#FF1493] hover:bg-[#FF1493] hover:text-white rounded-lg font-bold transition-colors">수정</button>
          <button onClick={() => { if (window.confirm("정말 삭제하시겠습니까?")) handleDelete(); }} disabled={isDeleting} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50">{isDeleting ? "삭제 중..." : "삭제"}</button>
        </div>

        <hr className="border-[#333] my-8" />

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">댓글 ({commentsList.length})</h2>
            <button onClick={() => setOrder((prev) => (prev === "latest" ? "oldest" : "latest"))} className="text-gray-400 hover:text-white px-3 py-1 bg-[#1a1a1a] rounded border border-[#333] transition-colors">{order === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}</button>
          </div>

          <div className="bg-[#111] p-4 rounded-xl border border-[#333] mb-8">
            <textarea placeholder="따뜻한 댓글을 남겨보세요..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="w-full bg-transparent text-white resize-none outline-none placeholder-gray-500 h-20" />
            <div className="flex justify-between items-center mt-2 border-t border-[#222] pt-3">
              <span className="text-xs text-[#FF1493]">※ 타인을 비방하는 댓글은 삭제될 수 있습니다.</span>
              <button disabled={isAddingComment || !commentText.trim()} onClick={() => addComment({ lpId: Number(lpid), content: commentText.trim() })} className="bg-[#FF1493] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-opacity">{isAddingComment ? "등록 중..." : "등록"}</button>
            </div>
          </div>

          {isCommentsPending ? (
            <div className="flex flex-col gap-4"><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></div>
          ) : commentsList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">아직 작성된 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {commentsList.map((comment: any) => (
                <div key={comment.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#222]">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-white">{comment.author?.name || "익명"}</span>
                    <span className="text-xs text-gray-500">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  {editingId === comment.id ? (
                    <div className="flex gap-2 mt-2">
                      <input value={editingText} onChange={(e) => setEditingText(e.target.value)} className="flex-1 bg-[#111] border border-[#444] text-white rounded px-3 py-1 outline-none focus:border-[#FF1493]" />
                      <button onClick={() => editComment({ lpId: Number(lpid), commentId: comment.id, content: editingText })} className="text-sm bg-[#FF1493] text-white px-3 py-1 rounded">저장</button>
                      <button onClick={() => setEditingId(null)} className="text-sm bg-[#333] text-white px-3 py-1 rounded">취소</button>
                    </div>
                  ) : (
                    <p className="text-gray-300">{comment.content}</p>
                  )}
                  {comment.author?.id === myId && editingId !== comment.id && (
                    <div className="flex gap-2 mt-3 justify-end">
                      <button onClick={() => { setEditingId(comment.id); setEditingText(comment.content); }} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-[#222] rounded">✏️ 수정</button>
                      <button onClick={() => removeComment({ lpId: Number(lpid), commentId: comment.id })} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-[#222] rounded">🗑️ 삭제</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isFetchingNextPage && <div className="flex flex-col gap-4 mt-4"><CommentSkeleton /><CommentSkeleton /></div>}
          <div ref={ref} className="h-10 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default LPDetailPage;