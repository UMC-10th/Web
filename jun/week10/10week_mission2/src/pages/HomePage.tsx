import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import useFetch from "../hooks/useFetch";
import type { MovieResponse, Movie, MovieFilters } from "../types/movie";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieDetailModal from "../components/MovieDetailModal";

export default function HomePage(): ReactElement {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const options = useMemo(() => ({
    params: filters,
  }), [filters]);

  const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", options);

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <main className="relative min-h-screen bg-[#030a08] font-sans overflow-hidden selection:bg-emerald-500/30 text-white pb-20">
      <div className="absolute top-[-200px] left-[-100px] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-200px] w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl px-4 pt-12 z-10">
        <header className="mb-8 border-b border-white/5 pb-6">
          <span className="inline-block text-[10px] font-black tracking-[0.15em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase mb-3">
            TMDB Open API Engine
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            영화 <span className="text-emerald-400">검색기</span>
          </h1>
        </header>

        {/* 필터 섹션 포장 */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-8 backdrop-blur-xl shadow-xl">
          <MovieFilter onChange={setFilters} />
        </section>

        {/* 콘텐츠 본문 영역 */}
        <section className="relative min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 text-base font-medium text-emerald-400/70">
              <span className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <span>실시간 데이터를 동기화하고 있습니다...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 font-semibold">
              {error}
            </div>
          ) : (
            <div className="animate-[pop_0.30s_ease-in-out]">
              <MovieList movies={data?.results || []} onMovieClick={setSelectedMovie} />
            </div>
          )}
        </section>

        {/* 모달 연동 레이어 */}
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </main>
  );
}
