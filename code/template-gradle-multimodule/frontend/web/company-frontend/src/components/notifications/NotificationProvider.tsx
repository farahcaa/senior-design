import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import {
  NotificationContext,
  type NotificationInput,
  type NotificationTone,
} from "./notification-context";

type Notification = {
  id: string;
  title: string;
  message?: string;
  tone: NotificationTone;
  durationMs: number;
};

function toneClasses(tone: NotificationTone) {
  if (tone === "error") {
    return {
      icon: CircleAlert,
      iconClass: "text-red-500",
      ringClass: "ring-red-100",
      badgeClass: "bg-red-50 text-red-600",
    };
  }

  return {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    ringClass: "ring-emerald-100",
    badgeClass: "bg-emerald-50 text-emerald-600",
  };
}

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutIdsRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timeoutId = timeoutIdsRef.current.get(id);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }

    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const notify = useCallback(
    ({
      title,
      message,
      tone = "success",
      durationMs = 3200,
    }: NotificationInput) => {
      const id = crypto.randomUUID();

      setNotifications((current) => [
        ...current,
        {
          id,
          title,
          message,
          tone,
          durationMs,
        },
      ]);

      const timeoutId = window.setTimeout(() => {
        dismiss(id);
      }, durationMs);

      timeoutIdsRef.current.set(id, timeoutId);
    },
    [dismiss],
  );

  // Global API-error channel: any part of the app can dispatch an "app:api-error" CustomEvent with
  // { title, message } to surface a backend error the user must act on, without threading the
  // notifier through every layer. Listening here means it works from anywhere.
  useEffect(() => {
    function onApiError(e: Event) {
      const detail = (e as CustomEvent<{ title: string; message: string }>).detail;
      if (detail?.title) {
        notify({ title: detail.title, message: detail.message, tone: "error" });
      }
    }
    window.addEventListener("app:api-error", onApiError);
    return () => window.removeEventListener("app:api-error", onApiError);
  }, [notify]);

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;

    return () => {
      for (const timeoutId of timeoutIds.values()) {
        window.clearTimeout(timeoutId);
      }

      timeoutIds.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      notify,
      dismiss,
    }),
    [dismiss, notify],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {notifications.map((notification) => {
            const { icon: Icon, iconClass, ringClass, badgeClass } = toneClasses(
              notification.tone,
            );

            return (
              <div
                key={notification.id}
                className={`pointer-events-auto rounded-2xl bg-white/95 p-4 shadow-lg ring-1 backdrop-blur-sm ${ringClass}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${badgeClass}`}
                  >
                    <Icon size={18} className={iconClass} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </p>
                    {notification.message ? (
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    title="Dismiss notification"
                    onClick={() => dismiss(notification.id)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </NotificationContext.Provider>
  );
}
