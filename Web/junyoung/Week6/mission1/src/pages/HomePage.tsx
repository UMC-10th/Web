import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLps } from '../api/lps';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';
import type { SortOrder } from '../types/lp';

const HomePage = () => {
  const [sort, setSort] = useState<SortOrder>('desc');
  const { data: lps = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLps(sort),
  });

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">LP 목록</h1>
        <div className="flex rounded-md border border-gray-700 p-1">
          <button
            onClick={() => setSort('desc')}
            className={`rounded px-3 py-1 text-sm ${sort === 'desc' ? 'bg-pink-500 text-white' : 'text-gray-300'}`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('asc')}
            className={`rounded px-3 py-1 text-sm ${sort === 'asc' ? 'bg-pink-500 text-white' : 'text-gray-300'}`}
          >
            오래된순
          </button>
        </div>
      </div>

      {isError && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          목록을 불러오지 못했습니다.
          <button onClick={() => refetch()} className="ml-3 font-semibold underline">
            다시 시도
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => <LpCardSkeleton key={index} />)
          : lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}
      </div>
    </section>
  );
};

export default HomePage;
