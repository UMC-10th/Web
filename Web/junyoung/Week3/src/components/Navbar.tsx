import { NavLink } from 'react-router-dom';

const menus = [
  { label: '인기 영화', path: '/movies/popular' },
  { label: '개봉 예정', path: '/movies/upcoming' },
  { label: '평점 높은', path: '/movies/top-rated' },
  { label: '상영 중', path: '/movies/now-playing' },
];

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-20 py-4 flex items-center gap-8">
      <NavLink to="/" className="text-xl font-bold text-gray-900">
        🎬 Movie App
      </NavLink>
      <div className="flex gap-6">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500 font-semibold text-sm'
                : 'text-gray-500 hover:text-gray-900 text-sm'
            }
          >
            {menu.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
