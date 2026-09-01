import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, LayoutDashboard, LogOut, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import digitLogo from "@/assets/brand/digit-logo.png";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useAuthStore } from "@/stores/authStore";

export function NavBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  }

  function linkClass(path: string) {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
    }`;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to={authUser?.role === "ADMIN" ? "/admin" : "/"} className="shrink-0">
          <img src={digitLogo} alt="Digit" className="h-12 w-auto" />
        </Link>

        <nav className="flex items-center gap-1">
          {authUser?.role !== "ADMIN" && (
            <Link to="/" className={linkClass("/")}>
              <CalendarDays size={17} />
              {t("nav.upcomingEvents")}
            </Link>
          )}
          {authUser?.role !== "ADMIN" && (
            <Link to="/my-events" className={linkClass("/my-events")}>
              <Star size={17} />
              {t("nav.myEvents")}
            </Link>
          )}
          {authUser?.role === "ADMIN" && (
            <Link to="/admin" className={linkClass("/admin")}>
              <LayoutDashboard size={17} />
              {t("nav.adminDashboard")}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-sm font-medium text-white/70 transition hover:border-danger-text/40 hover:bg-danger-bg hover:text-danger-text"
          >
            <LogOut size={16} />
            {t("nav.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
