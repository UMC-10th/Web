import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import MovieListPage from './pages/MovieListPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies/popular', element: <MovieListPage category="popular" /> },
      { path: 'movies/upcoming', element: <MovieListPage category="upcoming" /> },
      { path: 'movies/top-rated', element: <MovieListPage category="top_rated" /> },
      { path: 'movies/now-playing', element: <MovieListPage category="now_playing" /> },
      // 동적 라우팅: movieId에 어떤 값이든 들어올 수 있음
      { path: 'movies/:movieId', element: <MovieDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
