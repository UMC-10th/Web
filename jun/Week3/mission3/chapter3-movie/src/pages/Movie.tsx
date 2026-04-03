import { useState, useEffect } from 'react';

// 영화 데이터 타입 정의
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
};

const MoviesPage = () => {
  // 영화 목록 상태
  const [movies, setMovies] = useState<Movie[]>([]);

  // 컴포넌트 마운트 시 1회 API 호출
  useEffect(() => {
    fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=199308621bd95ded352502e9d716d697&language=ko-KR'
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // 데이터 확인용 로그
        setMovies(data.results);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">인기 영화 목록</h1>
      {/* 반응형 그리드 레이아웃 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          // group: 부모에 hover 상태를 자식에게 전달
          <div key={movie.id} className="relative group cursor-pointer overflow-hidden rounded-lg">
            {/* 호버 시 blur 처리 */}
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
            />
            {/* 호버 시 제목 + 줄거리 오버레이 */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
              <p className="text-white font-bold text-sm">{movie.title}</p>
              <p className="text-gray-300 text-xs mt-1 line-clamp-3">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;