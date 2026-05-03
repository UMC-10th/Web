import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
