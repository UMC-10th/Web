import { useMemo, useState } from "react";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { movieId: category } = useParams<{
        movieId: string;
    }>();

    const url =
        category != null && category !== ""
            ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
            : null;

    const axiosConfig = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
        }),
        [],
    );

    const { data, loading, error } = useCustomFetch<MovieResponse>(
        url,
        axiosConfig,
    );

    const movies = data?.results ?? [];

    if (error) {
        return (
            <div className="flex h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
                <span className="text-xl font-medium text-red-600">{error}</span>
                <p className="max-w-md text-sm text-zinc-600">
                    문제가 계속되면 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mt-5 flex items-center justify-center gap-6">
                <button
                    className="cursor-pointer rounded-lg bg-[#dda5e3] px-6 py-3 text-white shadow-md transition-all duration-200 hover:bg-[#b2dab1] disabled:cursor-not-allowed disabled:bg-gray-300"
                    disabled={page === 1}
                    onClick={() => setPage((prev: number) => prev - 1)}
                >
                    {"<"}
                </button>
                <span>{page} 페이지</span>
                <button
                    className="cursor-pointer rounded-lg bg-[#dda5e3] px-6 py-3 text-white shadow-md transition-all duration-200 hover:bg-[#b2dab1]"
                    onClick={() => setPage((prev: number) => prev + 1)}
                >
                    {">"}
                </button>
            </div>

            {loading && (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-12">
                    <LoadingSpinner />
                    <p className="text-sm text-zinc-500">영화 목록을 불러오는 중입니다…</p>
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-2 justify-items-center gap-4 p-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>
    );
}
