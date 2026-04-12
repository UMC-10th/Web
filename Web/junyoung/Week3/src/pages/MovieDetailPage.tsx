import { useParams, useNavigate } from 'react-router-dom';
import { MovieDetail, Credits } from '../types/movie';
import useCustomFetch from '../hooks/useCustomFetch';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading: isLoadingDetail, error: errorDetail } =
    useCustomFetch<MovieDetail>(
      `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
    );

  const { data: credits, isLoading: isLoadingCredits, error: errorCredits } =
    useCustomFetch<Credits>(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
    );

  const isLoading = isLoadingDetail || isLoadingCredits;
  const error = errorDetail || errorCredits;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!movie) return null;

  const director = credits?.crew.find((c) => c.job === 'Director');

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* 배경 배너 */}
      <div
        className="relative w-full h-[500px] bg-no-repeat"
        style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/60 to-black/30" />

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-6 text-white text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full z-10"
        >
          ← 뒤로가기
        </button>

        {/* 배너 위 영화 정보 */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>·</span>
            <span>{movie.release_date}</span>
            <span>·</span>
            <span>{movie.runtime}분</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="text-xs border border-gray-400 text-gray-300 px-2 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* 줄거리 */}
        <div className="mb-12">
          <h2 className="text-lg font-bold mb-2">줄거리</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>

        <div className="mt-10" />

        {/* 감독/출연 */}
        <div>
          <h2 className="text-lg font-bold mb-4">감독/출연</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {/* 감독 */}
            {director && (
              <div className="flex flex-col items-center text-center">
                {director.profile_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${director.profile_path}`}
                    alt={director.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xl">
                    ?
                  </div>
                )}
                <p className="text-xs font-semibold mt-2">{director.name}</p>
                <p className="text-xs text-gray-500">감독</p>
              </div>
            )}
            {/* 출연진 */}
            {credits?.cast.slice(0, 11).map((actor) => (
              <div key={actor.id} className="flex flex-col items-center text-center">
                {actor.profile_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                    alt={actor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xl">
                    ?
                  </div>
                )}
                <p className="text-xs font-semibold mt-2">{actor.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
