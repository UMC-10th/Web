import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchLps } from "../hooks/useSearchLps";
import { LpCardSkeleton } from "../components/LpCardSkeleton";

const SearchPage = () => {
  const navigate = useNavigate();

  // [요구사항 2] 사용자의 실제 입력값
  const [inputValue, setInputValue] = useState("");

  // [요구사항 2] 300ms 뒤에 안정된 값 → 이 값으로만 API 호출
  const debouncedQuery = useDebounce(inputValue, 300);

  // 공백·빈 문자열 검증 (hook 내부와 동일 조건 → UI 분기에도 활용)
  const isValidQuery = debouncedQuery.trim().length > 0;

  const { ref, inView } = useInView();

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLps(debouncedQuery);

  // 센티넬 div가 뷰포트에 들어오면 다음 페이지 요청
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <h1 className="text-[#FF1493] text-3xl font-bold mb-6">LP 검색</h1>

      {/* 검색 입력창 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="검색어를 입력하세요..."
        className="w-full max-w-md px-4 py-3 rounded-lg bg-white border border-[#333] text-black placeholder-gray-400 focus:outline-none focus:border-[#FF1493] mb-8"
      />

      {/* 검색어 미입력 안내 */}
      {!isValidQuery && (
        <p className="text-gray-500">검색어를 입력해 주세요.</p>
      )}

      {/* 유효한 검색어로 첫 로딩 중 */}
      {isValidQuery && isPending && (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <LpCardSkeleton key={n} />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isValidQuery && isError && (
        <p className="text-red-500 font-bold">검색 중 오류가 발생했습니다.</p>
      )}

      {/* 검색 결과 없음 */}
      {isValidQuery && !isPending && !isError && lpList.length === 0 && (
        <p className="text-gray-400">
          &ldquo;{debouncedQuery}&rdquo;에 대한 결과가 없습니다.
        </p>
      )}

      {/* 검색 결과 그리드 */}
      {lpList.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {lpList.map((lp) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lps/${lp.id}`)}
              className="group border border-[#FF1493] rounded-xl p-4 bg-[#111] flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                {lp.thumbnail ? (
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-[#FF1493] font-bold text-lg mb-2 line-clamp-2">
                    {lp.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    ❤️ 좋아요 {lp.likes?.length ?? 0}개
                  </p>
                </div>
              </div>
              <h3 className="text-white font-bold truncate mt-4 px-1">
                {lp.title}
              </h3>
            </div>
          ))}
        </div>
      )}

      {/* 추가 페이지 로딩 스켈레톤 */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[1, 2].map((n) => (
            <LpCardSkeleton key={n} />
          ))}
        </div>
      )}

      {/* 무한 스크롤 센티넬 */}
      <div ref={ref} className="h-10 mt-4" />
    </div>
  );
};

export default SearchPage;
