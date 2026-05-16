import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getLpDetail, getComments } from '../apis/lp';
import { useAuth } from '../context/AuthContext';
import CommentSkeleton from '../components/CommentSkeleton';

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [commentText, setCommentText] = useState('');
  const { ref, inView } = useInView();

  const { data: lpData, isPending: lpPending, isError: lpError, refetch: lpRefetch } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(Number(lpId)),
  });

  const {
    data: commentsData,
    isPending: commentsPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getComments({ lpId: Number(lpId), cursor: pageParam as number, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const lp = lpData?.data;
  const comments = commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  if (lpPending) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-gray-600 border-t-pink-500 rounded-full animate-spin" />
    </div>
  );

  if (lpError) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
      <button onClick={() => lpRefetch()} className="bg-pink-500 text-white px-4 py-2 rounded">
        다시 시도
      </button>
    </div>
  );

  if (!lp) return null;

  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* LP 상세 카드 */}
        <div className="bg-[#2a2a3e] rounded-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                {lp.author.name[0]}
              </div>
              <span className="text-white font-semibold">{lp.author.name}</span>
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">{lp.title}</h1>
            {user?.id === lp.authorId && (
              <div className="flex gap-3">
                <button className="text-gray-400 hover:text-white">✏️</button>
                <button className="text-gray-400 hover:text-red-400">🗑️</button>
              </div>
            )}
          </div>

          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full rounded-lg mb-6 object-cover"
          />

          <p className="text-gray-300 mb-6 leading-relaxed">{lp.content}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {lp.tags.map((tag) => (
              <span key={tag.id} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                # {tag.name}
              </span>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
              ❤️ {lp.likes.length}
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-[#2a2a3e] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">댓글</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setOrder('asc')}
                className={`px-3 py-1 rounded text-sm ${
                  order === 'asc'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-transparent text-gray-400 border border-gray-600'
                }`}
              >
                오래된순
              </button>
              <button
                onClick={() => setOrder('desc')}
                className={`px-3 py-1 rounded text-sm ${
                  order === 'desc'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-transparent text-gray-400 border border-gray-600'
                }`}
              >
                최신순
              </button>
            </div>
          </div>

          {/* 댓글 입력 */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력해주세요"
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-pink-500 border border-transparent"
            />
            <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
              작성
            </button>
          </div>

          {/* 초기 로딩 스켈레톤 */}
          {commentsPending && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {comment.author.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{comment.author.name}</p>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                </div>
                {user?.id === comment.authorId && (
                  <button className="text-gray-500 hover:text-white text-xs">⋮</button>
                )}
              </div>
            ))}

            {/* 추가 로딩 스켈레톤 */}
            {isFetchingNextPage && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <CommentSkeleton key={`next-${i}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 무한스크롤 트리거 - 댓글 섹션 밖으로 이동 */}
        <div ref={ref} className="h-4 mt-2" />
      </div>
    </div>
  );
}