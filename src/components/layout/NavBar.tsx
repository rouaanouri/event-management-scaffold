import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import digitLogo from "@/assets/brand/digit-logo.png";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useAuthStore } from "@/stores/authStore";

export function NavBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link to={authUser?.role === "ADMIN" ? "/admin" : "/"} className="shrink-0">
          <img src={digitLogo} alt="Digit" className="h-10 w-auto" />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {authUser?.role !== "ADMIN" && (
            <Link to="/" className="text-white/70 transition hover:text-white">
              {t("nav.upcomingEvents")}
            </Link>
          )}
          {authUser?.role !== "ADMIN" && (
            <Link to="/my-events" className="text-white/70 transition hover:text-white">
              {t("nav.myEvents")}
            </Link>
          )}
          {authUser?.role === "ADMIN" && (
            <Link to="/admin" className="text-white/70 transition hover:text-white">
              {t("nav.adminDashboard")}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-danger-text/40 hover:text-danger-text"
          >
            {t("nav.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
