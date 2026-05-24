import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  const handleSortToggle = () => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    refetch,
    fetchNextPage,
  } = useGetInfiniteLpList(50, search, order);

  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다
  // inView -> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">LP 목록</h1>
        <button
          onClick={handleSortToggle}
          className="px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
        >
          {order === "desc" ? "최신순" : "오래된순"}
        </button>
      </div>
      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LpCardSkeleton key={i} />
          ))}
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-xl gap-4">
          <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}
      {!isPending && !isError && lps && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="col-span-full text-center p-12 text-gray-500 bg-white/5 rounded-xl">
              등록된 LP가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
