import { useParams } from "react-router"
import { LoadingSpinner } from "../components/LoadingSpinner";
import Profile from "../components/Profile";
import { useEachMovie } from "../hooks/useCustomFetch";

export default function EachMoviePage() {
    // 주의!!! useParam으로 불러오는 건 무조건 string
    const { movieId } = useParams<{movieId: string}>();

    // custom hook 사용 - useEachMovie
    const { isError, isPending, movieDetails, cast, crew } = useEachMovie({movieId: movieId || ""});

    if(isError) { // error 발생 시
        return (
        <div className="flex justify-center items-center text-2xl text-red-400">
            <span>Error 발생!</span>
        </div>
        );
    }

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