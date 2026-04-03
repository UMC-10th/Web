import { useState, useEffect } from "react";
import { matchRoute, navigate } from "./router";
import Home from "./pages/Home";
import About from "./pages/About";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";

const ROUTES = [
  { pattern: "/", component: "Home" },
  { pattern: "/about", component: "About" },
  { pattern: "/posts/:id", component: "Post" },
];

function getCurrentRoute() {
  const pathname = window.location.pathname;

  for (const route of ROUTES) {
    const params = matchRoute(route.pattern, pathname);
    if (params !== null) {
      return { component: route.component, params };
    }
  }

  return { component: "NotFound", params: {} };
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentRoute.component) {
      case "Home":
        return <Home />;
      case "About":
        return <About />;
      case "Post":
        return <Post params={currentRoute.params} />;
      default:
        return <NotFound />;
    }
  };

  return <>{renderPage()}</>;
}
