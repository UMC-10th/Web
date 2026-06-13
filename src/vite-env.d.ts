/// <reference types="vite/client" />

// import.meta.env.VITE_TMDB_API_KEY 에 타입을 부여한다.
interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
