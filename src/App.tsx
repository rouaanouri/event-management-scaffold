import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SiteBackdrop } from "@/components/layout/SiteBackdrop";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const RegisterPage = lazy(() =>
  import("@/features/auth/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const RoleBasedHome = lazy(() =>
  import("@/routes/RoleBasedHome").then((m) => ({ default: m.RoleBasedHome })),
);
const EventDetailsPage = lazy(() =>
  import("@/features/events/EventDetailsPage").then((m) => ({ default: m.EventDetailsPage })),
);
const MyEventsPage = lazy(() =>
  import("@/features/events/MyEventsPage").then((m) => ({ default: m.MyEventsPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);

function RouteLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-white/40">{t("common.loadingPage")}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SiteBackdrop />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-events"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;