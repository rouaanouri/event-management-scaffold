import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { login } from "@/api/auth";
import { getApiErrorMessage } from "@/lib/errors";
import { validateEmail, validatePassword } from "@/lib/validation";
import { useAuthStore } from "@/stores/authStore";

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { access_token } = await login({ email, password });
      const ok = setSession(access_token);

      if (!ok) {
        setServerError(t("auth.sessionReadError"));
        return;
      }

      const redirectTo =
        (location.state as { from?: Location } | null)?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3.5 text-base text-white placeholder:text-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";
  const labelClass = "mb-2 block text-sm font-medium text-white/80";
  const errorClass = "mt-1.5 text-sm text-danger-text";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card/80 p-10 shadow-2xl backdrop-blur">
        <h1 className="mb-2 text-3xl font-extrabold text-white">{t("auth.loginTitle")}</h1>
        <p className="mb-8 text-base text-white/50">{t("auth.loginSubtitle")}</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className={errorClass}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
            />
            {fieldErrors.password && (
              <p id="password-error" className={errorClass}>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {serverError && (
            <p
              role="alert"
              className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text"
            >
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-500 py-3.5 text-base font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? t("auth.loginLoading") : t("auth.loginButton")}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-white/50">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="font-semibold text-brand-300 hover:text-brand-100">
            {t("auth.createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}
