import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLpListInfinite } from "../hooks/useGetLPListInfinite";
import type { Lp } from "../types/lp";

const SkeletonCard = () => (
  <div className="w-full aspect-square bg-[#222] animate-pulse rounded" />
);

const LPListPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpListInfinite(sort);

  const lpList: Lp[] = data?.pages.flatMap((page) => page.data.data) ?? [];

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다 😭</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#FF1493] text-white rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[#FF1493] text-3xl font-bold">나의 LP 보관함</h1>
        <button
          onClick={() => setSort((prev) => (prev === "latest" ? "oldest" : "latest"))}
          className="text-white bg-[#333] px-4 py-2 rounded-lg hover:bg-[#555]"
        >
          {sort === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
        </button>
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : lpList.length === 0 ? (
        <p className="text-gray-400">보관된 LP가 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {lpList.map((lp) => (
              <div
                key={lp.id}
                onClick={() => navigate(`/lp/${lp.id}`)}
                className="group relative w-full aspect-square overflow-hidden cursor-pointer"
              >
                {lp.thumbnail ? (
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm line-clamp-2">{lp.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-300 text-xs">
                      {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : ""}
                    </p>
                    <p className="text-gray-300 text-xs">❤️ {lp.likes?.length ?? 0}</p>
                  </div>
                </div>
              </div>
            ))}

            {isFetchingNextPage &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
          </div>

          <div ref={bottomRef} className="h-4" />
        </>
      )}
    </div>
  );
};

export default LPListPage;
