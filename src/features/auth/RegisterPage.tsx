import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { login, register } from "@/api/auth";
import { getApiErrorMessage } from "@/lib/errors";
import {
  validateDateOfBirth,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/validation";
import { useAuthStore } from "@/stores/authStore";
import type { Gender } from "@/types";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: Gender | "";
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  dateOfBirth: "",
  gender: "",
};

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const errors: FieldErrors = {
      firstName: validateRequired(form.firstName, t("auth.firstName")) ?? undefined,
      lastName: validateRequired(form.lastName, t("auth.lastName")) ?? undefined,
      email: validateEmail(form.email) ?? undefined,
      password: validatePassword(form.password) ?? undefined,
      dateOfBirth: validateDateOfBirth(form.dateOfBirth) ?? undefined,
      gender: form.gender ? undefined : t("validation.genderRequired"),
    };
    setFieldErrors(errors);
    return Object.values(errors).every((e) => !e);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender as Gender,
      });

      const { access_token } = await login({
        email: form.email,
        password: form.password,
      });
      const ok = setSession(access_token);

      if (!ok) {
        navigate("/login", { replace: true });
        return;
      }

      navigate("/", { replace: true });
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-surface-border bg-surface-card/80 p-10 shadow-2xl backdrop-blur">
        <h1 className="mb-2 text-3xl font-extrabold text-white">{t("auth.registerTitle")}</h1>
        <p className="mb-8 text-base text-white/50">{t("auth.registerSubtitle")}</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                {t("auth.firstName")}
              </label>
              <input
                id="firstName"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={inputClass}
              />
              {fieldErrors.firstName && (
                <p className={errorClass}>{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                {t("auth.lastName")}
              </label>
              <input
                id="lastName"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={inputClass}
              />
              {fieldErrors.lastName && (
                <p className={errorClass}>{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.password && (
              <p className={errorClass}>{fieldErrors.password}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>
                {t("auth.dateOfBirth")}
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
              {fieldErrors.dateOfBirth && (
                <p className={errorClass}>{fieldErrors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label htmlFor="gender" className={labelClass}>
                {t("auth.gender")}
              </label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value as Gender | "")
                }
                className={`${inputClass} [color-scheme:dark]`}
              >
                <option value="">{t("auth.genderSelect")}</option>
                <option value="FEMALE">{t("auth.genderFemale")}</option>
                <option value="MALE">{t("auth.genderMale")}</option>
                <option value="OTHER">{t("auth.genderOther")}</option>
              </select>
              {fieldErrors.gender && (
                <p className={errorClass}>{fieldErrors.gender}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-500 py-3.5 text-base font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? t("auth.registerLoading") : t("auth.registerButton")}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-white/50">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-100">
            {t("auth.loginButton")}
          </Link>
        </p>
      </div>
    </div>
  );
}
