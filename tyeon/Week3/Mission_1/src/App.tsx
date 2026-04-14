import './App.css'
import MoviesPage from './pages/movies';

// 경로(path)와 보여줄 화면(element)를 정의
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <HomePage />,
//     errorElement: <NotFound />
//   },
//   {
//     path: '/movies',
//     element: 
//   }
// ]);

// 3. RouterProvider로 router 전달
function App() {
  return <>
    <MoviesPage />
  </>
}

export default App;