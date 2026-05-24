import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DELAY } from "../constants/delay";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [scope, setScope] = useState("제목");
  const [order] = useState<"asc" | "desc">("desc");
  const debouncedQuery = useDebounce(query, SEARCH_DELAY);
  const trimmedQuery = debouncedQuery.trim();

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    refetch,
    fetchNextPage,
  } = useGetInfiniteLpList(50, trimmedQuery, order, trimmedQuery.length > 0);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem("recentSearches");
  };

  useEffect(() => {
    const q = trimmedQuery;
    if (!q) return;

    setRecent((prev) => {
      const next = [q, ...prev.filter((r) => r !== q)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(next));
      return next;
    });
  }, [trimmedQuery]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center pt-12">
      <form className="w-full max-w-3xl px-4 md:px-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full rounded-md bg-[#0f0f0f] border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              aria-label="검색"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              검색
            </button>
          </div>

          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="rounded-md bg-[#1a1a1a] border border-white/10 px-3 py-2 text-white"
          >
            <option>제목</option>
            <option>내용</option>
            <option>작성자</option>
          </select>
        </div>
      </form>

      <div className="w-full max-w-3xl px-4 md:px-0 mt-8">
        <div className="flex items-center justify-between text-white/80 mb-2">
          <div className="font-semibold">최근 검색어</div>
          <button
            onClick={clearRecent}
            className="text-sm text-white/60 hover:text-white"
          >
            모두 지우기
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-white/50">최근 검색어가 없습니다.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((r) => (
              <li
                key={r}
                className="flex items-center justify-between gap-2 rounded-md bg-[#141414] px-3 py-2"
              >
                <button
                  onClick={() => {
                    setQuery(r);
                  }}
                  className="text-left text-white"
                >
                  {r}
                </button>
                <button
                  onClick={() => {
                    const filtered = recent.filter((x) => x !== r);
                    setRecent(filtered);
                    localStorage.setItem(
                      "recentSearches",
                      JSON.stringify(filtered),
                    );
                  }}
                  className="text-sm text-white/60 hover:text-white"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-6xl px-4 md:px-0 mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{scope} 검색 결과</h2>
          <button
            onClick={() => refetch()}
            className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            새로고침
          </button>
        </div>

        {isPending && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <LpCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 p-12 gap-4">
            <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
            <button
              onClick={() => refetch()}
              className="rounded-md bg-blue-600 px-4 py-2 hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isPending && !isError && lps && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lps?.pages
              ?.map((page) => page.data.data)
              ?.flat()
              ?.map((lp, index) => {
                const isLastItem =
                  index ===
                  (lps?.pages?.flatMap((page) => page.data.data)?.length ?? 0) -
                    1;

                return (
                  <div
                    key={lp.id}
                    ref={isLastItem ? ref : null}
                    className="relative"
                  >
                    <LpCard lp={lp} />
                    {isLastItem && isFetching && (
                      <LpCardSkeletonList count={20} />
                    )}
                  </div>
                );
              })}

            {lps?.pages?.flatMap((page) => page.data.data)?.length === 0 && (
              <div className="col-span-full rounded-xl bg-white/5 p-12 text-center text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
