import { Routes, Route } from "react-router-dom";
import MovieSearch from "./components/MovieSearch";
import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
  return (
    <Routes>
      {/* 홈: 검색 페이지 */}
      <Route path="/" element={<MovieSearch />} />
      {/* 영화 상세 페이지 라우팅 (/movies/:movieId) */}
      <Route path="/movies/:movieId" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default App;
