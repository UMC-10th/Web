import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLpList } from '../apis/lp';
import LpCard from '../components/LpCard';

export default function HomePage() {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['lps', order],
    queryFn: () => getLpList(order),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const lps = data?.data?.data ?? [];

  return (
    <div className="p-4">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-4">
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

      {/* 로딩 */}
      {isPending && (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

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

      {/* LP 그리드 */}
      {!isPending && !isError && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
          {lps.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}
    </div>
  );
}