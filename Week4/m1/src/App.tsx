import './App.css';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

function MoviesRoute() {
  const { movieId } = useParams<{ movieId: string }>();
  if (movieId && /^\d+$/.test(movieId)) {
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
        path: 'movies/:movieId',
        element: <MoviesRoute />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App; 
 
