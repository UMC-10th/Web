import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetLPList } from "../hooks/useGetLPList";
import { LPCardSkeleton } from "../components/LPCardSkeleton";
import LPWriteModal from "../components/LPWriteModal";

const LPListPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref, inView } = useInView();

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useGetLPList(sort);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lpList = data?.pages.flatMap((page: any) => page.data.data) || [];

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
        <button onClick={() => setSort((prev) => (prev === "desc" ? "asc" : "desc"))} className="text-white bg-[#333] px-4 py-2 rounded-lg hover:bg-[#555]">
          {sort === "desc" ? "⬇️ 최신순" : "⬆️ 오래된순"}
        </button>
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 gap-4">{[1,2,3,4,5,6].map((n) => <LPCardSkeleton key={n} />)}</div>
      ) : lpList.length === 0 ? (
        <p className="text-gray-400">보관된 LP가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {lpList.map((lp: any) => (
            <div key={lp.id} onClick={() => navigate(`/lps/${lp.id}`)} className="group border border-[#FF1493] rounded-xl p-4 bg-[#111] flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                {lp.thumbnail ? <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#222] flex items-center justify-center text-gray-500">No Image</div>}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-[#FF1493] font-bold text-lg mb-2 line-clamp-2">{lp.title}</h3>
                  <p className="text-gray-300 text-sm mb-1">📅 {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : "날짜 모름"}</p>
                  <p className="text-gray-300 text-sm">❤️ 좋아요 {Array.isArray(lp.likes) ? lp.likes.length : (lp.likes || 0)}개</p>
                </div>
              </div>
              <h3 className="text-white font-bold truncate mt-4 px-1">{lp.title}</h3>
            </div>
          ))}
        </div>
      )}

      {isFetchingNextPage && <div className="grid grid-cols-2 gap-4 mt-4">{[1,2].map((n) => <LPCardSkeleton key={n} />)}</div>}
      <div ref={ref} className="h-10 mt-4"></div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF1493] text-white text-3xl rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center z-40">+</button>
      {isModalOpen && <LPWriteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LPListPage;