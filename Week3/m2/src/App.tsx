import './App.css';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

/** 숫자만이면 영화 상세, 아니면(popular 등) 목록 페이지 */
function MoviesRoute() {
  const { id } = useParams<{ id: string }>();
  if (id && /^\d+$/.test(id)) {
    return <MovieDetailPage />;
  }
  return <MoviePage />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:id',
        element: <MoviesRoute />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App; 
 
