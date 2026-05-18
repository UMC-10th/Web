import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getLp, getLpCommentsPage } from '../api/lps';
import CommentSkeleton from '../components/CommentSkeleton';
import type { SortOrder } from '../types/lp';

const LpDetailPage = () => {
  const { lpid = '' } = useParams();
  const [order, setOrder] = useState<SortOrder>('desc');
  const commentObserverRef = useRef<HTMLDivElement | null>(null);
  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', lpid],
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
    queryKey: ['lpComments', lpid, order],
    queryFn: ({ pageParam }) => getLpCommentsPage(lpid, order, pageParam),
    enabled: Boolean(lpid),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const comments = commentData?.pages.flatMap((page) => page.items) ?? [];

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

  return (
    <article className="mx-auto max-w-3xl">
      <img src={lp.thumbnail} alt={lp.title} className="aspect-square w-full rounded-md object-cover" />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{lp.author}</p>
          <h1 className="mt-1 text-2xl font-bold">{lp.title}</h1>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200">수정</button>
          <button className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200">삭제</button>
          <button className="rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white">
            좋아요 {lp.likes}
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-300">{new Date(lp.createdAt).toLocaleString('ko-KR')}</p>
      <p className="mt-6 leading-7 text-gray-100">{lp.content}</p>

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

        <div className="mt-4 flex gap-2">
          <input
            placeholder="댓글을 입력해주세요."
            className="h-11 flex-1 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <button className="rounded-md bg-pink-500 px-4 text-sm font-semibold text-white">
            등록
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {isCommentsLoading ? (
            Array.from({ length: 3 }).map((_, index) => <CommentSkeleton key={index} />)
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-md border border-gray-800 bg-[#151515] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-white">{comment.author}</strong>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-200">{comment.content}</p>
              </div>
            ))
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
