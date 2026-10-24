import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "react-oidc-context";
import { userManager } from "@/lib/user-manager";
import { initPostHog } from "@/lib/posthog";

// Analytics up before the app renders (no-op without VITE_POSTHOG_KEY).
initPostHog();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider
      userManager={userManager}
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.origin);
      }}
    >
      <App />
    </AuthProvider>
  </QueryClientProvider>,
);
