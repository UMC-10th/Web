import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import type { Movie } from '../types/movie';

const API_KEY = '199308621bd95ded352502e9d716d697';

// API 응답 구조: results 배열 안에 영화 목록이 담겨 있음
interface MovieListResponse {
  results: Movie[];
}

type Props = {
  category: string; // 'popular' | 'upcoming' | 'top_rated' | 'now_playing'
};

const MovieListPage = ({ category }: Props) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // category 또는 page가 바뀌면 url이 바뀌고, useCustomFetch가 자동으로 재요청함
  const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=ko-KR&page=${page}`;
  const { data, isLoading, error } = useCustomFetch<MovieListResponse>(url);

  // 데이터 로딩 중 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 발생 시 친절한 에러 메시지 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* 영화 포스터 그리드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data?.results.map((movie) => (
          // 포스터 클릭 시 상세 페이지로 이동
          <div
            key={movie.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => navigate(`/movies/${movie.id}`)}
          >
            {/* 호버 시 blur 처리 */}
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
            />
            {/* 호버 시 제목 + 줄거리 오버레이 */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
              <p className="text-white font-bold text-sm">{movie.title}</p>
              <p className="text-gray-300 text-xs mt-1 line-clamp-3">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-30"
        >
          이전
        </button>
        <span className="text-gray-700">{page} 페이지</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MovieListPage;
