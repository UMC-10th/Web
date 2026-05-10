import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[180px_1fr]">
        <aside className="hidden min-h-[calc(100vh-65px)] border-r border-gray-800 bg-[#111] p-5 text-sm text-gray-300 md:block">
          <nav className="flex flex-col gap-3">
            <span className="font-semibold text-white">메뉴</span>
            <span>찾기</span>
            <span>마이페이지</span>
          </nav>
        </aside>
        <main className="min-h-[calc(100vh-65px)] px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
