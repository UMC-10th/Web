import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './layout/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'v1/auth/google/callback', element: <GoogleCallbackPage /> },
      {
        // 로그인한 사용자만 접근 가능한 경로들
        element: <ProtectedRoute />,
        children: [
          { path: 'my', element: <MyPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
