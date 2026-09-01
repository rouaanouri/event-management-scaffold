import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { registerForEvent } from "@/api/registrations";
import { getApiErrorMessage } from "@/lib/errors";
import type { CreateRegistrationPayload, EducationLevel } from "@/types";

interface RegistrationFormProps {
  eventId: number;
  onSuccess: () => void;
}

export function RegistrationForm({ eventId, onSuccess }: RegistrationFormProps) {
  const { t } = useTranslation();
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [motivation, setMotivation] = useState("");
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const educationLevelOptions: { value: EducationLevel | ""; label: string }[] = [
    { value: "", label: t("educationLevels.none") },
    { value: "HIGH_SCHOOL", label: t("educationLevels.HIGH_SCHOOL") },
    { value: "BACHELORS", label: t("educationLevels.BACHELORS") },
    { value: "MASTERS", label: t("educationLevels.MASTERS") },
    { value: "PHD", label: t("educationLevels.PHD") },
    { value: "OTHER", label: t("educationLevels.OTHER") },
  ];

  function validateLinkedin(): boolean {
    if (!linkedinProfile.trim()) {
      setLinkedinError(null);
      return true;
    }
    try {
      const url = new URL(linkedinProfile.trim());
      if (!url.hostname.includes("linkedin.com")) {
        setLinkedinError(t("validation.linkedinDomain"));
        return false;
      }
      setLinkedinError(null);
      return true;
    } catch {
      setLinkedinError(t("validation.linkedinInvalid"));
      return false;
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validateLinkedin()) return;

    const payload: CreateRegistrationPayload = {};
    if (linkedinProfile.trim()) payload.linkedinProfile = linkedinProfile.trim();
    if (educationLevel) payload.educationLevel = educationLevel;
    if (motivation.trim()) payload.motivation = motivation.trim();

    setIsSubmitting(true);
    try {
      await registerForEvent(eventId, payload);
      onSuccess();
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-white/80";
  const errorClass = "mt-1.5 text-sm text-danger-text";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="linkedinProfile" className={labelClass}>
          {t("registrationForm.linkedinLabel")}
        </label>
        <input
          id="linkedinProfile"
          type="url"
          placeholder="https://www.linkedin.com/in/..."
          value={linkedinProfile}
          onChange={(e) => setLinkedinProfile(e.target.value)}
          className={inputClass}
        />
        {linkedinError && <p className={errorClass}>{linkedinError}</p>}
      </div>

      <div>
        <label htmlFor="educationLevel" className={labelClass}>
          {t("registrationForm.educationLabel")}
        </label>
        <select
          id="educationLevel"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value as EducationLevel | "")}
          className={`${inputClass} [color-scheme:dark]`}
        >
          {educationLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="motivation" className={labelClass}>
          {t("registrationForm.motivationLabel")}
        </label>
        <textarea
          id="motivation"
          rows={3}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          className={inputClass}
        />
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
        {isSubmitting ? t("registrationForm.submitLoading") : t("registrationForm.submit")}
      </button>
    </form>
  );
}
