/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTHORITY: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_BACKEND_BASE_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  // PostHog: project key enables analytics; absent = silent no-op. Host defaults to EU cloud.
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
