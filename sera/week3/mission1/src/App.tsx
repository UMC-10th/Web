import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Movies from './pages/Movie';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Movies />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;