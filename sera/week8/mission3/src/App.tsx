import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./layouts/HomeLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import LPListPage from "./pages/LPListPage";
import LPDetailPage from "./pages/LPDetailPage";
import WritePage from "./pages/WritePage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const AppRoot = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppRoot />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupPage /> },
          { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
          { path: "lp/:lpid", element: <LPDetailPage /> },
          {
            element: <PrivateLayout />,
            children: [
              { path: "lps", element: <LPListPage /> },
              { path: "mypage", element: <MyPage /> },
              { path: "write", element: <WritePage /> },
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
