import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpsPage } from '../api/lps';
import { lpKeys } from '../api/queryKeys';
import LpCreateModal from '../components/LpCreateModal';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';
import type { SortOrder } from '../types/lp';

const HomePage = () => {
  const [sort, setSort] = useState<SortOrder>('desc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: lpKeys.list(sort),
    queryFn: ({ pageParam }) => getLpsPage(sort, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const lps = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const target = observerRef.current;

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

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-col items-start gap-3">
        <h1 className="text-xl font-bold">LP 목록</h1>
        <div className="flex rounded-md border border-gray-700 p-1">
          <button
            onClick={() => setSort('desc')}
            className={`rounded px-3 py-1 text-sm ${sort === 'desc' ? 'bg-pink-500 text-white' : 'text-gray-300'}`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('asc')}
            className={`rounded px-3 py-1 text-sm ${sort === 'asc' ? 'bg-pink-500 text-white' : 'text-gray-300'}`}
          >
            오래된순
          </button>
        </div>
      </div>

      {isError && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          목록을 불러오지 못했습니다.
          <button onClick={() => refetch()} className="ml-3 font-semibold underline">
            다시 시도
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => <LpCardSkeleton key={index} />)
          : lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}
      </div>

      {isFetchingNextPage && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div ref={observerRef} className="h-10" />
      <button
        type="button"
        aria-label="LP 추가"
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-3xl leading-none text-white shadow-lg shadow-pink-950/40 hover:bg-pink-600"
      >
        +
      </button>
      <LpCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </section>
  );
};

export default HomePage;
