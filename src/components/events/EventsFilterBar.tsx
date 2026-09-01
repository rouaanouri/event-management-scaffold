import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal } from "@/components/layout/Modal";
import type { EventType } from "@/types";

export type EventStatusFilter = "" | "active" | "expired";

interface EventsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: EventType | "";
  onTypeChange: (value: EventType | "") => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  statusFilter?: EventStatusFilter;
  onStatusFilterChange?: (value: EventStatusFilter) => void;
}

function FilterFields({
  idPrefix,
  search,
  onSearchChange,
  type,
  onTypeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  statusFilter,
  onStatusFilterChange,
}: EventsFilterBarProps & { idPrefix: string }) {
  const { t } = useTranslation();

  const eventTypeOptions: { value: EventType | ""; label: string }[] = [
    { value: "", label: t("eventTypes.all") },
    { value: "CONFERENCE", label: t("eventTypes.CONFERENCE") },
    { value: "WEBINAR", label: t("eventTypes.WEBINAR") },
    { value: "WORKSHOP", label: t("eventTypes.WORKSHOP") },
  ];

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-raised px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 [color-scheme:dark]";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  return (
    <>
      <div className="lg:min-w-[200px] lg:flex-1">
        <label htmlFor={`${idPrefix}-search`} className={labelClass}>
          {t("events.searchLabel")}
        </label>
        <input
          id={`${idPrefix}-search`}
          type="search"
          placeholder={t("events.searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputClass}
        />
      </div>

      {onStatusFilterChange && (
        <div className="lg:w-40">
          <label htmlFor={`${idPrefix}-status`} className={labelClass}>
            {t("events.statusLabel")}
          </label>
          <select
            id={`${idPrefix}-status`}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as EventStatusFilter)}
            className={inputClass}
          >
            <option value="">{t("events.statusAll")}</option>
            <option value="active">{t("events.statusActive")}</option>
            <option value="expired">{t("events.statusExpired")}</option>
          </select>
        </div>
      )}

      <div className="lg:w-40">
        <label htmlFor={`${idPrefix}-event-type`} className={labelClass}>
          {t("events.typeLabel")}
        </label>
        <select
          id={`${idPrefix}-event-type`}
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

      <div className="lg:w-36">
        <label htmlFor={`${idPrefix}-date-from`} className={labelClass}>
          {t("events.dateFromLabel")}
        </label>
        <input
          id={`${idPrefix}-date-from`}
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="lg:w-36">
        <label htmlFor={`${idPrefix}-date-to`} className={labelClass}>
          {t("events.dateToLabel")}
        </label>
        <input
          id={`${idPrefix}-date-to`}
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className={inputClass}
        />
      </div>
    </>
  );
}

export function EventsFilterBar(props: EventsFilterBarProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeFilterCount = [
    props.search,
    props.type,
    props.dateFrom,
    props.dateTo,
    props.statusFilter,
  ].filter(Boolean).length;

  function handleReset() {
    props.onSearchChange("");
    props.onTypeChange("");
    props.onDateFromChange("");
    props.onDateToChange("");
    props.onStatusFilterChange?.("");
  }

  return (
    <>
      <div className="mb-6 hidden rounded-2xl border border-surface-border bg-surface-raised/40 p-4 lg:block">
        <div className="flex flex-wrap items-end gap-4">
          <FilterFields idPrefix="desktop" {...props} />

          <div className="lg:w-auto lg:self-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={activeFilterCount === 0}
              title={t("events.resetFilters")}
              aria-label={t("events.resetFilters")}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-surface-border text-white/70 transition hover:border-danger-text/40 hover:bg-danger-bg hover:text-danger-text disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-surface-border disabled:hover:bg-transparent disabled:hover:text-white/70"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-raised/40 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-brand-500 hover:text-white"
        >
          <SlidersHorizontal size={16} />
          {t("events.searchAndFilter")}
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("events.searchAndFilter")}
      >
        <div className="space-y-4">
          <FilterFields idPrefix="mobile" {...props} />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              {t("events.applyFilters")}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={activeFilterCount === 0}
              className="flex items-center gap-1.5 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={14} />
              {t("events.resetFilters")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
