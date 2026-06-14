import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/:id',
    element: <MovieDetailPage />
  }
]);

function App(){
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
