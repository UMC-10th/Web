import { useParams, useNavigate } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CreditsResponse {
  cast: Cast[];
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
  </div>
);

const ErrorCard = ({ message }: { message: string }) => (
  <div className="mx-auto mt-16 max-w-md rounded-xl bg-red-900/40 border border-red-500/50 p-6 text-center text-red-300">
    <p className="text-2xl mb-2">⚠️</p>
    <p className="font-semibold">데이터를 불러오지 못했어요</p>
    <p className="text-sm mt-1 opacity-70">{message}</p>
  </div>
);

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useCustomFetch<MovieDetail>(
    movieId ? `${BASE_URL}/movie/${movieId}` : '',
    { api_key: API_KEY, language: 'ko-KR' }
  );

  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useCustomFetch<CreditsResponse>(
    movieId ? `${BASE_URL}/movie/${movieId}/credits` : '',
    { api_key: API_KEY, language: 'ko-KR' }
  );

  if (movieLoading || creditsLoading) return <Spinner />;
  if (movieError) return <ErrorCard message={movieError} />;
  if (creditsError) return <ErrorCard message={creditsError} />;
  if (!movie) return null;

  const cast = credits?.cast?.slice(0, 10) ?? [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {movie.backdrop_path && (
        <div
          className="fixed inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors text-sm"
        >
          ← 목록으로
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <img
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={movie.title}
              className="w-full md:w-64 rounded-2xl shadow-2xl shadow-black/60"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black leading-tight mb-2">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-yellow-400 italic text-sm mb-4">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 mb-6 text-sm text-zinc-400">
              <span>
                ⭐ <strong className="text-yellow-400">{movie.vote_average.toFixed(1)}</strong>
              </span>
              <span>📅 {movie.release_date}</span>
              <span>⏱ {movie.runtime}분</span>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm">{movie.overview}</p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">출연진</h2>

          {cast.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cast.map((person) => (
                <div
                  key={person.id}
                  className="bg-zinc-900/70 rounded-2xl p-4 text-center border border-zinc-800"
                >
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }
                    alt={person.name}
                    className="rounded-full w-24 h-24 mx-auto object-cover mb-3 border-2 border-zinc-700"
                  />
                  <p className="font-bold text-sm">{person.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">{person.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-sm">출연진 정보가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
}