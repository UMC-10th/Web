import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLPList } from "../hooks/useGetLPList";
import { LPCardSkeleton } from "../components/LPCardSkeleton";
import LPWriteModal from "../components/LPWriteModal";
import useDebounce from "../hooks/useDebounce";

const LPListPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search, 300);

  // useInView 대신 직접 ref + IntersectionObserver
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetLPList(sort, debouncedQuery);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const lpList = data?.pages.flatMap((page: any) => page.data.data) || [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1014] p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#FF1493] text-3xl font-bold">나의 LP 보관함</h1>
        <button
          onClick={() => setSort((prev) => (prev === "desc" ? "asc" : "desc"))}
          className="text-white bg-[#333] px-4 py-2 rounded-lg hover:bg-[#555]"
        >
          {sort === "desc" ? "⬇️ 최신순" : "⬆️ 오래된순"}
        </button>
      </div>

      {/* 검색창 */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="LP 제목을 검색해보세요..."
        className="w-full bg-[#1a1d24] text-white border-2 border-[#FF1493] rounded-lg px-4 py-3 mb-6 outline-none focus:border-white transition-colors placeholder-gray-500"
      />

      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1,2,3,4,5,6].map((n) => <LPCardSkeleton key={n} />)}
        </div>
      ) : lpList.length === 0 ? (
        <p className="text-gray-400 text-center mt-12">
          {debouncedQuery ? `"${debouncedQuery}" 검색 결과가 없습니다 😢` : "보관된 LP가 없습니다."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {lpList.map((lp: any) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lps/${lp.id}`)}
              className="group border border-[#FF1493] rounded-xl p-4 bg-[#111] flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                {lp.thumbnail ? (
                  <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-[#FF1493] font-bold text-lg mb-2 line-clamp-2">{lp.title}</h3>
                  <p className="text-gray-300 text-sm mb-1">
                    📅 {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : "날짜 모름"}
                  </p>
                  <p className="text-gray-300 text-sm">
                    ❤️ 좋아요 {Array.isArray(lp.likes) ? lp.likes.length : (lp.likes || 0)}개
                  </p>
                </div>
              </div>
              <h3 className="text-white font-bold truncate mt-4 px-1">{lp.title}</h3>
            </div>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {[1,2].map((n) => <LPCardSkeleton key={n} />)}
        </div>
      )}

      {!hasNextPage && lpList.length > 0 && (
        <p className="text-center text-xs py-6 text-gray-500">모든 LP를 불러왔습니다</p>
      )}

      {/* 무한스크롤 감지 */}
      <div ref={bottomRef} className="h-4" />

      {isModalOpen && <LPWriteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LPListPage;