import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      {/* 현재 라우트에 해당하는 페이지가 렌더링되는 자리 */}
      <Outlet />
    </>
  );
};

export default RootLayout;
