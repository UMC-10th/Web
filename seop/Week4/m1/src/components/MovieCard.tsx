import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[2/3] shadow-lg"
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-white text-sm font-bold text-center mb-2">
          {movie.title}
        </h2>
        <p className="text-gray-300 text-xs text-center line-clamp-4">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
      </div>
    </div>
  );
}