import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import NotFoundErr from './pages/NotFoundErr'
import Login from './pages/Login'
import HomeLayout from './layouts/HomeLayout'
import SignUp from './pages/SignUp'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import PrivateLayout from './layouts/PrivateLayout'
import GoogleLoginRedirect from './pages/GoogleLoginRedirect'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LpDetailPage from './pages/LpDetail'

const publicRoutes:RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundErr />,
    children: [
      {index: true, element: <Home />},
      {path: 'login', element: <Login />},
      {path: 'signup', element: <SignUp />},
      {path: 'lp/:lpId', element: <LpDetailPage />},
      {path: '/v1/auth/google/callback', element: <GoogleLoginRedirect />},
    ]
  },
];

const privateRoutes:RouteObject[] = [
  {
    path: "/",
    element: <PrivateLayout />,
    errorElement: <NotFoundErr />,
    children: [
      {path: 'my', element: <MyPage />},
    ],
  },
];

export const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    ...publicRoutes,
    ...privateRoutes,
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router}/>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </>
  )
}

export default App
