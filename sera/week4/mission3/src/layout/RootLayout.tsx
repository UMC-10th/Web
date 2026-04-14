import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
