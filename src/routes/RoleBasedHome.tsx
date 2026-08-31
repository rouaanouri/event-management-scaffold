import { Navigate } from "react-router-dom";

import { UpcomingEventsPage } from "@/features/events/UpcomingEventsPage";
import { useAuthStore } from "@/stores/authStore";

export function RoleBasedHome() {
  const authUser = useAuthStore((s) => s.authUser);

  if (authUser?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <UpcomingEventsPage />;
}
