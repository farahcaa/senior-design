# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **Bun** as the package manager and runtime (not npm/yarn).

```bash
bun install          # install dependencies
bun run dev          # start dev server (Vite HMR)
bun run build        # production build
bun run lint         # ESLint check
bun run lint:fix     # ESLint with auto-fix
bun run preview      # preview production build
```

There are no tests configured.

## Architecture

**Stack:** React 19 + TypeScript, Vite + SWC, TailwindCSS v4, React Router 7, TanStack React Query 5, Axios.

**Authentication:** OIDC via `react-oidc-context`. Configured in `src/main.tsx` with env vars `VITE_AUTHORITY` and `VITE_CLIENT_ID`. The `AuthContextProvider` (`src/components/auth/`) handles token expiration and silent renewal events. Auth hooks live in `src/hooks/`:
- `use-easy-auth.ts` — wraps `useAuth()` from react-oidc-context
- `use-login.ts` / `use-logout.ts` — trigger OIDC redirect flows
- `use-authenticated-client-config.ts` — returns axios config with `Authorization: Bearer <token>`

**API Client:** `src/lib/client.ts` exports a typed `axiosClient` function and `createAuthenticatedClient` factory. The base URL comes from `VITE_BACKEND_BASE_URL`. Generated API hooks live in `src/gen/` (OpenAPI-generated, not committed).

**Routing:** Defined in `src/App.tsx`. Routes: `/account` (Account), `/account/profile` (EditProfile), `/account/upgrade` + `/account/upgrade/return` (Stripe checkout), `/billing` (Stripe billing portal), `/account/confirm-email` (email-change confirmation). Default redirect (and unknown-path fallback) is `/account`.

**Layout:** `src/components/layout/Layout.tsx` wraps all routes with `Sidebar`, `Topbar`, and `BottomNav` (mobile). Sidebar is collapsible.

**Styling:** Tailwind v4 with custom theme tokens in `src/index.css`. Path alias `@` maps to `./src`. UI primitives from shadcn/ui (in `src/components/ui/`), icons from Lucide React and Radix UI.

## Key Patterns

- Use the `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional class names.
- Data fetching uses React Query hooks — prefer generated hooks from `@/gen` for backend calls, wrapped with `use-authenticated-client-config` for auth headers.
- `src/lib/create-authenticated-client.ts` re-exports `createAuthenticatedClient` from `src/lib/client.ts` — these are the same function.
