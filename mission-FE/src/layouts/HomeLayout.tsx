import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-dvh text-white bg-[#121212] relative">
      <Navbar onMenuClick={toggleSidebar} />
      
      <div className="flex min-h-dvh pt-16">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden" 
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-16 z-40 h-[calc(100dvh-4rem)] w-64 border-r border-white/10 bg-[#1a1a1a] transition-transform duration-300 md:block md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 md:ml-64 relative min-h-[calc(100dvh-4rem)] flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Floating Action Button */}
          <button
            onClick={() => navigate('/lp/write')}
            className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-700"
            aria-label="Add new LP"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </main>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default HomeLayout;
