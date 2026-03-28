// ===================================================
// App.tsx
//
// 레이아웃만 담당
// - ThemeProvider는 main.tsx에서 감싸므로 여기선 컴포넌트만 배치
// ===================================================

import NavBar from './NavBar';
import ThemeContent from './ThemeContent';

function App(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <ThemeContent />
    </div>
  );
}

export default App;
