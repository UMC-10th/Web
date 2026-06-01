import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../apis/lp';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import { SEARCH_DEBOUNCE_DELAY } from '../constants/delay';

const SCROLL_THROTTLE_INTERVAL = 1000;

export default function HomePage() {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY).trim();
  const hasSearchKeyword = debouncedSearch.length > 0;
  const queryKeyword = hasSearchKeyword ? debouncedSearch : undefined;
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, SCROLL_THROTTLE_INTERVAL);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', queryKeyword ?? 'all', order],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({ cursor: pageParam as number, order, search: queryKeyword }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage?.data?.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const lps = data?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const distanceFromBottom =
      document.documentElement.scrollHeight - (window.innerHeight + throttledScrollY);

    if (distanceFromBottom <= 200 && hasNextPage && !isFetchingNextPage) {
      console.log(
        `[throttle] ${SCROLL_THROTTLE_INTERVAL}ms 간격으로 다음 LP 목록 요청`,
      );
      fetchNextPage();
    }
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* 검색 영역 */}
      <div className="border-b border-gray-700 px-6 py-8">
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-2xl flex-col gap-2">
            <label htmlFor="lp-search" className="text-sm font-semibold text-gray-300">
              LP 검색
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-600 bg-[#111122] px-4 py-3 focus-within:border-pink-500">
              <span className="text-gray-400">🔍</span>
              <input
                id="lp-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="검색어를 입력해주세요"
                className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 정렬 버튼 */}
        <div className="mt-4 flex w-full justify-center">
          <div className="flex w-full max-w-2xl justify-end gap-2">
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
        </div>
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

      {!isPending && !isError && lps.length === 0 && (
        <div className="flex h-64 items-center justify-center px-6 text-center text-gray-400">
          {hasSearchKeyword ? '검색 결과가 없습니다.' : '등록된 LP가 없습니다.'}
        </div>
      )}

      {/* LP 그리드 */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 px-6 py-6">
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
      <div className="h-10" />
    </div>
  );
}
