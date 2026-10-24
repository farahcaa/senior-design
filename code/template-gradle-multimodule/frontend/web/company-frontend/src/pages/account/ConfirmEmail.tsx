import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, CircleAlert, Loader2, MailCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirmEmailChange, getAccountQueryKey } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

/**
 * Landing page for the email-change confirmation link. Requires the logged-in owner (the token
 * alone is not enough server-side), and confirms on an explicit click rather than on mount so
 * inbox link-scanners can't consume the token and dev double-mounts can't double-fire.
 */
export default function ConfirmEmail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const config = useAuthenticatedClientConfig();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { mutate: confirmEmailChange, isPending } = useConfirmEmailChange(config);
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  function handleConfirm() {
    if (!token || isPending) return;
    confirmEmailChange(
      { data: { token } },
      {
        onSuccess: () => {
          setState("done");
          queryClient.invalidateQueries({ queryKey: getAccountQueryKey() });
        },
        onError: () => setState("error"),
      },
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-9.5rem)] max-w-md flex-col items-center justify-center md:min-h-[calc(100dvh-6rem)]">
      <div className="w-full rounded-[28px] border border-black/[0.07] bg-white p-8 text-center">
        {state === "done" ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Email updated</h1>
            <p className="mt-2 text-sm text-gray-400">
              Use the new address the next time you sign in.
            </p>
            <button
              onClick={() => navigate("/account")}
              className="mt-6 w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Back to account
            </button>
          </>
        ) : state === "error" ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
              <CircleAlert size={22} className="text-rose-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Link invalid or expired
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              This confirmation link can't be used. Request the email change
              again from your account page.
            </p>
            <button
              onClick={() => navigate("/account")}
              className="mt-6 w-full rounded-2xl border border-black/[0.08] py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Back to account
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <MailCheck size={22} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Confirm your new email
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Click below to finish moving your account to the new address.
            </p>
            <button
              onClick={handleConfirm}
              disabled={!token || isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Confirm email change
            </button>
            {!token && (
              <p className="mt-3 text-xs text-rose-500">
                No confirmation token found - open the link from your email.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
