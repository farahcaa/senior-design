import { createContext } from "react";

export type NotificationTone = "success" | "error";

export type NotificationInput = {
  title: string;
  message?: string;
  tone?: NotificationTone;
  durationMs?: number;
};

export type NotificationContextValue = {
  notify: (input: NotificationInput) => void;
  dismiss: (id: string) => void;
};

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
