import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Credits, CrewMember, MovieDetails } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

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
    const [detail, setDetail] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!movieId) {
            setIsPending(false);
            setIsError(true);
            return;
        }

        const controller = new AbortController();

        const load = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const headers = {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                };
                const [detailRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetails>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        { headers, signal: controller.signal },
                    ),
                    axios.get<Credits>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        { headers, signal: controller.signal },
                    ),
                ]);
                setDetail(detailRes.data);
                setCredits(creditsRes.data);
            } catch {
                if (!controller.signal.aborted) {
                    setIsError(true);
                    setDetail(null);
                    setCredits(null);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsPending(false);
                }
            }
        };

        void load();
        return () => controller.abort();
    }, [movieId]);

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

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !detail) {
        return (
            <div className="flex h-dvh items-center justify-center">
                <span className="text-xl text-red-500">에러가 발생했습니다.</span>
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
