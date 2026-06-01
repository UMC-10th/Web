# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Location

All source code lives under `UMC-10th-mission-FE/`. Run all commands from that directory.

## Commands

```bash
# Install dependencies (pnpm)
pnpm install

# Start dev server
pnpm dev

# Type-check and build
pnpm build

# Lint
pnpm lint
```

No test suite is configured. Use `pnpm build` to catch type errors.

## Environment

Create `UMC-10th-mission-FE/.env.local` with:

```
VITE_API_BASE_URL=http://localhost:8080
```

## Architecture

**Stack:** React 19 + TypeScript + Vite, TailwindCSS v4, TanStack Query v5, React Router v7, Axios, Zod + React Hook Form, Styled Components.

**Entry point:** `src/main.tsx` → `src/App.tsx`

### Routing (`src/App.tsx`)

React Router v7 with a nested layout structure:

```
AppRoot (QueryClientProvider + AuthProvider)
└── HomeLayout (nav + sidebar + floating button)
    ├── / (HomePage)
    ├── /login, /signup, /v1/auth/google/callback
    ├── /lps (LPListPage)
    ├── /lps/:lpid (LPDetailPage)
    └── PrivateLayout (redirects to /login if no accessToken)
        ├── /mypage
        └── /write
```

### Auth flow

- `AuthContext` (`src/context/AuthContext.tsx`) holds `accessToken` in React state, initialized from `localStorage`.
- Tokens stored under keys in `src/constants/key.ts` (`accessToken`, `refreshToken`).
- `src/apis/axios.ts` — single `axiosInstance` with two interceptors: attaches Bearer token on every request, auto-refreshes on 401 (deduped with a shared `refreshPromise`), clears storage and redirects to `/login` on refresh failure.
- `PrivateLayout` reads `accessToken` from context and redirects unauthenticated users.

### API layer (`src/apis/`)

- `axios.ts` — configured `axiosInstance` (base URL from `VITE_API_BASE_URL`)
- `auth.ts` — sign-in, sign-up, logout, Google OAuth, my-info endpoints
- `lp.ts` — LP list (cursor-based), LP detail, LP comments

### Data fetching hooks (`src/hooks/`)

All hooks wrap TanStack Query:
- `useGetLpList` — `useInfiniteQuery` with cursor pagination; `queryKey: ["lps", sort]`
- `useGetLPDetail` — `useQuery` for a single LP
- `useGetLpComments` — comments for an LP
- `useGetMyInfo` — accepts `accessToken | null`; skips the query when null

### Infinite scroll pattern

`LPListPage` combines `useInfiniteQuery` + `react-intersection-observer`: a sentinel `<div ref={ref}>` at the bottom triggers `fetchNextPage()` via `useEffect` when `inView && hasNextPage && !isFetchingNextPage`. Initial load shows a grid of `<LpCardSkeleton>` components; subsequent pages append more skeletons below the list while fetching.

### Types (`src/types/`)

- `CommonRes<T>` — wrapper `{ status, message, data: T }` for all API responses
- `lp.ts` — `Lp`, `GetLpsResponse`
- `auth.ts` — auth DTOs

### Styling

Tailwind v4 utility classes throughout. Color palette: `#0f1014` backgrounds, `#FF1493` accent/primary, `#1a1a1a` / `#333` surfaces. `LpCardSkeleton` uses `animate-pulse` for loading states.
