import { CircleAlert, ChevronRight, LogOut, User, Sparkles, Zap, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import useLogout from "@/hooks/use-logout";
import { useGetAccount } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-300 ${className}`} />;
}

function AccountSkeleton() {
  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <div className="flex items-center gap-4 mb-5">
          <SkeletonBlock className="h-12 w-12 flex-shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-3 w-44" />
          </div>
        </div>
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <SkeletonBlock className="mb-2 h-4 w-16" />
        <SkeletonBlock className="mb-3 h-3 w-56" />
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Account() {
  const config = useAuthenticatedClientConfig();
  const { data: account, isError, isLoading, refetch } = useGetAccount(config);
  const { logout } = useLogout();
  const navigate = useNavigate();

  const serverFullName = account?.data.fullName ?? "";
  const serverEmail = account?.data.email ?? "";
  const tier = account?.data.tier ?? "free";

  const initials = serverFullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) {
    return <AccountSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl border border-red-100 p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <CircleAlert size={22} />
          </div>
          <h2 className="text-sm font-semibold text-red-700">
            Account could not be loaded
          </h2>
          <p className="mt-1 text-xs text-red-400">
            We couldn't fetch your account details. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 w-full rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials || <User size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-900">
              {serverFullName || "No name"}
            </div>
            <div className="mt-0.5 truncate text-xs text-gray-400">
              {serverEmail || "No email"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/account/profile")}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-black/[0.08] bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <span className="flex items-center gap-2">
            <Pencil size={14} className="text-emerald-500" />
            Edit name &amp; email
          </span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {tier === "pro" ? (
        <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-yellow-300" />
            <h2 className="text-sm font-semibold">Pro Plan</h2>
          </div>
          <p className="text-xs text-white/70 mb-4">You have full access to everything.</p>
          <button
            onClick={() => navigate("/billing")}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl bg-white/20 hover:bg-white/30 transition-colors border border-white/30"
          >
            <Sparkles size={14} />
            Manage plan
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Plan</h2>
          <p className="text-xs text-gray-400 mb-3">You are on the free plan.</p>
          <button
            onClick={() => navigate("/account/upgrade")}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-colors"
          >
            <Sparkles size={14} />
            Upgrade to Pro
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Session</h2>
        <p className="text-xs text-gray-400 mb-3">
          Sign out of your account on this device.
        </p>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}
