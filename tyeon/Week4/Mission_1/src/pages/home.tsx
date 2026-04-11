import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

// src/pages/home.tsx
const HomePage = () => {
  return (<div>
    {/* 자식 요소를 보여줄 outlet이 필요 ~ Outlet이 모든 자식들을 대변한다고 보면 됨*/}
    <Navbar />
    <Outlet />
  </div>);
};

export default HomePage;