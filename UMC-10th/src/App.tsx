// src/App.tsx
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignUpPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateLayout from "./layouts/PrivateLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import LPListPage from "./pages/LPListPage";
import LPDetailPage from "./pages/LPDetailPage";
import WritePage from "./pages/WritePage";

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
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
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
          { index: true, element: <Home /> },
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignUpPage /> },
          { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
          { path: "lps", element: <LPListPage /> },
          { path: "lps/:lpid", element: <LPDetailPage /> }, // ← lp → lps 변경!
          {
            element: <PrivateLayout />,
            children: [
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