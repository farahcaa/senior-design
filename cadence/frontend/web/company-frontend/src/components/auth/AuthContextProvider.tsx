import useEasyAuth from "@/hooks/use-easy-auth";
import { identifyUser, resetPostHog } from "@/lib/posthog";
import { useEffect } from "react";
import { useNavigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

/**
 * Auth lifecycle side-effects.
 *
 * RENEWAL is owned by oidc-client-ts's built-in scheduler (`automaticSilentRenew: true` in
 * user-manager.ts), which proactively refreshes the access token via the refresh_token grant before
 * it expires. We deliberately add NO competing renewal triggers here.
 *
 * History / the bug this fixes: this provider used to (a) call `startSilentRenew()` AND fire its own
 * `signinSilent()` on `addAccessTokenExpired` - two extra renewers racing the built-in one - and
 * (b) call `removeUser()` + redirect on ANY `silentRenewError`. Combined, a single transient renewal
 * hiccup (network blip, momentary Keycloak hiccup, or a StrictMode-induced double signinSilent on
 * localhost) would log the user out, even though the offline refresh token was valid for ~30 more
 * days. That was the "logged out well under 30 days" symptom. The fix: one renewal path, and treat a
 * renewal error as RECOVERABLE (log, don't log out).
 *
 * What stays here:
 *  - A LAST-RESORT expiry fallback: if the access token actually expires (the scheduled renewal
 *    didn't fire or failed), try ONE silent renew so a long-open tab recovers. On failure we only
 *    log - we never force a logout. (Safe to overlap the scheduler: the realm has
 *    revokeRefreshToken=false, so the refresh token isn't rotated and concurrent refreshes can't
 *    invalidate each other.)
 *  - Genuine remote sign-out: if Keycloak reports the session ended (user/admin signed out, or the
 *    offline session was revoked), clear local state and send the user home.
 *
 * The actual "you are not authenticated, go to login" decision lives in ProtectedRoute, which also
 * handles the cold-boot case (page loaded with an already-expired token) via a one-shot signinSilent.
 */
const AuthContextProvider = ({ children }: Props) => {
  const { authContext } = useEasyAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // A transient renewal failure must NOT end the session. The offline refresh token is still
    // valid; the next scheduled cycle will retry and ProtectedRoute recovers on the next load.
    const removeSilentRenewError = authContext.events.addSilentRenewError(
      (error) => {
        console.warn(
          "Silent token renewal failed; will retry on the next cycle (not logging out)",
          error,
        );
      },
    );

    // Last-resort: the token fully expired without the scheduler renewing it. Try once, silently.
    // Never log out on failure here - that's the over-aggressive behaviour we removed.
    const removeAccessTokenExpired = authContext.events.addAccessTokenExpired(
      () => {
        void (async () => {
          try {
            await authContext.signinSilent();
          } catch (error) {
            console.warn(
              "Fallback silent renewal after token expiry failed (not logging out)",
              error,
            );
          }
        })();
      },
    );

    // The one event that should actually end the session: Keycloak reported a remote sign-out (the
    // session was ended elsewhere, or the offline session was revoked). Clear local state, go home.
    const removeUserSignedOut = authContext.events.addUserSignedOut(() => {
      void (async () => {
        try {
          await authContext.removeUser();
        } catch (error) {
          console.error("Failed to clear auth state after remote sign-out", error);
        }
        resetPostHog(); // drop analytics identity on sign-out
        navigate("/", { replace: true });
      })();
    });

    return () => {
      removeSilentRenewError();
      removeAccessTokenExpired();
      removeUserSignedOut();
    };
  }, [authContext, navigate]);

  // Analytics identity: tie events to the learner by their OIDC subject (opaque id, never email)
  // once authenticated. Cheap external-system sync, safe in an effect.
  useEffect(() => {
    if (authContext.isAuthenticated) {
      identifyUser(authContext.user?.profile?.sub);
    }
  }, [authContext.isAuthenticated, authContext.user?.profile?.sub]);

  return <>{children}</>;
};

export default AuthContextProvider;
