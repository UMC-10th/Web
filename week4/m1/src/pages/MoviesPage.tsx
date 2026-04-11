import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
  </div>
);

const ErrorCard = ({ message }: { message: string }) => (
  <div className="mx-auto mt-16 max-w-md rounded-xl border border-red-500/50 bg-red-900/40 p-6 text-center text-red-300">
    <p className="mb-2 text-2xl">⚠️</p>
    <p className="font-semibold">데이터를 불러오지 못했어요</p>
    <p className="mt-1 text-sm opacity-70">{message}</p>
  </div>
);

const MovieCard = ({ movie }: { movie: Movie }) => (
  <Link
    to={`/movies/${movie.id}`}
    className="group relative overflow-hidden rounded-2xl bg-zinc-900 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-yellow-400/20"
  >
    {movie.poster_path ? (
      <img
        src={`${IMG_BASE}${movie.poster_path}`}
        alt={movie.title}
        className="aspect-[2/3] w-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="flex aspect-[2/3] w-full items-center justify-center bg-zinc-800 text-sm text-zinc-500">
        이미지 없음
      </div>
    )}

    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <p className="line-clamp-2 text-sm font-bold text-white">{movie.title}</p>
      <p className="mt-1 text-xs text-yellow-400">
        ⭐ {movie.vote_average.toFixed(1)} · {movie.release_date?.slice(0, 4)}
      </p>
      <p className="mt-2 line-clamp-3 text-xs text-zinc-300">{movie.overview}</p>
    </div>

    <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-yellow-400">
      ⭐ {movie.vote_average.toFixed(1)}
    </div>
  </Link>
);

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<'popular' | 'top_rated' | 'upcoming' | 'now_playing'>(
    'popular'
  );

  const { data, isLoading, error } = useCustomFetch<TMDBResponse>(
    `${BASE_URL}/movie/${category}`,
    { api_key: API_KEY, language: 'ko-KR', page }
  );

  const categories = [
    { key: 'popular', label: '🔥 인기' },
    { key: 'top_rated', label: '⭐ 높은 평점' },
    { key: 'upcoming', label: '🎬 개봉 예정' },
    { key: 'now_playing', label: '🍿 현재 상영' },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-2xl font-black tracking-tight">
          🎥 <span className="text-yellow-400">MOVIE</span> BOX
        </h1>

        <nav className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setCategory(c.key);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                category === c.key
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {isLoading && <Spinner />}
        {error && <ErrorCard message={error} />}

        {!isLoading && !error && data && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {data.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full bg-zinc-800 px-5 py-2 text-sm transition-colors hover:bg-zinc-700 disabled:opacity-30"
              >
                ← 이전
              </button>

              <span className="flex items-center px-5 py-2 text-sm text-zinc-400">
                {page} / {data.total_pages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
                className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-yellow-300 disabled:opacity-30"
              >
                다음 →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}