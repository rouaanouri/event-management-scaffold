import type { EventType } from "@/types";

const eventTypeOptions: { value: EventType | ""; label: string }[] = [
  { value: "", label: "كل الأنواع" },
  { value: "CONFERENCE", label: "مؤتمر" },
  { value: "WEBINAR", label: "ندوة عبر الإنترنت" },
  { value: "WORKSHOP", label: "ورشة عمل" },
];

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
  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-raised px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 [color-scheme:dark]";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  return (
    <div className="mb-6 rounded-2xl border border-surface-border bg-surface-raised/40 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="search" className={labelClass}>
            البحث
          </label>
          <input
            id="search"
            type="search"
            placeholder="البحث بالاسم أو الوصف..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="event-type" className={labelClass}>
            نوع الفعالية
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
              من تاريخ
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
              إلى تاريخ
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
    </div>
  );
}
