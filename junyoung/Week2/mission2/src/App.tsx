import { useTheme } from './context/ThemeProvider';

function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="rounded-2xl shadow-lg p-10 w-full max-w-md text-center bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6">
          {isDark ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </h1>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          useContext를 활용한 다크모드 구현
        </p>

        <button
          onClick={toggleTheme}
          className="px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 cursor-pointer bg-gray-800 text-white hover:bg-gray-700 dark:bg-yellow-400 dark:text-gray-900 dark:hover:bg-yellow-300"
        >
          {isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        </button>
      </div>

      <div className="mt-8 rounded-2xl shadow-lg p-6 w-full max-w-md bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4">샘플 카드</h2>
        <div className="space-y-3">
          {['React 공부하기', 'TypeScript 복습', 'TailwindCSS 익히기'].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
