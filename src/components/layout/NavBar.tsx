import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export function NavBar() {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="border-b border-surface-border bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to={authUser?.role === "ADMIN" ? "/admin" : "/"} className="text-lg font-extrabold text-white">
          نظام إدارة الفعاليات
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {authUser?.role !== "ADMIN" && (
            <Link to="/" className="text-white/70 transition hover:text-white">
              الفعاليات القادمة
            </Link>
          )}
          {authUser?.role !== "ADMIN" && (
            <Link to="/my-events" className="text-white/70 transition hover:text-white">
              فعالياتي
            </Link>
          )}
          {authUser?.role === "ADMIN" && (
            <Link to="/admin" className="text-white/70 transition hover:text-white">
              لوحة الإدارة
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-surface-border px-3 py-1.5 text-white/70 transition hover:border-danger-text/40 hover:text-danger-text"
          >
            تسجيل الخروج
          </button>
        </nav>
      </div>
    </header>
  );
}
