import i18n from "@/i18n";

export function validateEmail(value: string): string | null {
  if (!value.trim()) return i18n.t("validation.emailRequired");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return i18n.t("validation.emailInvalid");
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return i18n.t("validation.passwordRequired");
  if (value.length < 6) return i18n.t("validation.passwordTooShort");
  return null;
}

export function validateRequired(
  value: string,
  fieldLabel: string,
): string | null {
  if (!value.trim()) return i18n.t("validation.fieldRequired", { field: fieldLabel });
  return null;
}

export function validateDateOfBirth(value: string): string | null {
  if (!value) return i18n.t("validation.dateOfBirthRequired");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return i18n.t("validation.dateOfBirthInvalid");
  if (date > new Date()) return i18n.t("validation.dateOfBirthFuture");
  return null;
}
