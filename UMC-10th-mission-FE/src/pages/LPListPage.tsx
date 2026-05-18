// src/pages/LPListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLpList } from "../hooks/useGetLpList"; // 👈 비서 훅 임포트
import type { Lp } from "../types/lp"; // 👈 [수정] 팝콘이 만든 진짜 타입 불러오기!

interface LpItem {
  id: string;
  thumbnail?: string;
  title: string;
}

const LPListPage = () => {
  const navigate = useNavigate();
  // 정렬 상태 관리 ('latest' 또는 'oldest')
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  // 비서 호출! (데이터, 로딩상태, 에러상태, 다시불러오기 함수 받기)
  const { data: response, isPending, isError, refetch } = useGetLpList(sort);

  const lpList: Lp[] = response?.data?.data ?? [];

  // 1. 에러 났을 때 보여줄 UI
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다 😭</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#FF1493] text-white rounded">다시 시도</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[#FF1493] text-3xl font-bold">나의 LP 보관함</h1>
        {/* 정렬 토글 버튼 */}
        <button 
          onClick={() => setSort(prev => prev === "latest" ? "oldest" : "latest")}
          className="text-white bg-[#333] px-4 py-2 rounded-lg hover:bg-[#555]"
        >
          {sort === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
        </button>
      </div>

      {/* 2. 로딩 중일 때 보여줄 Skeleton UI */}
      {isPending ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border border-[#333] rounded-xl p-4 bg-[#111] animate-pulse h-48"></div>
          ))}
        </div>
      ) : lpList.length === 0 ? (
        <p className="text-gray-400">보관된 LP가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {lpList.map((lp) => (
            // 1️⃣ 라우팅 연결 (onClick) & 카드 확대 (hover:scale-105)
            // 💡 Tailwind의 'group' 클래스를 넣어야 자식 요소가 마우스를 인식해!
            <div
              key={lp.id}
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="group border border-[#FF1493] rounded-xl p-4 bg-[#111] flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* 썸네일 영역 (여기에 오버레이를 덮을 거야) */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                {lp.thumbnail ? (
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                {/* 2️⃣ 호버 오버레이 (메타 정보 노출) */}
                {/* 💡 기본은 투명(opacity-0)인데, 부모(group)에 마우스가 올라가면 짠!(group-hover:opacity-100) */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-[#FF1493] font-bold text-lg mb-2 line-clamp-2">
                    {lp.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    📅 {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : "날짜 모름"}
                  </p>
                  <p className="text-gray-300 text-sm">
                    ❤️ 좋아요 {lp.likes || 0}개
                  </p>
                </div>
              </div>

              {/* 카드 하단에 항상 보이는 기본 제목 */}
              <h3 className="text-white font-bold truncate mt-4 px-1">{lp.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LPListPage;