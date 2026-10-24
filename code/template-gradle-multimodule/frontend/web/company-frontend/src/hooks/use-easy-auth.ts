import { useAuth, AuthContextProps } from "react-oidc-context";
import { User } from "oidc-client-ts";

type UseEasyAuth = {
  /**
   * The user's authentication status.
   * If loading, this will be `false`.
   * If authenticated, this will be `true`.
   * If unauthenticated, this will be `false`.
   */
  isAuthenticated: boolean;

  /**
   * The authentication loading status.
   */
  isLoading: boolean;

  /**
   * The user's authentication details.
   * If unauthenticated, this will be `null`.
   */
  user: User | null;

  /**
   * The authentication context.
   */
  authContext: AuthContextProps;

  /**
   * The active authentication redirect flow, if any.
   */
  activeNavigator: AuthContextProps["activeNavigator"];
};
const useEasyAuth = (): UseEasyAuth => {
  const auth = useAuth();

  const isLoading = auth.isLoading;
  const isAuthenticated =
    auth.isAuthenticated && !!auth.user?.access_token && !auth.user.expired;

  return {
    isAuthenticated,
    isLoading,
    user: auth?.user || null,
    authContext: auth,
    activeNavigator: auth.activeNavigator,
  };
};

export default useEasyAuth;
