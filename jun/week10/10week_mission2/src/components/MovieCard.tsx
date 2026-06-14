import type { Movie } from "../types/movie";
import type { ReactElement } from "react";

interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onMovieClick }: MovieCardProps): ReactElement => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImageImage = "https://placehold.co/640x480/05110d/34d399?text=Poster+Not+Found";

  const handleClick = () => {
    onMovieClick(movie);
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl bg-[#05110d]/40 border border-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:shadow-[0_12px_24px_-8px_rgba(52,211,153,0.15)] group"
      onClick={handleClick}
    >
      {/* 포스터 영역 */}
      <div className="relative h-80 overflow-hidden bg-[#030a08]">
        <img
          src={
            movie.poster_path
              ? `${imageBaseUrl}${movie.poster_path}`
              : fallbackImageImage
          }
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* 평점 표시: 블루에서 에메랄드 뱃지로 변경 */}
        <div className="absolute top-3 right-3 bg-emerald-500 text-[#030a08] text-[11px] font-black px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm">
          ★ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      {/* 영화 정보 텍스트 블록 */}
      <div className="p-5">
        <h3 className="mb-1.5 text-base font-extrabold text-white tracking-tight truncate group-hover:text-emerald-400 transition-colors">
          {movie.title}
        </h3>

        <p className="text-[11px] font-medium text-emerald-500/60 tracking-wider">
          {movie.release_date || "개봉일 미정"} · {movie.original_language.toUpperCase()}
        </p>

        <p className="mt-3 text-xs font-normal text-slate-400 h-16 overflow-hidden leading-relaxed text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
          {movie.overview || "등록된 줄거리 요약 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
