import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import NotFoundErr from './pages/NotFoundErr'
import Login from './pages/Login'
import HomeLayout from './layouts/HomeLayout'
import SignUp from './pages/SignUp'
import MyPage from './pages/MyPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundErr />,
    children: [
      {index: true, element: <Home />},
      {path: 'login', element: <Login />},
      {path: 'signup', element: <SignUp />},
      {path: 'my', element: <MyPage />},
    ]
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
