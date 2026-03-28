// ===================================================
// ThemeContent.tsx
//
// 메인 콘텐츠 영역
// - useTheme()으로 현재 테마를 가져와 배경색/텍스트 색상 조건부 적용
// ===================================================

import { THEME, useTheme } from './context/ThemeProvider';

export default function ThemeContent(): JSX.Element {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <main
      className={`flex-1 flex flex-col items-center justify-center p-8 transition-colors ${
        // 테마에 따라 배경색과 텍스트 색상 변경
        isLightMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'

        
      }`}
    >
        <p className={`text-lg ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>                
        현재 테마: {isLightMode ? '☀️  라이트 모드' : '🌙 다크 모드'}                                  
      </p>
    </main>
  );
}
