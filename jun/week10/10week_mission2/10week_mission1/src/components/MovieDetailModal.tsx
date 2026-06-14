import type { Movie } from "../types/movie";
import type { ReactElement } from "react";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps): ReactElement => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/w1280";
  const fallbackImageImage = "https://placehold.co/640x480/05110d/34d399?text=Poster+Not+Found";

  const tmdbLink = `https://www.themoviedb.org/movie/${movie.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-[#04120e] border border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all text-white scrollbar-thin scrollbar-thumb-emerald-900/50 scrollbar-track-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 border border-white/10 text-slate-400 hover:text-white rounded-full transition shadow-md text-xl leading-none cursor-pointer backdrop-blur-md"
          aria-label="닫기"
        >
          &times;
        </button>

        <div className="h-64 sm:h-80 overflow-hidden relative">
          <img
            src={movie.backdrop_path ? `${backdropBaseUrl}${movie.backdrop_path}` : fallbackImageImage}
            alt={`${movie.title} 배경 이미지`}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04120e] via-[#04120e]/40 to-transparent p-8 flex flex-col justify-end">
            <span className="inline-block self-start text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase mb-2">
              Database Info
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {movie.title}
            </h2>
            <p className="text-xs font-medium text-emerald-400/70 mt-1">{movie.original_title}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-1 -mt-36 sm:-mt-44 md:-mt-36 z-[1] flex flex-col items-center md:items-start">
            <img
              src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImageImage}
              alt={`${movie.title} 포스터`}
              className="w-full max-w-[200px] md:max-w-full rounded-2xl shadow-2xl border-2 border-white/10"
            />
            <div className="mt-4 flex items-center justify-start gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl w-full max-w-[200px] md:max-w-full justify-center md:justify-start">
              <span className="text-2xl font-black text-emerald-400">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 font-medium">({movie.vote_count}명 참여)</span>
            </div>
          </div>

          <div className="md:col-span-2 pt-0">

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">개봉일</p>
                <p className="text-sm font-semibold text-slate-200">{movie.release_date || '정보 없음'}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">원어 / 언어</p>
                <p className="text-sm font-semibold text-emerald-400">{movie.original_language.toUpperCase()}</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-emerald-400/90 uppercase tracking-wider mb-2">줄거리</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed font-normal text-justify whitespace-pre-wrap">
              {movie.overview || '등록된 줄거리 요약 정보가 없습니다.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
              <a
                href={tmdbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 h-11 flex items-center justify-center font-semibold text-xs text-[#030a08] bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                TMDB에서 자세히 보기
              </a>
              <button
                onClick={onClose}
                className="px-5 h-11 flex items-center justify-center font-semibold text-xs text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition duration-200 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
