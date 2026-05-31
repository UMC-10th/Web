import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

// Navbar - Outlet(페이지) - Footer 구조의 공통 레이아웃
const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* isOpen일 때만 화면 전체를 덮는 모달이 렌더링됨 */}
      <Modal />
    </div>
  );
};

export default RootLayout;
