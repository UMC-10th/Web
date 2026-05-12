import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types/movie';

// 카테고리를 props로 받아 하나의 컴포넌트로 재사용
type Props = {
  category: string; // 'popular' | 'upcoming' | 'top_rated' | 'now_playing'
};

const API_KEY = '199308621bd95ded352502e9d716d697';

const MovieListPage = ({ category }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [page, setPage] = useState(1); // 현재 페이지 번호

  // category 또는 page가 바뀔 때마다 API 재호출
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null); // 새 요청 시 에러 초기화

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=ko-KR&page=${page}`
        );
        const data = await res.json();
        setMovies(data.results);
      } catch {
        // 네트워크 에러 등 예외 처리
        setError('영화 데이터를 불러오는 데 실패했습니다.');
      } finally {
        // 성공/실패 관계없이 로딩 종료
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

return (
    <div className="p-8 min-h-screen bg-black">
      {/* 2. 핵심 부분: MovieCard 컴포넌트로 영화 목록을 렌더링합니다. */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          // 이제 각 카드는 MovieCard 내부의 onClick 로직을 통해 상세페이지로 이동합니다.
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center items-center gap-6 mt-12 pb-10">
        <button
          onClick={() => {
            setPage((p) => p - 1);
            window.scrollTo(0, 0); // 페이지 이동 시 상단으로 스크롤
          }}
          disabled={page === 1}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          이전
        </button>
        <span className="text-white font-bold">{page} 페이지</span>
        <button
          onClick={() => {
            setPage((p) => p + 1);
            window.scrollTo(0, 0);
          }}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MovieListPage;