import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const navItems = [
    { label: '홈', path: '/' },
    { label: '인기 영화', path: '/movie/popular' },
    { label: '상영 중', path: '/movie/now_playing' },
    { label: '평점 높은', path: '/movie/top_rated' },
    { label: '개봉 예정', path: '/movie/upcoming' },
  ];

  return (
    <nav className="flex gap-6 px-8 py-4 bg-black border-b border-gray-800">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive
              ? 'text-pink-400 font-semibold'
              : 'text-gray-400 hover:text-white transition-colors'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}