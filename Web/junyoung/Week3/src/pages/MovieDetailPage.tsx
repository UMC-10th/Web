import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MovieDetail, Credits } from '../types/movie';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${TOKEN}` };

        const [detailRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers }
          ),
        ]);

        setMovie(detailRes.data);
        setCredits(creditsRes.data);
      } catch {
        setError('영화 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [movieId]);

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

  if (!movie) return null;

  return (
    <div>
      {/* 배경 배너 */}
      <div
        className="relative w-full h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-6 text-white text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 상세 정보 */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* 포스터 */}
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-36 rounded-xl shadow-lg flex-shrink-0 -mt-16 relative z-10"
          />
          {/* 텍스트 정보 */}
          <div className="pt-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{movie.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>·</span>
              <span>{movie.release_date}</span>
              <span>·</span>
              <span>{movie.runtime}분</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 줄거리 */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">줄거리</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>

        {/* 출연진 */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">출연진</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {credits?.cast.slice(0, 12).map((actor) => (
              <div key={actor.id} className="flex flex-col items-center text-center">
                {actor.profile_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                    alt={actor.name}
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                    ?
                  </div>
                )}
                <p className="text-xs font-semibold text-gray-800 mt-2">{actor.name}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
