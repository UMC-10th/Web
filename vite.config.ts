import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite는 프로젝트 루트의 .env에서 VITE_ 접두사 변수를 자동으로 로드한다.
export default defineConfig({
  plugins: [react()],
});
