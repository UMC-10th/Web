import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getLpList } from '../apis/lp';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';

export default function HomePage() {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { ref, inView } = useInView();

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', order],
    queryFn: ({ pageParam = 0 }) => getLpList({ cursor: pageParam as number, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage?.data?.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

const lps = data?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  return (
    <div className="p-4">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder('asc')}
          className={`px-4 py-1 rounded text-sm ${
            order === 'asc'
              ? 'bg-white text-black font-semibold'
              : 'bg-transparent text-gray-400 border border-gray-600'
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder('desc')}
          className={`px-4 py-1 rounded text-sm ${
            order === 'desc'
              ? 'bg-white text-black font-semibold'
              : 'bg-transparent text-gray-400 border border-gray-600'
          }`}
        >
          최신순
        </button>
      </div>

      {/* 에러 */}
      {isError && (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* LP 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {isPending &&
          Array.from({ length: 12 }).map((_, i) => (
            <LpCardSkeleton key={i} />
          ))
        }
        {lps.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 12 }).map((_, i) => (
            <LpCardSkeleton key={`next-${i}`} />
          ))
        }
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={ref} className="h-2" />
    </div>
  );
}