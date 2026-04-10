import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { Credits, CrewMember, MovieDetails } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p";

function releaseYear(releaseDate: string): string {
    if (!releaseDate) return "";
    return releaseDate.slice(0, 4);
}

function directorsFromCrew(crew: CrewMember[]): CrewMember[] {
    return crew.filter((c) => c.job === "Director");
}

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    const axiosConfig = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
        }),
        [],
    );

    const detailUrl = movieId
        ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
        : null;
    const creditsUrl = movieId
        ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
        : null;

    const {
        data: detail,
        loading: detailLoading,
        error: detailError,
    } = useCustomFetch<MovieDetails>(detailUrl, axiosConfig);
    const {
        data: credits,
        loading: creditsLoading,
        error: creditsError,
    } = useCustomFetch<Credits>(creditsUrl, axiosConfig);

    const loading = detailLoading || creditsLoading;
    const error = detailError ?? creditsError;

    const castAndCrewRows = useMemo(() => {
        if (!credits) return [];
        const directors = directorsFromCrew(credits.crew);
        const castSorted = [...credits.cast].sort((a, b) => a.order - b.order);

        type Row = {
            key: string;
            name: string;
            sub: string;
            profile_path: string | null;
        };

        const rows: Row[] = [];

        for (const d of directors) {
            rows.push({
                key: `crew-${d.id}-${d.name}`,
                name: d.name,
                sub: "감독",
                profile_path: d.profile_path,
            });
        }

        for (const c of castSorted.slice(0, 18)) {
            rows.push({
                key: `cast-${c.id}-${c.order}`,
                name: c.name,
                sub: c.character || "출연",
                profile_path: c.profile_path,
            });
        }

        return rows;
    }, [credits]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <LoadingSpinner />
                <p className="text-sm text-zinc-500">영화 정보를 불러오는 중입니다…</p>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="flex h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
                <span className="text-xl font-medium text-red-600">
                    {error ?? "영화 정보를 불러올 수 없습니다."}
                </span>
                <p className="max-w-md text-sm text-zinc-600">
                    문제가 계속되면 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
                </p>
            </div>
        );
    }

    const backdropUrl = detail.backdrop_path
        ? `${TMDB_IMG_BASE}/w1280${detail.backdrop_path}`
        : detail.poster_path
          ? `${TMDB_IMG_BASE}/w780${detail.poster_path}`
          : null;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <article className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200/80">
                <div className="relative min-h-[320px] md:min-h-[380px]">
                    {backdropUrl ? (
                        <img
                            src={backdropUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-right"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-transparent md:via-black/50" />
                    <div className="relative z-10 flex min-h-[320px] flex-col justify-end gap-4 p-6 text-white md:min-h-[380px] md:max-w-[62%] md:justify-center md:p-10">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                            {detail.title}
                        </h1>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-200 md:text-base">
                            <span>평균 {detail.vote_average.toFixed(1)}</span>
                            <span className="text-zinc-500">·</span>
                            <span>{releaseYear(detail.release_date) || "—"}</span>
                            {detail.runtime != null && detail.runtime > 0 && (
                                <>
                                    <span className="text-zinc-500">·</span>
                                    <span>{detail.runtime}분</span>
                                </>
                            )}
                        </div>
                        {detail.tagline ? (
                            <p className="text-lg font-semibold italic text-zinc-100 md:text-xl">
                                {detail.tagline}
                            </p>
                        ) : null}
                        <p className="max-w-prose text-sm leading-relaxed text-zinc-100 md:text-base">
                            {detail.overview || "줄거리 정보가 없습니다."}
                        </p>
                    </div>
                </div>

                <div className="border-t border-zinc-100 bg-zinc-50/90 px-6 py-8 md:px-10">
                    <h2 className="mb-6 text-xl font-bold text-zinc-900">
                        감독/출연
                    </h2>
                    {castAndCrewRows.length === 0 ? (
                        <p className="text-sm text-zinc-500">
                            출연·제작 정보가 없습니다.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                            {castAndCrewRows.map((person) => {
                                const face = person.profile_path
                                    ? `${TMDB_IMG_BASE}/w185${person.profile_path}`
                                    : null;
                                return (
                                    <li
                                        key={person.key}
                                        className="flex flex-col items-center text-center"
                                    >
                                        {face ? (
                                            <img
                                                src={face}
                                                alt=""
                                                className="mb-2 aspect-square w-[72px] rounded-full object-cover ring-2 ring-white shadow-md sm:w-[80px]"
                                            />
                                        ) : (
                                            <div
                                                className="mb-2 flex aspect-square w-[72px] items-center justify-center rounded-full bg-zinc-300 text-xs text-zinc-600 ring-2 ring-white sm:w-[80px]"
                                                aria-hidden
                                            >
                                                ?
                                            </div>
                                        )}
                                        <span className="line-clamp-2 text-sm font-medium text-zinc-900">
                                            {person.name}
                                        </span>
                                        <span className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                                            {person.sub}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </article>
        </div>
    );
};

export default MovieDetailPage;
