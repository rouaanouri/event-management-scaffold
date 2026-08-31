export function validateEmail(value: string): string | null {
  if (!value.trim()) return "البريد الإلكتروني مطلوب";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "صيغة البريد الإلكتروني غير صحيحة";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "كلمة المرور مطلوبة";
  if (value.length < 6) return "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
  return null;
}

export function validateRequired(
  value: string,
  fieldLabel: string,
): string | null {
  if (!value.trim()) return `${fieldLabel} مطلوب`;
  return null;
}

export function validateDateOfBirth(value: string): string | null {
  if (!value) return "تاريخ الميلاد مطلوب";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "تاريخ الميلاد غير صالح";
  if (date > new Date()) return "يجب أن يكون تاريخ الميلاد في الماضي";
  return null;
}
