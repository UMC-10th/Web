import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
    ],
  },
])

function App() {
  return ( 
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App