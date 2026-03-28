// ===================================================
// NavBar.tsx
//
// 상단 네비게이션 바
// - useTheme()으로 현재 테마를 가져와 배경색 조건부 적용
// - ThemeToggleButton을 우측에 배치
// ===================================================

import { THEME, useTheme } from './context/ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';

export default function NavBar(): JSX.Element {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <nav
      className={`w-full flex justify-end p-4 border-b ${
        // 테마에 따라 배경색과 보더 색상 변경
        isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-700'
      }`}
    >
      <ThemeToggleButton />
    </nav>
  );
}
