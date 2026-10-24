import axios from "axios";

import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { User } from "oidc-client-ts";

import { userManager } from "@/lib/user-manager";

const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  url?: string;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  params?: unknown;
  data?: TData;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  signal?: AbortSignal;
  headers?: AxiosRequestConfig["headers"];
};
/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"];
};

export const axiosInstance = axios.create({
  baseURL: VITE_BACKEND_BASE_URL,
  validateStatus: () => true,
  paramsSerializer: {
    serialize: (params) => {
      return new URLSearchParams(params).toString();
    },
  },
});

/**
 * Coalesce concurrent token refreshes into a single signinSilent() call, so a
 * burst of requests that all see an expired token doesn't fire a storm of
 * parallel renewals. Resolves to null on failure rather than throwing.
 */
let refreshPromise: Promise<User | null> | null = null;
function refreshTokenOnce(): Promise<User | null> {
  if (!refreshPromise) {
    refreshPromise = userManager
      .signinSilent()
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

/**
 * Request interceptor — attach the freshest access token at send time, read
 * straight from the shared UserManager rather than a value captured during a
 * React render. If the stored token is already expired, refresh proactively
 * before the request goes out so we never send a known-stale token.
 */
axiosInstance.interceptors.request.use(async (config) => {
  try {
    let user = await userManager.getUser();
    if (user && user.expired) {
      user = await refreshTokenOnce();
    }
    if (user?.access_token) {
      config.headers.set("Authorization", `Bearer ${user.access_token}`);
    }
  } catch {
    // Leave any pre-existing Authorization header untouched on failure.
  }
  return config;
});

/**
 * Response interceptor — because validateStatus is `() => true`, a 401 resolves
 * normally rather than rejecting, so we handle it here in the success path.
 * Refresh the token once and replay the original request a single time; the
 * _retried guard prevents an infinite loop if the replay also 401s.
 */
axiosInstance.interceptors.response.use(async (response) => {
  const config = response.config as RetryableConfig;
  if (response.status === 401 && !config._retried) {
    config._retried = true;
    const user = await refreshTokenOnce();
    if (user?.access_token) {
      config.headers.set("Authorization", `Bearer ${user.access_token}`);
      return axiosInstance.request(config);
    }
  }
  return response;
});

export type ResponseErrorConfig<TError = unknown> = {
  response?: {
    data: TError;
    status: number;
    statusText: string;
    headers?: AxiosResponse["headers"];
  };
  request?: {
    data: TError;
    status: number;
    statusText: string;
    headers?: AxiosResponse["headers"];
  };
  message: string;
  config: RequestConfig;
  isAxiosError: boolean;
  toJSON: () => {
    message: string;
    config: RequestConfig;
    code?: string | null;
    request?: unknown;
  };
};

type ApiError = {
  code: string;
  message: string;
  status: number | string;
  details?: Record<string, unknown>;
};

type ApiResponse<TData = unknown> = {
  success: boolean;
  data: TData | null;
  error: ApiError | null;
};

function isApiResponse<TData>(value: unknown): value is ApiResponse<TData> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ApiResponse<TData>>;

  return (
    typeof candidate.success === "boolean" &&
    "data" in candidate &&
    "error" in candidate
  );
}

function statusToCode(status: ApiError["status"] | undefined, fallback: number) {
  if (typeof status === "number") {
    return status;
  }

  switch (status) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "UNPROCESSABLE_ENTITY":
      return 422;
    case "INTERNAL_SERVER_ERROR":
      return 500;
    case "GATEWAY_TIMEOUT":
      return 504;
    default:
      return fallback;
  }
}

function toResponseErrorConfig<TError>(
  response: AxiosResponse<unknown>,
  config: RequestConfig,
  error?: ApiError | null,
): ResponseErrorConfig<TError> {
  const status = statusToCode(error?.status, response.status);
  const message =
    error?.message || response.statusText || `Request failed with ${status}`;
  const data =
    (error as TError | undefined) ?? (response.data as TError | undefined);

  return {
    response: {
      data: data as TError,
      status,
      statusText: response.statusText,
      headers: response.headers,
    },
    message,
    config,
    isAxiosError: false,
    toJSON: () => ({
      message,
      config,
    }),
  };
}

function toNetworkErrorConfig<TError>(
  error: unknown,
  config: RequestConfig,
): ResponseErrorConfig<TError> {
  const message = error instanceof Error ? error.message : "Network error";

  return {
    request: {
      data: undefined as TError,
      status: 0,
      statusText: "Network Error",
    },
    message,
    config,
    isAxiosError: axios.isAxiosError(error),
    toJSON: () => ({
      message,
      config,
    }),
  };
}

export const axiosClient = async <
  TData,
  TError = unknown,
  TVariables = unknown,
>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> => {
  const response = await axiosInstance.request<unknown>({ ...config }).catch(
    (error: unknown) => {
      throw toNetworkErrorConfig<TError>(error, config);
    },
  );
  const payload = response.data;

  if (isApiResponse<TData>(payload)) {
    if (!payload.success) {
      throw toResponseErrorConfig<TError>(response, config, payload.error);
    }

    return {
      data: payload.data as TData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  if (response.status < 200 || response.status >= 300) {
    throw toResponseErrorConfig<TError>(response, config);
  }

  return {
    data: payload as TData,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

export default axiosClient;

/**
 * The typed client function signature, used by the kubb-generated hooks in `src/gen`
 * to type their optional `client` override (they default to the `axiosClient` above).
 */
export type Client = typeof axiosClient;

export function createAuthenticatedClient(token: string) {
  return function <TData, TError = unknown, TVariables = unknown>(
    reqConfig: RequestConfig<TVariables>
  ): Promise<ResponseConfig<TData>> {
    return axiosClient<TData, TError, TVariables>({
      ...reqConfig,
      headers: {
        ...reqConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
