import { useCallback } from "react";
import useEasyAuth from "./use-easy-auth";

type UseLogin = {
  login: () => void;
};

const useLogin = (): UseLogin => {
  const { authContext } = useEasyAuth();

  const login = useCallback(() => {
    authContext.signinRedirect();
  }, [authContext]);

  return {
    login,
  };
};

export default useLogin;
