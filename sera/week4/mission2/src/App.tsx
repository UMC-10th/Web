import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
