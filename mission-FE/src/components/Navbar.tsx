import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { HamburgerButton } from "./HamburgerButton";

interface NavbarProps {
  onMenuClick?: () => void;
  isMenuOpen: boolean;
  onMenuClose: () => void;
}

const Navbar = ({ onMenuClick, isMenuOpen, onMenuClose }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const { data: myInfo } = useGetMyInfo(!!accessToken);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 z-20 h-16 w-full bg-[#1a1a1a] border-b border-white/10 text-white shadow-md">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <HamburgerButton
            isOpen={isMenuOpen}
            onClick={onMenuClick ?? (() => {})}
            onClose={onMenuClose}
          />
          <Link to="/" className="text-xl font-bold p-2">
            DOLIGO
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!accessToken ? (
            <>
              <Link
                to={"/login"}
                className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                로그인
              </Link>
              <Link
                to={"/signup"}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                회원가입
              </Link>
            </>
          ) : (
            <>
              <div className="text-sm">
                {myInfo?.data?.name ? (
                  <span className="font-semibold">{myInfo.data.name}</span>
                ) : (
                  "고객"
                )}
                님 반갑습니다.
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
