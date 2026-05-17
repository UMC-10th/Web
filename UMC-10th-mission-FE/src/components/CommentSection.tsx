import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { MoreVertical } from "lucide-react";
import { useGetLpComments } from "../hooks/useGetLpComments";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { postComment, patchComment, deleteComment } from "../apis/lp";
import type { Comment } from "../types/lp";

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

interface CommentSectionProps {
  lpId: string;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const { data: myInfo } = useGetMyInfo(accessToken);
  const myId = myInfo?.data?.id;

  const [order, setOrder] = useState<"latest" | "oldest">("latest");
  const [commentText, setCommentText] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const { ref, inView } = useInView();

  const {
    data: commentsData,
    isPending: isCommentsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpComments(lpId, order);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const commentsList: Comment[] =
    commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  // 댓글 작성
  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: (content: string) => postComment(Number(lpId), { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setCommentText("");
    },
  });

  // 댓글 수정
  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      patchComment(Number(lpId), commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setEditingId(null);
    },
  });

  // 댓글 삭제
  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(lpId), commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">
          댓글 ({commentsList.length})
        </h2>
        <button
          onClick={() =>
            setOrder((prev) => (prev === "latest" ? "oldest" : "latest"))
          }
          className="text-gray-400 hover:text-white px-3 py-1 bg-[#1a1a1a] rounded border border-[#333] transition-colors"
        >
          {order === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
        </button>
      </div>

      {/* 댓글 작성란 */}
      <div className="bg-[#111] p-4 rounded-xl border border-[#333] mb-8">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="따뜻한 댓글을 남겨보세요..."
          className="w-full bg-transparent text-white resize-none outline-none placeholder-gray-500 h-20"
        />
        <div className="flex justify-between items-center mt-2 border-t border-[#222] pt-3">
          <span className="text-xs text-[#FF1493]">
            ※ 타인을 비방하는 댓글은 삭제될 수 있습니다.
          </span>
          <button
            onClick={() => {
              if (commentText.trim()) createComment(commentText.trim());
            }}
            disabled={isCreating || !commentText.trim()}
            className="bg-[#FF1493] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCreating ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>

      {/* 초기 로딩 스켈레톤 */}
      {isCommentsPending ? (
        <div className="flex flex-col gap-4">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : commentsList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          아직 작성된 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {commentsList.map((comment) => (
            <div
              key={comment.id}
              className="bg-[#1a1a1a] p-4 rounded-lg border border-[#222]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {comment.author?.name || "익명"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                {/* 본인 댓글에만 ... 메뉴 표시 */}
                {myId === comment.author?.id && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) =>
                          prev === comment.id ? null : comment.id
                        );
                      }}
                      aria-label="댓글 메뉴"
                      className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === comment.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-7 w-24 bg-[#2a2a2a] border border-[#444] rounded-lg overflow-hidden z-10 shadow-lg"
                      >
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditText(comment.content);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            removeComment(comment.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3a3a3a] transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 수정 모드 vs 읽기 모드 */}
              {editingId === comment.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full bg-[#111] text-white border border-[#333] rounded-lg p-2 resize-none outline-none focus:border-[#FF1493] transition-colors"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 text-sm text-gray-400 hover:text-white bg-[#222] rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        if (editText.trim())
                          updateComment({
                            commentId: comment.id,
                            content: editText.trim(),
                          });
                      }}
                      disabled={isUpdating || !editText.trim()}
                      className="px-4 py-1.5 text-sm text-white bg-[#FF1493] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "저장 중..." : "저장"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 추가 로딩 스켈레톤 */}
      {isFetchingNextPage && (
        <div className="flex flex-col gap-4 mt-4">
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      )}

      {/* 무한스크롤 트리거 */}
      <div ref={ref} className="h-10 mt-2" />
    </div>
  );
};

export default CommentSection;
