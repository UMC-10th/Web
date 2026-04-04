import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import type { MovieDetails } from "../types/movie_detail";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Person , CreditsResponse } from "../types/credits";
import Profile from "../components/Profile";

export default function EachMoviePage() {
    const [movieDetails, setMovieDetails] = useState<MovieDetails>();
    const [cast, setCast] = useState<Person[]>([]);
    const [crew, setCrew] = useState<Person[]>([]);

    // 1. loading state
    const [isPending, setIsPending] = useState<boolean>(false);

    // 2. error state
    const [isError, setIsError] = useState<boolean>(false);

    // 주의!!! useParam으로 불러오는 건 무조건 string
    const { movieId } = useParams<{movieId: string}>();

    useEffect(() => {
        const fetchMovieDetails = async () : Promise<void> => {
            setIsPending(true);
            console.log(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`)
            try {
                // 영화 상세 정보와 출연진/제작진 정보를 병렬로 호출 (성능 최적화)
                const [detailsRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetails>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        { headers: { Authorization: import.meta.env.VITE_TMDB_KEY } }
                    ),
                    axios.get<CreditsResponse>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        { headers: { Authorization: import.meta.env.VITE_TMDB_KEY } }
                    )
                ]);
            
            // 영화 상세 정보 및 출연진/제작진 정보를 update
            setMovieDetails(detailsRes.data);
            setCast(creditsRes.data.cast);
            setCrew(creditsRes.data.crew);

            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
                setIsError(false);
            }
        };

        fetchMovieDetails();

    }, [movieId]); // movieId가 바뀔때 마다 업데이트를 해야하기 때문에 의존성 배열에 추가함

    return (
        <>
            {isPending && 
              <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
              </div>
            }
        
            {!isPending &&
              <div className="flex flex-col gap-10">
                <div 
                    className="relative w-full p-8 text-white bg-cover bg-center"
                    style={{ 
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${import.meta.env.VITE_TMDB_IMG_BASE_URL}${movieDetails?.backdrop_path})`
                    }}
                >
                    <h1 className="font-bold text-4xl mb-4">{movieDetails?.title} - {movieDetails?.release_date.split("-")[0]}</h1>
                    <div className="mb-10">
                        <p>평점: {movieDetails?.vote_average.toFixed(1)}</p>
                        <p>시간: {movieDetails?.runtime ? Math.floor(movieDetails.runtime / 60) : ""}시간 {movieDetails?.runtime ? movieDetails.runtime % 60 : ""}분</p>
                    </div>
                    <p className="italic font-bold text-2xl mb-4">{movieDetails?.tagline}</p>
                    <p className="w-150">{movieDetails?.overview}</p>
                </div>
                <div>
                    <h1 className="font-bold text-4xl mb-4 pl-8">감독</h1>
                    <div className="
                            grid 
                            grid-cols-4
                            sm:grid-cols-5
                            md:grid-cols-6
                            lg:grid-cols-7
                            xl:grid-cols-8
                            gap-x-1
                            gap-y-1
                            justify-start
                            "
                        >
                        {/* 감독만 찾기 위해 filtering */}
                        {crew?.map((person, idx) =>
                                person.job === "Director" && <Profile key={person.id} person={person}/>
                        )}
                    </div>
                </div>
                <div>
                    <h1 className="pl-8 font-bold text-4xl mb-4">배우</h1>
                    <div
                        className="
                            grid 
                            grid-cols-4
                            sm:grid-cols-5
                            md:grid-cols-6
                            lg:grid-cols-7
                            xl:grid-cols-8
                            gap-x-1
                            gap-y-10
                            justify-self-center
                            "
                          >
                            {/* 혹시 모를 경우, 즉 movie가 undefined / null인 경우에 대비해 optional chaining 활용 */}
                            {/* 배우들만 찾기 위해 filtering */}
                            {cast?.map((person, idx) =>
                               person.known_for_department === "Acting" && <Profile key={person.id} person={person}/>
                            )}
                    </div>
                </div>
              </div>
            }
        </>
    )
}