// src/pages/LPListPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLpList } from "../hooks/useGetLpList";
import { LpCardSkeleton } from "../components/LpCardSkeleton";
import { useThrottle } from "../hooks/useThrottle";

const LPListPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  // 현재 스크롤 위치를 state로 관리
  const [scrollY, setScrollY] = useState(0);

  // ⏱️ 스크롤 위치를 1초에 한 번만 갱신 — 빠른 스크롤 이벤트를 throttle로 제한
  const throttledScrollY = useThrottle(scrollY, 1000);

  // window scroll 이벤트 구독 (raw 이벤트는 매우 빠르게 발생)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🏃‍♂️ 무한 배달 비서 호출!
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useGetLpList(sort);

  // 💡 throttle된 스크롤 위치 기준으로 페이지 하단 여부 판단 → 1초마다 최대 1번만 실행
  useEffect(() => {
    const scrollBottom = throttledScrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight - 100;
    const isNearBottom = scrollBottom >= pageBottom;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      console.log("[useThrottle] fetchNextPage 호출 — 1초 throttle 적용됨");
      fetchNextPage();
    }
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 페이지 데이터들을 하나로 쭉 합쳐주기 (플랫하게 펴기!)
  const lpList = data?.pages.flatMap((page) => page.data.data) || [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">다시 시도</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[#FF1493] text-3xl font-bold">나의 LP 보관함</h1>
        <button 
          onClick={() => setSort(prev => prev === "latest" ? "oldest" : "latest")}
          className="text-white bg-[#333] px-4 py-2 rounded-lg hover:bg-[#555]"
        >
          {sort === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
        </button>
      </div>

      {/* 1. 최초 로딩 시 (상단 스켈레톤) */}
      {isPending ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => <LpCardSkeleton key={n} />)}
        </div>
      ) : lpList.length === 0 ? (
        <p className="text-gray-400">보관된 LP가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* 실제 데이터 렌더링 (카드 오버레이는 유지!) */}
          {lpList.map((lp) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lps/${lp.id}`)}
              className="group border border-[#FF1493] rounded-xl p-4 bg-[#111] flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                {lp.thumbnail ? (
                  <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-[#FF1493] font-bold text-lg mb-2 line-clamp-2">{lp.title}</h3>
                  <p className="text-gray-300 text-sm mb-1">
                    📅 {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : "날짜 모름"}
                  </p>
                  <p className="text-gray-300 text-sm">❤️ 좋아요 {lp.likes?.length ?? 0}개</p>
                </div>
              </div>
              <h3 className="text-white font-bold truncate mt-4 px-1">{lp.title}</h3>
            </div>
          ))}
        </div>
      )}

      {/* 2. 추가 로딩 시 (하단 스켈레톤) */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[1, 2].map((n) => <LpCardSkeleton key={n} />)}
        </div>
      )}

      <div className="h-10 mt-4" />
    </div>
  );
};

export default LPListPage;