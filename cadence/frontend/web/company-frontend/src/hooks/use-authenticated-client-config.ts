import useEasyAuth from "./use-easy-auth";

export type UseAuthenticatedClientConfig = {
  client: {
    headers: {
      Authorization: string;
    };
  };
};

const useAuthenticatedClientConfig = (): UseAuthenticatedClientConfig => {
  const { user } = useEasyAuth();

  return {
    client: {
      headers: {
        Authorization: `Bearer ${user?.access_token}`,
      },
    },
  };
};

export default useAuthenticatedClientConfig;
