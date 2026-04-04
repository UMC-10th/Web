import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MoviesPage from './pages/movies';
import NotFound from './pages/not-found';
import HomePage from './pages/home';
import EachMoviePage from './pages/eachmovie';

// 경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/movies/:category',
        element: <MoviesPage />,
      },
      {
        path: '/movies/detail/:movieId',
        element: <EachMoviePage />
      }
    ],
  },
]);

function App() {
  return <>
    <RouterProvider router={router}/>
  </>
}

export default App;