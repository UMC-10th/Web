import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
