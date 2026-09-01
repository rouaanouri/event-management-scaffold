import { Presentation, Video, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getCapacityColor } from "@/lib/capacityColor";
import { getEventImage } from "@/lib/eventImages";
import type { EventItem } from "@/types";

const typeIcons: Record<EventItem["event_type"], typeof Presentation> = {
  CONFERENCE: Presentation,
  WEBINAR: Video,
  WORKSHOP: Wrench,
};

interface EventCardProps {
  event: EventItem;
  onViewDetails?: (event: EventItem) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const { t, i18n } = useTranslation();
  const isPast = new Date(event.event_date) < new Date();
  const isFull =
    event.registrationCount !== undefined && event.registrationCount >= event.max_attendees;
  const isDisabled = isPast || isFull;

  const capacityRatio =
    event.registrationCount !== undefined
      ? Math.min(100, Math.round((event.registrationCount / event.max_attendees) * 100))
      : null;

  const TypeIcon = typeIcons[event.event_type];

  const formattedDate = new Date(event.event_date).toLocaleDateString(
    i18n.language === "en" ? "en-US" : "ar-SA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition ${
        isDisabled ? "opacity-60" : "hover:border-brand-500/50"
      }`}
    >
      <div
        className="relative h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${getEventImage(event.id)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />

        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur">
          <TypeIcon size={18} />
        </div>

        {isPast && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/70">
            {t("events.expiredBadge")}
          </span>
        )}
        {!isPast && isFull && (
          <span className="absolute left-3 top-3 rounded-full bg-danger-bg px-3 py-1 text-xs font-semibold text-danger-text">
            {t("events.fullBadge")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white">{event.name}</h3>
          <span className="shrink-0 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300">
            {t(`eventTypes.${event.event_type}`)}
          </span>
        </div>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-white/60">
          {event.description}
        </p>

        <div className="mb-3 flex items-center justify-between text-sm text-white/40">
          <span>{formattedDate}</span>
          <span>{t("events.maxAttendees", { count: event.max_attendees })}</span>
        </div>

        {capacityRatio !== null && (
          <div className="mb-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/40">
              <span>{capacityRatio}%</span>
              <span>{t("events.registeredCount", { count: event.registrationCount })}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${capacityRatio}%`,
                  backgroundColor: getCapacityColor(capacityRatio),
                }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onViewDetails?.(event)}
          disabled={isDisabled}
          className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
        >
          {isPast ? t("events.eventEnded") : isFull ? t("events.eventFull") : t("events.viewDetails")}
        </button>
      </div>
    </article>
  );
}
