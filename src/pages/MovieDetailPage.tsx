import { Link, useParams } from "react-router-dom";

// 미션 2 요구사항: /movies/:movieId 라우팅 동작 확인용 페이지.
// (실제 디자인은 필요 없으므로 파라미터가 잘 넘어오는지만 보여준다.)
function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  return (
    <main className="container">
      <h1 className="heading">🎬 영화 상세 페이지</h1>
      <p className="status">
        URL 파라미터 <code>movieId</code> = <strong>{movieId}</strong>
      </p>
      <p className="status">
        <Link to="/">← 검색 페이지로 돌아가기</Link>
      </p>
    </main>
  );
}

export default MovieDetailPage;
