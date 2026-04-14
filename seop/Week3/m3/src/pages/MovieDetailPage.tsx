import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetail, Credits } from '../types/movie';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDetail = async (): Promise<void> => {
      setIsPending(true);
      setIsError(false);
      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
          ),
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchDetail();
  }, [movieId]);

  if (isPending) return <LoadingSpinner />;

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
    </div>
  );

  if (!movie) return null;

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* 배경 이미지 */}
      <div
        className="w-full h-[400px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-8 left-8 flex gap-6 items-end">
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-36 rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-yellow-400 text-lg">⭐ {movie.vote_average.toFixed(1)}</p>
            <p className="text-gray-300">{movie.release_date.slice(0, 4)}년 · {movie.runtime}분</p>
          </div>
        </div>
      </div>

      {/* 줄거리 */}
      <div className="px-8 py-6">
        <h2 className="text-xl font-bold mb-3 italic">{movie.overview || '줄거리 정보가 없습니다.'}</h2>
      </div>

      {/* 출연진 */}
      {credits && (
        <div className="px-8 pb-10">
          <h2 className="text-xl font-bold mb-4">감독/출연</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {credits.cast.slice(0, 20).map((person) => (
              <div key={person.id} className="flex flex-col items-center min-w-[80px]">
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : 'https://via.placeholder.com/80x80?text=No+Image'
                  }
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <p className="text-xs text-center font-semibold">{person.name}</p>
                <p className="text-xs text-center text-gray-400">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 관련 영화 목록 (하단) */}
      <div className="px-8 pb-10">
        <h2 className="text-xl font-bold mb-4">인기 영화</h2>
      </div>
    </div>
  );
}