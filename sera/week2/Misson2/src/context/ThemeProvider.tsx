// ===================================================
// ThemeProvider.tsx
//
// 다크모드 전역 상태 관리 (Context API)
//
// 제공하는 것:
// - theme: 현재 테마 (LIGHT | DARK)
// - toggleTheme: 테마 전환 함수
//
// 사용법:
// - ThemeProvider로 앱 전체를 감싸면 하위 어디서든 useTheme() 사용 가능
// ===================================================

import { createContext, useContext, useState } from 'react';

// 테마 값을 enum으로 정의 (문자열 오타 방지)
export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

type Theme = THEME.LIGHT | THEME.DARK;

// Context에서 제공할 값의 타입
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Context 생성 (초기값 undefined, useTheme()으로만 접근)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider: theme 상태와 toggleTheme 함수를 하위 컴포넌트 전체에 공급
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

  // 현재 테마가 LIGHT면 DARK로, DARK면 LIGHT로 전환
  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 커스텀 훅: useTheme()으로 theme과 toggleTheme을 간편하게 꺼내 씀
export function useTheme() {
  const context = useContext(ThemeContext);
  // Provider 밖에서 사용하면 에러
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
