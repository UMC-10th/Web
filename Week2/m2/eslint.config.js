import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // Context 모듈은 Provider·Context·훅·상수를 한 파일에서 export하는 것이 일반적이라 fast refresh 규칙을 끈다.
  {
    files: ['**/useContext/context/ThemeProvider.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
