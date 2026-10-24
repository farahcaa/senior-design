import { Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

const pageTitles: Record<string, string> = {
  "/account": "Account",
  "/account/profile": "Profile",
  "/billing": "Billing",
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? "App";

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#F7FAF8]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <Topbar title={title} />
        {/* id + relative: full-content overlays (e.g. the remediation lesson) portal in here and
            pin absolute inset-0, covering the content area while the chrome stays visible. */}
        <main id="app-main" className="relative flex-1 min-h-0 overflow-auto p-4 md:p-5 pb-20 md:pb-5">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
