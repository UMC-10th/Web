import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { MovieDetail, CreditResponse, Cast } from '../types/movie';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      try {
        const options = {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
        };
        
        // 상세 정보와 크레딧 정보를 동시에 호출
        const [detailRes, creditRes] = await Promise.all([
          axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, options),
          axios.get<CreditResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, options)
        ]);

        setMovie(detailRes.data);
        setCast(creditRes.data.cast);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (isLoading) return <div className="text-white">로딩 중...</div>;
  if (isError || !movie) return <div className="text-red-500">에러가 발생했습니다.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상단 배너 섹션 */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute bottom-10 left-10 flex gap-8 items-end">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-64 rounded-lg shadow-2xl"
          />
          <div className="mb-4">
            <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
            <p className="text-xl">평점: ⭐ {movie.vote_average.toFixed(1)}</p>
            <p className="mt-4 max-w-2xl text-gray-300">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* 출연진 섹션 */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {cast.slice(0, 16).map((person) => (
            <div key={person.id} className="text-center">
              <div className="w-full aspect-square rounded-full overflow-hidden mb-2 border-2 border-gray-700">
                <img 
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x200?text=No+Image'} 
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-bold text-sm truncate">{person.name}</p>
              <p className="text-xs text-gray-400 truncate">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}