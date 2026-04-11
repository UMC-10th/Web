/// <reference types="vite/client" />

// 환경 변수 type 정의

interface ImportMetaEnv {
    readonly VITE_TMDB_KEY: string;
    readonly VITE_TMDB_IMG_BASE_URL: string;
}

interface ImportMeta {
    readonly env: VITE_TMDB_KEY;
    readonly env: VITE_TMDB_IMG_BASE_URL;
}