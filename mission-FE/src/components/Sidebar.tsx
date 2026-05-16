import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="flex h-full flex-col gap-3 p-4 text-sm text-gray-200">
      <Link to="/search" className="rounded-md px-3 py-2 hover:bg-white/10">
        찾기
      </Link>
      <Link to="/my" className="rounded-md px-3 py-2 hover:bg-white/10">
        마이페이지
      </Link>
    </nav>
  );
};

export default Sidebar;
