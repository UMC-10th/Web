import { useParams, useNavigate } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import type { MovieDetail, Credits } from '../types/movie';

const API_KEY = '199308621bd95ded352502e9d716d697';

const MovieDetailPage = () => {
  // useParams로 URL의 :movieId 값을 추출
  const { movieId } = useParams();
  const navigate = useNavigate();

  // 영화 상세 정보 요청
  const { data: movie, isLoading: movieLoading, error: movieError } =
    useCustomFetch<MovieDetail>(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
    );

  // 출연진/제작진 정보 요청 (상세 정보와 동시에 요청됨)
  const { data: credits, isLoading: creditsLoading } =
    useCustomFetch<Credits>(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`
    );

  // 두 요청 중 하나라도 로딩 중이면 스피너 표시
  if (movieLoading || creditsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 발생 또는 데이터 없을 때 에러 메시지 표시
  if (movieError || !movie) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{movieError ?? '영화를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  // crew 중 job이 'Director'인 사람을 감독으로 추출
  const director = credits?.crew.find((c) => c.job === 'Director');

  return (
    <div className="min-h-screen p-8">
      {/* navigate(-1): 이전 페이지로 이동 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-500 hover:text-black transition"
      >
        ← 뒤로가기
      </button>

      {/* 포스터 + 영화 정보 가로 배치 (모바일은 세로) */}
      <div className="flex gap-8 flex-col md:flex-row">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg w-60 shrink-0"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          {/* 태그라인이 있을 때만 표시 */}
          {movie.tagline && <p className="text-green-500 italic">"{movie.tagline}"</p>}
          <div className="flex gap-4 text-sm text-gray-500">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>🕐 {movie.runtime}분</span>
            <span>📅 {movie.release_date}</span>
          </div>
          {/* 장르 태그 목록 */}
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((g) => (
              <span key={g.id} className="px-2 py-1 bg-gray-200 rounded text-xs">
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
          {director && (
            <p className="text-sm text-gray-500">
              🎬 감독: <span className="text-black">{director.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* 출연진 목록 (최대 16명) */}
      {credits && credits.cast.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">출연진</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {credits.cast.slice(0, 16).map((actor) => (
              <div key={actor.id} className="text-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://placehold.co/100x150?text=No+Image' // 프로필 없을 때 대체 이미지
                  }
                  alt={actor.name}
                  className="rounded-lg w-full object-cover aspect-[2/3]"
                />
                <p className="text-xs mt-1 font-semibold">{actor.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
