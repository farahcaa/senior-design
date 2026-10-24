import { useCallback } from "react";
import useEasyAuth from "./use-easy-auth";

type UseLogout = {
  logout: () => void;
};

const useLogout = (): UseLogout => {
  const { authContext } = useEasyAuth();

  const logout = useCallback(() => {
    authContext.signoutRedirect();
  }, [authContext]);

  return {
    logout,
  };
};

export default useLogout;
