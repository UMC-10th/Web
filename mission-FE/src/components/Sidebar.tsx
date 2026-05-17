import { Link } from "react-router-dom";

interface SidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onCollapseToggle }: SidebarProps) => {
  return (
    <nav
      className={`flex h-full flex-col gap-3 p-3 text-sm text-gray-200 ${collapsed ? "items-center" : ""}`}
    >
      <div
        className={`w-full flex items-center justify-between ${collapsed ? "px-0" : "px-2"}`}
      >
        {!collapsed && (
          <div className="text-lg font-semibold px-2">둘러둘러LP판</div>
        )}
        <button
          onClick={onCollapseToggle}
          className="p-1 rounded-md hover:bg-white/10"
          aria-label="Toggle collapse"
        >
          {collapsed ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-2 flex flex-col w-full">
        <Link
          to="/search"
          className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 ${collapsed ? "justify-center px-0" : ""}`}
        >
          <span className="text-lg">🔍</span>
          {!collapsed && <span>찾기</span>}
        </Link>

        <Link
          to="/my"
          className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 ${collapsed ? "justify-center px-0" : ""}`}
        >
          <span className="text-lg">👤</span>
          {!collapsed && <span>마이페이지</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
