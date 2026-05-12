import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import Mypage from './pages/Mypage';
import { AuthProvider } from './context/AuthContext';
import ProtextedLayout from './layouts/ProtectedLayout';

const publicRoutes:RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
    ],
  }
]; 

const protextedRoutes:RouteObject[] = [
  {
    path:'/',
    element: <ProtextedLayout />,
    errorElement: <NotFoundPage />,
    children:[
      {
        path: 'my',
        element: <Mypage />,
      }
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...protextedRoutes]);

function App() {
  return ( 
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App
