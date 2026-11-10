import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import Layout from "./components/layout/Layout";
import Landing from "./pages/landing/Landing";
import Dashboard from "./pages/dashboard/Dashboard";
import Account from "./pages/account/Account";
import EditProfile from "./pages/account/EditProfile";
import ConfirmEmail from "./pages/account/ConfirmEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthContextProvider from "./components/auth/AuthContextProvider";
import NotificationProvider from "./components/notifications/NotificationProvider";

function App() {
  return (
    <div className="font-sans">
      <BrowserRouter>
        <NotificationProvider>
          <AuthContextProvider>
            <Routes>
              {/* Public */}
              <Route index element={<Landing />} />

              {/* Signed-in app */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/app" element={<Dashboard />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/profile" element={<EditProfile />} />
                  <Route path="/account/confirm-email" element={<ConfirmEmail />} />
                </Route>
              </Route>

              {/* Unknown paths go back to the landing page (which forwards signed-in users on). */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthContextProvider>
        </NotificationProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
