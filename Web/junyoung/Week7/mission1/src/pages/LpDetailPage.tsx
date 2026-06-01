import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createComment,
  deleteComment,
  deleteLp,
  getLp,
  getLpCommentsPage,
  toggleLpLike,
  updateComment,
  updateLp,
} from '../api/lps';
import { commentKeys, lpKeys } from '../api/queryKeys';
import CommentSkeleton from '../components/CommentSkeleton';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SortOrder } from '../types/lp';

const LpDetailPage = () => {
  const { lpid = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nickname] = useLocalStorage('nickname', '준영');
  const [order, setOrder] = useState<SortOrder>('desc');
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [isLpEditing, setIsLpEditing] = useState(false);
  const [lpTitle, setLpTitle] = useState('');
  const [lpContent, setLpContent] = useState('');
  const [lpThumbnail, setLpThumbnail] = useState('');
  const commentObserverRef = useRef<HTMLDivElement | null>(null);
  const numericLpId = Number(lpid);
  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: lpKeys.detail(lpid),
    queryFn: () => getLp(lpid),
    enabled: Boolean(lpid),
  });
  const {
    data: commentData,
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: commentKeys.list(lpid, order),
    queryFn: ({ pageParam }) => getLpCommentsPage(lpid, order, pageParam),
    enabled: Boolean(lpid),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const comments = commentData?.pages.flatMap((page) => page.items) ?? [];
  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: commentKeys.all });
  const invalidateLp = () => {
    queryClient.invalidateQueries({ queryKey: lpKeys.detail(lpid) });
    queryClient.invalidateQueries({ queryKey: lpKeys.lists() });
  };
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setCommentContent('');
      invalidateComments();
    },
  });
  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingCommentContent('');
      invalidateComments();
    },
  });
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: invalidateComments,
  });
  const updateLpMutation = useMutation({
    mutationFn: updateLp,
    onSuccess: () => {
      setIsLpEditing(false);
      invalidateLp();
    },
  });
  const deleteLpMutation = useMutation({
    mutationFn: deleteLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lpKeys.lists() });
      navigate('/');
    },
  });
  const likeMutation = useMutation({
    mutationFn: toggleLpLike,
    onSuccess: invalidateLp,
  });

  useEffect(() => {
    const target = commentObserverRef.current;

    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <div className="mx-auto h-[520px] max-w-3xl animate-pulse rounded-md bg-gray-800" />;
  }

  if (isError || !lp) {
    return (
      <div className="mx-auto max-w-3xl rounded-md border border-red-500/40 bg-red-500/10 p-5 text-red-100">
        상세 정보를 불러오지 못했습니다.
        <button onClick={() => refetch()} className="ml-3 font-semibold underline">
          다시 시도
        </button>
      </div>
    );
  }

  const handleCreateComment = (event: React.FormEvent) => {
    event.preventDefault();

    if (!commentContent.trim()) {
      return;
    }

    createCommentMutation.mutate({
      lpId: numericLpId,
      content: commentContent.trim(),
      author: nickname,
    });
  };

  const handleUpdateLp = (event: React.FormEvent) => {
    event.preventDefault();

    updateLpMutation.mutate({
      id: numericLpId,
      title: lpTitle.trim() || lp.title,
      content: lpContent.trim() || lp.content,
      thumbnail: lpThumbnail,
      tags: lp.tags,
    });
  };

  return (
    <article className="mx-auto max-w-3xl">
      <img src={lp.thumbnail} alt={lp.title} className="aspect-square w-full rounded-md object-cover" />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{lp.author}</p>
          <h1 className="mt-1 text-2xl font-bold">{lp.title}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setLpTitle(lp.title);
              setLpContent(lp.content);
              setLpThumbnail(lp.thumbnail);
              setIsLpEditing((prev) => !prev);
            }}
            className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200"
          >
            수정
          </button>
          <button
            onClick={() => deleteLpMutation.mutate(numericLpId)}
            disabled={deleteLpMutation.isPending}
            className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200"
          >
            삭제
          </button>
          <button
            onClick={() => likeMutation.mutate(numericLpId)}
            disabled={likeMutation.isPending}
            className="rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white disabled:bg-gray-700"
          >
            좋아요 {lp.likes}
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-300">{new Date(lp.createdAt).toLocaleString('ko-KR')}</p>
      <p className="mt-6 leading-7 text-gray-100">{lp.content}</p>
      {lp.tags && lp.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {lp.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-pink-500/15 px-3 py-1 text-sm text-pink-100">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {isLpEditing && (
        <form onSubmit={handleUpdateLp} className="mt-6 flex flex-col gap-3 rounded-md border border-gray-800 bg-[#151515] p-4">
          <input
            value={lpTitle}
            onChange={(event) => setLpTitle(event.target.value)}
            className="h-11 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none focus:border-pink-500"
          />
          <textarea
            value={lpContent}
            onChange={(event) => setLpContent(event.target.value)}
            rows={4}
            className="resize-none rounded-md border border-gray-700 bg-transparent px-4 py-3 text-sm outline-none focus:border-pink-500"
          />
          <input
            value={lpThumbnail}
            onChange={(event) => setLpThumbnail(event.target.value)}
            placeholder="이미지 URL"
            className="h-11 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <button
            type="submit"
            disabled={updateLpMutation.isPending}
            className="h-11 rounded-md bg-pink-500 text-sm font-bold text-white disabled:bg-gray-700"
          >
            {updateLpMutation.isPending ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      )}

      <section className="mt-10 border-t border-gray-800 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">댓글</h2>
          <div className="flex rounded-md border border-gray-700 p-1">
            <button
              onClick={() => setOrder('desc')}
              className={`rounded px-3 py-1 text-sm ${order === 'desc' ? 'bg-pink-500 text-white' : 'text-gray-300'}`}
            >
              최신순
            </button>
            <button
              onClick={() => setOrder('asc')}
              className={`rounded px-3 py-1 text-sm ${order === 'asc' ? 'bg-pink-500 text-white' : 'text-gray-300'}`}
            >
              오래된순
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateComment} className="mt-4 flex gap-2">
          <input
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            placeholder="댓글을 입력해주세요."
            className="h-11 flex-1 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <button
            type="submit"
            disabled={createCommentMutation.isPending || !commentContent.trim()}
            className="rounded-md bg-pink-500 px-4 text-sm font-semibold text-white disabled:bg-gray-700"
          >
            등록
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3">
          {isCommentsLoading ? (
            Array.from({ length: 3 }).map((_, index) => <CommentSkeleton key={index} />)
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const isMine = comment.author === nickname;
              const isEditing = editingCommentId === comment.id;

              return (
                <div key={comment.id} className="rounded-md border border-gray-800 bg-[#151515] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm text-white">{comment.author}</strong>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                      {isMine && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingCommentContent(comment.content);
                            }}
                            className="text-xs text-gray-300 hover:text-white"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCommentMutation.mutate({ lpId: numericLpId, commentId: comment.id })}
                            className="text-xs text-red-300 hover:text-red-100"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {isEditing ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        updateCommentMutation.mutate({
                          lpId: numericLpId,
                          commentId: comment.id,
                          content: editingCommentContent.trim(),
                        });
                      }}
                      className="mt-3 flex gap-2"
                    >
                      <input
                        value={editingCommentContent}
                        onChange={(event) => setEditingCommentContent(event.target.value)}
                        className="h-10 flex-1 rounded-md border border-gray-700 bg-transparent px-3 text-sm outline-none focus:border-pink-500"
                      />
                      <button
                        type="submit"
                        disabled={!editingCommentContent.trim() || updateCommentMutation.isPending}
                        className="rounded-md bg-pink-500 px-3 text-sm font-semibold text-white disabled:bg-gray-700"
                      >
                        저장
                      </button>
                    </form>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-gray-200">{comment.content}</p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="rounded-md border border-gray-800 p-4 text-sm text-gray-400">
              아직 댓글이 없습니다.
            </p>
          )}

          {isFetchingNextPage &&
            Array.from({ length: 2 }).map((_, index) => <CommentSkeleton key={index} />)}
        </div>

        <div ref={commentObserverRef} className="h-8" />
      </section>
    </article>
  );
};

export default LpDetailPage;
