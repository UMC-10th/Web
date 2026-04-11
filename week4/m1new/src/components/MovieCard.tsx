import type { Movie } from "../types/movie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        className="w-full h-full object-cover"
      />

      {isHovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/50 to-transparent p-4 text-white backdrop-blur-md">
          <h2 className="text-center text-lg font-bold leading-snug">
            {movie.title}
          </h2>
          <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-gray-300">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}