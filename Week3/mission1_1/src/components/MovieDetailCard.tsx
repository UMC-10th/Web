import type { MovieDetail, MovieCredits } from "../types/movie";

interface MovieDetailCardProps {
  movieDetail?: MovieDetail;
  movieCredits?: MovieCredits;
}

export default function MovieDetailCard({
  movieDetail,
  movieCredits,
}: MovieDetailCardProps) {
  if (!movieDetail || !movieCredits) {
    return <div>영화 정보를 불러올 수 없습니다.</div>;
  }

  const { title, overview, poster_path, vote_average, release_date, runtime } =
    movieDetail;
  const { crew = [], cast = [] } = movieCredits;

  return (
    // 최상위 컨테이너
    <div className="bg-black text-white p-4">
      {/* 영화 포스터와 기본 정보 */}
      <div
        className="bg-cover bg-center p-4 rounded-md size-full h-[60vh] gap-4 flex flex-col justify-end"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)), url(https://image.tmdb.org/t/p/original${poster_path})`,
        }}
      >
        {/* 영화 제목과 기본 정보 */}
        <h1 className="py-5 text-2xl font-bold">{title}</h1>
        {/* 영화 평점, 개봉일, 상영시간 */}
        <div>
          {vote_average && <p>평균 {vote_average.toFixed(1)}</p>}
          {release_date && <p>{release_date.substring(0, 4)}</p>}
          {runtime && <p>{runtime}분</p>}
        </div>
        {/* 영화 개요 */}
        <p className="mt-4">{overview}</p>
      </div>
      {/* 감독과 출연진 정보 */}
      <div>
        <h1 className="border-t text-2xl font-bold py-4 w-1/3">감독/출연</h1>
        {/* 감독과 출연진을 그리드 형태로 나열 */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {/* 감독 정보 */}
          {crew.map((crewMember) => (
            <div
              key={crewMember.credit_id}
              className="flex flex-col items-center"
            >
              <img
                className="rounded-full object-cover w-32 h-32 border-2 border-white  "
                src={`https://image.tmdb.org/t/p/w300${crewMember.profile_path}`}
              />
              <p className="text-center font-semibold">{crewMember.name}</p>
              <p className="text-gray-500 text-center text-sm">
                {crewMember.job}
              </p>
            </div>
          ))}
          {/* 출연진을 그리드 형태로 나열 */}
          {cast.map((actor) => (
            <div key={actor.credit_id} className="flex flex-col items-center">
              <img
                className="rounded-full object-cover w-32 h-32 border-2 border-white"
                src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
              />
              <p className="text-center">{actor.name}</p>
              <p className="text-gray-500 text-center">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
