import { useCallback, useMemo, useState, type FormEvent } from "react";
import type { Language, Movie } from "../types/movie";
import { searchMovies } from "../apis/tmdb";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

function MovieSearch() {
  // [1단계] 검색 폼 상태들
  const [title, setTitle] = useState(""); // text input 값
  const [includeAdult, setIncludeAdult] = useState(false); // checkbox 값
  const [language, setLanguage] = useState<Language>("ko-KR"); // select 값

  // 검색 결과 / 로딩 / 에러 상태
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상세 모달에 띄울 영화. null이면 모달이 닫힌 상태.
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // [2단계] 부모 렌더 추적용 로그.
  // 검색어를 한 글자 칠 때마다 title state가 바뀌어 이 로그가 찍힌다(부모 리렌더).
  console.log("👪 [MovieSearch] render. title =", title);

  // form 제출 시에만 실제 검색을 수행한다 (엔터 입력만으로도 동작).
  // 주의: handleSubmit은 form에서만 쓰고 memo된 자식에게 넘기지 않으므로
  //       useCallback으로 감싸도 이득이 없다 -> 일부러 감싸지 않는다.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return; // 빈 검색어는 API 호출하지 않음

    setIsLoading(true);
    setError(null);
    try {
      const results = await searchMovies({
        query: trimmed,
        includeAdult,
        language,
      });
      setMovies(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다.");
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // [3단계] useCallback: memo된 MovieCard에 넘기는 핸들러의 참조를 고정한다.
  // setState 함수만 사용하고 외부 값에 의존하지 않으므로 deps는 빈 배열 -> 참조가 항상 동일.
  // 이렇게 해야 타이핑(부모 리렌더) 시에도 카드의 onSelect prop이 바뀌지 않아 memo가 유지된다.
  // 카드를 클릭하면 해당 영화를 selectedMovie로 지정 -> 상세 모달 오픈.
  const handleSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  // 모달 닫기: selectedMovie를 null로. 마찬가지로 참조 고정.
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // [3단계] useMemo: 평점순(내림차순) 정렬은 movies가 바뀔 때만 다시 계산한다.
  // 타이핑으로 부모가 리렌더돼도 movies 참조가 그대로면 정렬을 재실행하지 않고,
  // 같은 배열 참조를 반환하므로 카드들의 movie prop도 안정적으로 유지된다.
  const sortedMovies = useMemo(() => {
    console.log("🧮 [useMemo] 평점순 정렬 계산");
    return [...movies].sort((a, b) => b.vote_average - a.vote_average);
  }, [movies]);

  return (
    <main className="container">
      <h1 className="heading">🎥 TMDB 영화 검색</h1>

      {/* 검색 영역: form으로 감싸 엔터만으로도 검색 */}
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-form__input"
          placeholder="영화 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="search-form__select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          <option value="ko-KR">한국어</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>

        <label className="search-form__checkbox">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
          />
          성인 콘텐츠 포함
        </label>

        <button type="submit" className="search-form__button">
          검색
        </button>
      </form>

      {/* 상태 표시 */}
      {isLoading && <p className="status">불러오는 중...</p>}
      {error && <p className="status status--error">{error}</p>}
      {!isLoading && !error && sortedMovies.length === 0 && (
        <p className="status">검색 결과가 여기에 표시됩니다.</p>
      )}

      {/* 결과 리스트 (평점순 정렬된 sortedMovies 사용) */}
      <ul className="movie-list">
        {sortedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={handleSelect} />
        ))}
      </ul>

      {/* selectedMovie가 있을 때만 상세 모달 렌더 */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </main>
  );
}

export default MovieSearch;
