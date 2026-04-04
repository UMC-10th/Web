import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTMyNGFlMjM2MDYzOTE3OThiZGY0NTA1N2E5YmY0ZiIsIm5iZiI6MTc3NTIxMDk1Ni45MjUsInN1YiI6IjY5Y2Y5MWNjMmFkZDY3OGI5OTVhMDFjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aAebKxtXXvzVutZ_mwETQitCluzq3lnE2HndnsdQw7w`, // 본인 TMDB 토큰으로 교체
          },
        }
      );

      console.log(data);
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
  <>
    <ul className="grid grid-cols-5 gap-2">
      {movies?.map((movie) => (
        <li key={movie.id} className="relative group overflow-hidden rounded-lg">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white font-bold">{movie.title}</h3>
            <p className="text-white text-xs mt-2 line-clamp-3">{movie.overview}</p>
          </div>
        <h2>{movie.title}</h2>
        <p>{movie.release_date}</p>
        </li>
      ))}
    </ul>
  </>
  );
};

export default MoviesPage;