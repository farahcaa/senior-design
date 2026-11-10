import { useEffect, useRef } from "react";
import useEasyAuth from "@/hooks/use-easy-auth";
import useLogin from "@/hooks/use-login";
import Loading from "@/pages/loading/Loading";
import { Outlet } from "react-router";

/**
 * Guards the authenticated app. Its one tricky job is the COLD BOOT case:
 *
 * When you reopen the browser (or wake the laptop) after more than ~5 minutes, the short-lived
 * OIDC *access token* in localStorage has expired — but the long-lived (30-day) *offline refresh
 * token*, granted via the `offline_access` scope, is still valid and sitting right next to it.
 *
 * react-oidc-context reports `isAuthenticated === false` for an expired access token, so the naive
 * behaviour is to immediately redirect to the Keycloak login page. That's exactly the "my laptop
 * closed and it logged me out" symptom. `automaticSilentRenew` does NOT cover this: it only
 * schedules renewals proactively while the app is already running with a still-valid token, not on
 * a fresh page load where the token is already dead.
 *
 * The fix: when we find a STORED-BUT-EXPIRED user, attempt a silent renewal (`signinSilent()`)
 * first. Because the stored user carries a refresh token, oidc-client-ts uses the refresh_token
 * grant — no iframe, no dependency on the Keycloak SSO session cookie — so it succeeds even after
 * the browser was fully closed. Only if that renewal fails (refresh token genuinely expired/revoked
 * after 30 days) do we fall back to the interactive login redirect.
 */
const ProtectedRoute = () => {
  const { activeNavigator, isAuthenticated, isLoading, user, authContext } =
    useEasyAuth();
  const { login } = useLogin();

  // Guards against firing the interactive login redirect more than once.
  const redirectStartedRef = useRef(false);
  // Guards against firing the silent renewal more than once per mount. Without this, every
  // re-render while the token is expired would kick off another signinSilent().
  const silentRenewTriedRef = useRef(false);

  useEffect(() => {
    // Happy path: we have a live, unexpired session. Reset the one-shot guards so a LATER
    // expiry (next time the laptop sleeps) gets a fresh silent-renew + redirect attempt.
    if (isAuthenticated && !user?.expired) {
      redirectStartedRef.current = false;
      silentRenewTriedRef.current = false;
      return;
    }

    // Still booting, or an OIDC flow (signin / silent renew) is already in flight — wait for it
    // to resolve rather than racing it. While `signinSilent()` runs, react-oidc-context sets
    // `activeNavigator`, so this is also what prevents us from redirecting on top of an in-progress
    // renewal.
    if (isLoading || activeNavigator || redirectStartedRef.current) {
      return;
    }

    // We have a stored user whose access token is expired. Try the refresh token BEFORE bouncing
    // to the login page. This is the core of the "stay logged in across browser restarts" fix.
    if (user && user.expired && !silentRenewTriedRef.current) {
      silentRenewTriedRef.current = true;

      authContext
        .signinSilent()
        .then((renewedUser) => {
          // `signinSilent()` resolves to null when it couldn't produce a user (e.g. the refresh
          // token is gone). In that case, and only then, fall back to interactive login.
          if (!renewedUser) {
            redirectStartedRef.current = true;
            login();
          }
          // On success react-oidc-context updates its state, this effect re-runs with a valid
          // session, and the happy-path branch above renders the app.
        })
        .catch((error) => {
          // Refresh token expired/revoked, or the renewal call failed — surface it and send the
          // user through the normal login flow.
          console.warn("Silent token renewal failed on load; redirecting to login", error);
          redirectStartedRef.current = true;
          login();
        });

      return;
    }

    // No stored user at all (genuine first visit / signed out), or silent renewal already failed —
    // go straight to the interactive login redirect.
    redirectStartedRef.current = true;
    login();
  }, [activeNavigator, authContext, isAuthenticated, isLoading, login, user]);

  // While booting OR while any OIDC navigator (including our silent renewal) is in flight, show the
  // loader instead of a flash of the login redirect — the renewal usually completes in well under a
  // second and the user never sees the Keycloak page.
  if (isLoading || activeNavigator) {
    return <Loading text="Loading login..." />;
  }

  if (!isAuthenticated) {
    return <Loading text="Redirecting to login..." />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
