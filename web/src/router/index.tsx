import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute } from "../components/PrivateRoute";
import { PublicRoute } from "../components/PublicRoute";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import BroadcastsPage from "../pages/BroadcastsPage";
import ContactsPage from "../pages/ContactsPage";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "broadcasts", element: <BroadcastsPage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
