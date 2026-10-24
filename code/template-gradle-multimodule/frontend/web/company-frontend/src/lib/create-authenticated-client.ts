import client from "@/lib/client";
import type { RequestConfig, ResponseConfig } from "@/lib/client";

export function createAuthenticatedClient(token: string) {
  return function <TData, TError = unknown, TVariables = unknown>(
    reqConfig: RequestConfig<TVariables>
  ): Promise<ResponseConfig<TData>> {
    return client<TData, TError, TVariables>({
      ...reqConfig,
      headers: {
        ...reqConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
