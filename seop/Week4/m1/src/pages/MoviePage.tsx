import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
  );

  if (isPending) return <LoadingSpinner />;

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-6 py-6">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-all duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        <span className="text-white font-semibold">{page} 페이지</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-all duration-200"
        >
          &gt;
        </button>
      </div>

      {/* 영화 그리드 */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-8 pb-10">
        {data?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}