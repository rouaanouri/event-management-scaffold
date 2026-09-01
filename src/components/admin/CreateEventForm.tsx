import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { createEvent } from "@/api/admin";
import { getApiErrorMessage } from "@/lib/errors";
import { validateRequired } from "@/lib/validation";
import type { CreateEventPayload, EventType } from "@/types";

interface CreateEventFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  description: string;
  maxAttendees: string;
  eventDate: string;
  eventType: EventType | "";
}

const initialState: FormState = {
  name: "",
  description: "",
  maxAttendees: "",
  eventDate: "",
  eventType: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function CreateEventForm({ onCreated, onCancel }: CreateEventFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const maxAttendeesNumber = Number(form.maxAttendees);
    const errors: FieldErrors = {
      name: validateRequired(form.name, t("admin.eventName")) ?? undefined,
      description: validateRequired(form.description, t("admin.eventDescription")) ?? undefined,
      maxAttendees:
        !form.maxAttendees.trim() || maxAttendeesNumber <= 0
          ? t("validation.eventMaxAttendeesInvalid")
          : undefined,
      eventDate: !form.eventDate ? t("validation.eventDateRequired") : undefined,
      eventType: !form.eventType ? t("validation.eventTypeRequired") : undefined,
    };
    setFieldErrors(errors);
    return Object.values(errors).every((e) => !e);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    const payload: CreateEventPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      max_attendees: Number(form.maxAttendees),
      event_date: new Date(form.eventDate).toISOString(),
      event_type: form.eventType as EventType,
    };

    setIsSubmitting(true);
    try {
      await createEvent(payload);
      onCreated();
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-raised px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 [color-scheme:dark]";
  const labelClass = "mb-1.5 block text-sm font-medium text-white/80";
  const errorClass = "mt-1.5 text-sm text-danger-text";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-6 space-y-4 rounded-2xl border border-surface-border bg-surface-card p-6"
    >
      <h2 className="text-lg font-bold text-white">{t("admin.createFormTitle")}</h2>

      <div>
        <label htmlFor="event-name" className={labelClass}>
          {t("admin.eventName")}
        </label>
        <input
          id="event-name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClass}
        />
        {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="event-description" className={labelClass}>
          {t("admin.eventDescription")}
        </label>
        <textarea
          id="event-description"
          rows={3}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className={inputClass}
        />
        {fieldErrors.description && (
          <p className={errorClass}>{fieldErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="event-max-attendees" className={labelClass}>
            {t("admin.eventMaxAttendees")}
          </label>
          <input
            id="event-max-attendees"
            type="number"
            min={1}
            value={form.maxAttendees}
            onChange={(e) => updateField("maxAttendees", e.target.value)}
            className={inputClass}
          />
          {fieldErrors.maxAttendees && (
            <p className={errorClass}>{fieldErrors.maxAttendees}</p>
          )}
        </div>

        <div>
          <label htmlFor="event-date" className={labelClass}>
            {t("admin.eventDateTime")}
          </label>
          <input
            id="event-date"
            type="datetime-local"
            value={form.eventDate}
            onChange={(e) => updateField("eventDate", e.target.value)}
            className={inputClass}
          />
          {fieldErrors.eventDate && (
            <p className={errorClass}>{fieldErrors.eventDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="event-type" className={labelClass}>
            {t("admin.eventType")}
          </label>
          <select
            id="event-type"
            value={form.eventType}
            onChange={(e) => updateField("eventType", e.target.value as EventType | "")}
            className={inputClass}
          >
            <option value="">{t("admin.eventTypeSelect")}</option>
            <option value="CONFERENCE">{t("eventTypes.CONFERENCE")}</option>
            <option value="WEBINAR">{t("eventTypes.WEBINAR")}</option>
            <option value="WORKSHOP">{t("eventTypes.WORKSHOP")}</option>
          </select>
          {fieldErrors.eventType && (
            <p className={errorClass}>{fieldErrors.eventType}</p>
          )}
        </div>
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t("admin.createLoading") : t("admin.createSubmit")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-surface-border px-6 py-2.5 text-sm font-medium text-white/70 transition hover:text-white"
        >
          {t("admin.cancel")}
        </button>
      </div>
    </form>
  );
}
