import { useState } from "react";
import { Link } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data, isPending, isError, refetch } = useGetLpList({ order });

  const handleSortToggle = () => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

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
            <div
              key={i}
              className="animate-pulse bg-white/5 rounded-xl h-64"
            ></div>
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

      {!isPending && !isError && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((lp) => (
            <Link
              to={`/lp/${lp.id}`}
              key={lp.id}
              className="group relative block rounded-xl overflow-hidden bg-[#242424] hover:shadow-xl hover:shadow-black/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="aspect-video w-full bg-black relative">
                {lp.thumbnail ? (
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                    No Image
                  </div>
                )}
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">자세히 보기</span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-lg font-bold text-white truncate">
                  {lp.title}
                </h2>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{lp.likes?.length || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {data.length === 0 && (
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
