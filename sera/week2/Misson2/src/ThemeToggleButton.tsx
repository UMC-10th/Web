// ===================================================
// ThemeToggleButton.tsx
//
// 테마 전환 버튼 컴포넌트
// - useTheme()으로 toggleTheme 함수를 직접 가져옴
// - 현재 테마에 따라 버튼 텍스트 변경
// ===================================================

import { THEME, useTheme } from './context/ThemeProvider';

export default function ThemeToggleButton(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300"
    >
      {/* 라이트 모드일 때는 다크 전환 버튼, 다크 모드일 때는 라이트 전환 버튼 */}
      {isLightMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </button>
  );
}
