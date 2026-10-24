import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import Layout from "./components/layout/Layout";
import Account from "./pages/account/Account";
import EditProfile from "./pages/account/EditProfile";
import Checkout from "./pages/account/Checkout";
import CheckoutReturn from "./pages/account/CheckoutReturn";
import BillingPortal from "./pages/account/BillingPortal";
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
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Navigate to="/account" replace />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/profile" element={<EditProfile />} />
                  <Route path="/account/upgrade" element={<Checkout />} />
                  <Route path="/account/upgrade/return" element={<CheckoutReturn />} />
                  <Route path="/billing" element={<BillingPortal />} />
                  <Route path="/account/confirm-email" element={<ConfirmEmail />} />
                  <Route path="/*" element={<Navigate to="/account" replace />} />
                </Route>
              </Route>
            </Routes>
          </AuthContextProvider>
        </NotificationProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
