import { memo } from "react";
import type { Movie } from "../types/movie";
import { POSTER_BASE_URL } from "../apis/tmdb";

interface MovieCardProps {
  movie: Movie;
  // 부모에서 useCallback으로 참조를 고정해 넘겨야 memo가 제대로 동작한다.
  onSelect: (movie: Movie) => void;
}

function MovieCardBase({ movie, onSelect }: MovieCardProps) {
  // [2단계] 자식 렌더 추적용 로그.
  // 최적화 전: 부모에서 검색어를 타이핑할 때마다 이 로그가 카드 수만큼 찍힌다.
  // 최적화 후(memo + useCallback): props가 같으면 이 로그가 더 이상 찍히지 않는다.
  console.log("🎬 [MovieCard] render:", movie.title);

  return (
    <li className="movie-card" onClick={() => onSelect(movie)}>
      {movie.poster_path ? (
        <img
          className="movie-card__poster"
          src={`${POSTER_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="movie-card__poster movie-card__poster--empty">
          No Image
        </div>
      )}
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__rating">⭐ {movie.vote_average.toFixed(1)}</p>
        <p className="movie-card__overview">
          {movie.overview || "개요 정보가 없습니다."}
        </p>
      </div>
    </li>
  );
}

// [3단계] memo: props(movie, onSelect)가 얕은 비교로 같으면 리렌더를 건너뛴다.
// onSelect가 매 렌더마다 새 함수면 memo가 무력화되므로 부모에서 useCallback 필수.
const MovieCard = memo(MovieCardBase);
export default MovieCard;
