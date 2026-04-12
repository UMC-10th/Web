import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Movie, MovieResponse } from '../types/movie';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const CATEGORY_LABELS: Record<string, string> = {
  popular: '인기 영화',
  upcoming: '개봉 예정',
  'top-rated': '평점 높은 영화',
  'now-playing': '현재 상영 중',
};

const CATEGORY_TO_ENDPOINT: Record<string, string> = {
  popular: 'popular',
  upcoming: 'upcoming',
  'top-rated': 'top_rated',
  'now-playing': 'now_playing',
};

const MoviesPage = () => {
  const { category = 'popular' } = useParams<{ category: string }>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = CATEGORY_TO_ENDPOINT[category] ?? 'popular';
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${endpoint}?language=ko-KR&page=${page}`,
          { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setError('영화 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-6">
      <h1 className="text-gray-900 text-xl font-bold mb-4 self-start max-w-3xl w-full">
        {CATEGORY_LABELS[category] ?? '영화 목록'}
      </h1>

      {/* 페이지네이션 - 상단 */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
        >
          &lt;
        </button>
        <span className="text-sm text-gray-600">{page} 페이지</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
        >
          &gt;
        </button>
      </div>

      {/* 영화 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-3xl">
        {movies?.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${category}/${movie.id}`}
            className="relative group rounded-2xl overflow-hidden aspect-[2/3] shadow-md block"
          >
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-white font-bold text-sm mb-2">{movie.title}</h2>
              <p className="text-gray-200 text-xs line-clamp-4">{movie.overview}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
