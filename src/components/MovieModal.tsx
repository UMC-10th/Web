import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { POSTER_BASE_URL_LARGE } from "../apis/tmdb";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const navigate = useNavigate();

  // ESC 키로 닫기 + 모달이 열린 동안 배경 스크롤 잠금
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // IMDb 검색 URL (영화 제목을 인코딩)
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
    movie.title
  )}`;

  return (
    // overlay 클릭 시 닫힘
    <div className="modal-overlay" onClick={onClose}>
      {/* 모달 박스 내부 클릭은 닫히지 않도록 버블링 차단 */}
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${movie.title} 상세 정보`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          aria-label="모달 닫기"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 상단 포스터 (없으면 placeholder) */}
        {movie.poster_path ? (
          <img
            className="modal__poster"
            src={`${POSTER_BASE_URL_LARGE}${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <div className="modal__poster modal__poster--empty">No Image</div>
        )}

        <div className="modal__body">
          <h2 className="modal__title">{movie.title}</h2>

          <div className="modal__meta">
            <span className="modal__rating">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="modal__release">
              개봉일: {movie.release_date || "정보 없음"}
            </span>
          </div>

          <p className="modal__overview">
            {movie.overview || "줄거리 정보가 없습니다."}
          </p>

          <div className="modal__actions">
            <a
              className="modal__imdb"
              href={imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              IMDb에서 검색하기
            </a>
            {/* /movies/:movieId 로 라우팅 이동 (라우트가 바뀌며 모달은 자동 언마운트) */}
            <button
              type="button"
              className="modal__detail-btn"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              상세 페이지로 이동
            </button>
            <button
              type="button"
              className="modal__close-btn"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
