import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import type { UserManagerSettings } from "oidc-client-ts";

/**
 * Single shared oidc-client-ts UserManager.
 *
 * Both react-oidc-context's <AuthProvider> (see main.tsx) and the axios
 * interceptors in lib/client.ts use this same instance, so the token the HTTP
 * layer sends is always the one the auth context just refreshed - there is no
 * second, render-coupled copy that can go stale.
 *
 * SESSION MODEL (why these specific settings):
 * - We request `offline_access`, so Keycloak issues a long-lived OFFLINE refresh token (30-day idle
 *   in the realm). That token, stored in localStorage, is what actually keeps the user logged in.
 * - `automaticSilentRenew` is the ONE renewal mechanism. With a refresh token present, oidc-client-ts
 *   renews via the refresh_token grant (a plain token request) - NOT a hidden iframe. So renewal does
 *   not depend on the Keycloak SSO session cookie (which idles out in 30 min) or on the login theme's
 *   JS. This is why a logged-in SPA survives way past the 30-min SSO idle.
 * - We deliberately DO NOT set `silent_redirect_uri`: that only exists to enable the iframe-based
 *   silent-renew fallback, which we never want here (it would couple renewal to the SSO cookie and to
 *   the - currently broken - Keycloak login theme JS). Refresh-token renewal needs no redirect URI.
 * - `monitorSession: false`: do not run the check-session iframe. Session monitoring would fire a
 *   `userSignedOut` event when the SSO cookie idles out at 30 min and log the user out, defeating the
 *   30-day offline token entirely. We intentionally rely only on the refresh token's lifetime.
 */
const settings: UserManagerSettings = {
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  scope: "app-backend-as-audience openid email profile offline_access",
  automaticSilentRenew: true,
  monitorSession: false,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // How old a transient sign-in `oidc.<state>` entry must be before clearStaleState() will sweep it.
  // Lowered from the 15-min default so the orphan entries that pile up in dev (StrictMode double
  // mounts + HMR start signin flows that never complete) get cleaned up promptly.
  staleStateAgeInSeconds: 300,
};

export const userManager = new UserManager(settings);

// Sweep orphaned `oidc.<state>` entries left behind by sign-in flows that never completed. These
// accumulate as "multiple session id variables" in localStorage, especially on localhost (React
// StrictMode double-mounts and HMR repeatedly start, then abandon, signin flows). Safe in
// oidc-client-ts v3: it only touches stale `oidc.`-prefixed state keys, never the stored user or
// other app data. Fire-and-forget on startup.
void userManager.clearStaleState();
