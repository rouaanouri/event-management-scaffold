import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { EventType } from "@/types";

interface EventsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: EventType | "";
  onTypeChange: (value: EventType | "") => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}

export function EventsFilterBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: EventsFilterBarProps) {
  const { t } = useTranslation();

  const eventTypeOptions: { value: EventType | ""; label: string }[] = [
    { value: "", label: t("eventTypes.all") },
    { value: "CONFERENCE", label: t("eventTypes.CONFERENCE") },
    { value: "WEBINAR", label: t("eventTypes.WEBINAR") },
    { value: "WORKSHOP", label: t("eventTypes.WORKSHOP") },
  ];

  const hasActiveFilters = Boolean(search || type || dateFrom || dateTo);

  function handleReset() {
    onSearchChange("");
    onTypeChange("");
    onDateFromChange("");
    onDateToChange("");
  }

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-raised px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 [color-scheme:dark]";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  return (
    <div className="mb-6 rounded-2xl border border-surface-border bg-surface-raised/40 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="search" className={labelClass}>
            {t("events.searchLabel")}
          </label>
          <input
            id="search"
            type="search"
            placeholder={t("events.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="event-type" className={labelClass}>
            {t("events.typeLabel")}
          </label>
          <select
            id="event-type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as EventType | "")}
            className={inputClass}
          >
            {eventTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="date-from" className={labelClass}>
              {t("events.dateFromLabel")}
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="date-to" className={labelClass}>
              {t("events.dateToLabel")}
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-300 transition hover:text-white"
        >
          <RotateCcw size={13} />
          {t("events.resetFilters")}
        </button>
      )}
    </div>
  );
}
