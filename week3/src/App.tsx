import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MoviePage from "./pages/MoviePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <MoviePage />,
      },
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />,
      }
    ]
  },

]);

//movies/upcoming
//movies/popular
//movies/now_playing
//movies/top/rated
//movies?category=upcoming
//movies?category=popular
//movies/123
//movie/category/{movie_id}

function App() {
  return <RouterProvider router={router} />;
}

export default App;