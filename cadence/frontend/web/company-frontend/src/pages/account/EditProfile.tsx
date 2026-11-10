import { useState, useRef, useEffect } from "react";
import { ArrowLeft, CircleAlert, Loader2, CheckCircle2, MailCheck, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetAccount, useUpdateProfile, useRequestEmailChange, getAccountQueryKey } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useQueryClient } from "@tanstack/react-query";

function EditProfileSkeleton() {
  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <div className="mb-2 h-4 w-32 animate-pulse rounded-lg bg-gray-300" />
        <div className="mb-3 h-3 w-44 animate-pulse rounded-lg bg-gray-300" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 w-full animate-pulse rounded-xl bg-gray-300" />
          <div className="h-9 w-full animate-pulse rounded-xl bg-gray-300" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <div className="mb-2 h-4 w-20 animate-pulse rounded-lg bg-gray-300" />
        <div className="mb-3 h-3 w-52 animate-pulse rounded-lg bg-gray-300" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-gray-300" />
      </div>
    </div>
  );
}

export default function EditProfile() {
  const config = useAuthenticatedClientConfig();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: account, isError, isLoading, refetch } = useGetAccount(config);
  const { mutate: updateProfileMutation, isPending: isSavingProfile } = useUpdateProfile(config);
  const { mutate: requestEmailChangeMutation, isPending: isSendingEmailChange } = useRequestEmailChange(config);

  const serverFullName = account?.data.fullName ?? "";
  const serverEmail = account?.data.email ?? "";
  const serverFirstName = serverFullName.split(" ")[0] ?? "";
  const serverLastName = serverFullName.split(" ").slice(1).join(" ");

  const [firstNameInput, setFirstNameInput] = useState(serverFirstName);
  const [lastNameInput, setLastNameInput] = useState(serverLastName);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const lastSyncedName = useRef("");

  const [emailInput, setEmailInput] = useState("");
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);

  // Re-sync the name fields whenever the account name arrives or changes server-side.
  useEffect(() => {
    if (lastSyncedName.current !== serverFullName) {
      lastSyncedName.current = serverFullName;
      setFirstNameInput(serverFirstName);
      setLastNameInput(serverLastName);
    }
  }, [serverFullName, serverFirstName, serverLastName]);

  const trimmedFirstName = firstNameInput.trim();
  const trimmedLastName = lastNameInput.trim();
  const nameChanged =
    trimmedFirstName !== serverFirstName || trimmedLastName !== serverLastName;
  const nameValid = trimmedFirstName.length > 0 && trimmedLastName.length > 0;

  function handleSaveProfile() {
    if (!nameChanged || !nameValid || isSavingProfile) return;
    setProfileError(false);
    setProfileSaved(false);
    updateProfileMutation(
      { data: { firstName: trimmedFirstName, lastName: trimmedLastName } },
      {
        onSuccess: () => {
          setProfileSaved(true);
          queryClient.invalidateQueries({ queryKey: getAccountQueryKey() });
        },
        onError: () => setProfileError(true),
      },
    );
  }

  const trimmedEmail = emailInput.trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const emailChanged = trimmedEmail.toLowerCase() !== serverEmail.toLowerCase();
  const canSendEmailChange = emailLooksValid && emailChanged;

  function handleSendEmailChange() {
    if (!canSendEmailChange || isSendingEmailChange) return;
    setEmailError(false);
    setEmailSentTo(null);
    requestEmailChangeMutation(
      { data: { newEmail: trimmedEmail } },
      {
        onSuccess: () => {
          setEmailSentTo(trimmedEmail);
          setEmailInput("");
        },
        onError: () => setEmailError(true),
      },
    );
  }

  const initials = serverFullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <button
        type="button"
        onClick={() => navigate("/account")}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Account
      </button>

      {isLoading ? (
        <EditProfileSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-red-100 p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <CircleAlert size={22} />
          </div>
          <h2 className="text-sm font-semibold text-red-700">
            Profile could not be loaded
          </h2>
          <p className="mt-1 text-xs text-red-400">
            We couldn't fetch your details. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 w-full rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
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

            <h2 className="text-sm font-semibold text-gray-900 mb-1">Name</h2>
            <p className="text-xs text-gray-400 mb-3">
              How your name appears across the app.
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    First name
                  </label>
                  <input
                    placeholder="First"
                    type="text"
                    value={firstNameInput}
                    onChange={(event) => {
                      setFirstNameInput(event.target.value);
                      setProfileSaved(false);
                      setProfileError(false);
                    }}
                    className="w-full text-sm px-3 py-2 bg-gray-50 border border-black/[0.08] rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Last name
                  </label>
                  <input
                    placeholder="Last"
                    type="text"
                    value={lastNameInput}
                    onChange={(event) => {
                      setLastNameInput(event.target.value);
                      setProfileSaved(false);
                      setProfileError(false);
                    }}
                    className="w-full text-sm px-3 py-2 bg-gray-50 border border-black/[0.08] rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
                  />
                </div>
              </div>
              {profileError && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <CircleAlert size={13} className="flex-shrink-0" />
                  Couldn't save your name. Please try again.
                </p>
              )}
              {profileSaved && !nameChanged && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <CheckCircle2 size={13} className="flex-shrink-0" />
                  Name updated.
                </p>
              )}
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={!nameChanged || !nameValid || isSavingProfile}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingProfile && <Loader2 size={14} className="animate-spin" />}
                {isSavingProfile ? "Saving..." : "Save name"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Email</h2>
            <p className="text-xs text-gray-400 mb-3">
              We'll send a confirmation link to the new address - nothing changes
              until you click it.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Current email
                </label>
                <input
                  type="email"
                  value={serverEmail}
                  readOnly
                  className="w-full text-sm px-3 py-2 bg-gray-50 border border-black/[0.08] rounded-xl text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  New email
                </label>
                <input
                  placeholder="new@example.com"
                  type="email"
                  value={emailInput}
                  onChange={(event) => {
                    setEmailInput(event.target.value);
                    setEmailSentTo(null);
                    setEmailError(false);
                  }}
                  className="w-full text-sm px-3 py-2 bg-gray-50 border border-black/[0.08] rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
                />
              </div>
              {emailError && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <CircleAlert size={13} className="flex-shrink-0" />
                  Couldn't send the confirmation email. Please try again.
                </p>
              )}
              {emailSentTo && (
                <p className="flex items-start gap-1.5 text-xs text-emerald-600">
                  <MailCheck size={13} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Confirmation link sent to{" "}
                    <span className="font-medium">{emailSentTo}</span>. Click it
                    to finish.
                  </span>
                </p>
              )}
              <button
                type="button"
                onClick={handleSendEmailChange}
                disabled={!canSendEmailChange || isSendingEmailChange}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSendingEmailChange && <Loader2 size={14} className="animate-spin" />}
                {isSendingEmailChange ? "Sending..." : "Send confirmation"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
