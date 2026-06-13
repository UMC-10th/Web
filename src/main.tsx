import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* SPA 라우팅: BrowserRouter로 전체를 감싼다 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
