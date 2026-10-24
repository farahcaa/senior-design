import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/client";
import useEasyAuth from "./use-easy-auth";
import type { AccountResponse } from "@/gen/types";

const ME_QUERY_KEY = ["me"];

async function fetchMe(headers?: Record<string, string>) {
  const response = await axiosClient<AccountResponse>({
    url: "/app/me",
    method: "GET",
    headers,
  });

  return response.data;
}

export function useMe() {
  const { user } = useEasyAuth();
  const token = user?.access_token;

  const query = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: () =>
      fetchMe(token ? { Authorization: `Bearer ${token}` } : undefined),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  return {
    me: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
