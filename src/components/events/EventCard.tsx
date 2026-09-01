import { CalendarDays, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getCapacityColor } from "@/lib/capacityColor";
import { formatEventDate, getCapacityRatio, isEventPast } from "@/lib/eventFormatting";
import { getEventImage } from "@/lib/eventImages";
import { eventTypeIcons } from "@/lib/eventTypeIcons";
import type { EventItem } from "@/types";

interface EventCardProps {
  event: EventItem;
  onViewDetails?: (event: EventItem) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const { t, i18n } = useTranslation();
  const isPast = isEventPast(event.event_date);
  const capacityRatio = getCapacityRatio(event.registrationCount, event.max_attendees);
  const isFull = capacityRatio !== null && capacityRatio >= 100;
  const isDisabled = isPast || isFull;

  const TypeIcon = eventTypeIcons[event.event_type];
  const formattedDate = formatEventDate(event.event_date, i18n.language);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all duration-200 ${
        isDisabled ? "opacity-60" : "hover:-translate-y-1 hover:scale-[1.015] hover:border-brand-500/50 hover:shadow-xl hover:shadow-black/30"
      }`}
    >
      <div
        className="relative h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${getEventImage(event.id)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-semibold text-white">
          {t(`eventTypes.${event.event_type}`)}
        </span>
        <div
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/30 bg-black/50 text-brand-300 backdrop-blur"
          style={{ filter: "drop-shadow(0 0 6px rgba(139, 47, 214, 0.6))" }}
        >
          <TypeIcon size={18} />
        </div>

        {isPast && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/70">
            {t("events.expiredBadge")}
          </span>
        )}
        {!isPast && isFull && (
          <span className="absolute bottom-3 left-3 rounded-full bg-danger-bg px-3 py-1 text-xs font-semibold text-danger-text">
            {t("events.fullBadge")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-lg font-bold text-white">{event.name}</h3>

        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-white/60">
          {event.description}
        </p>

        <div className="mb-4 space-y-2 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="shrink-0 text-white/30" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={15} className="shrink-0 text-white/30" />
            <span dir="ltr" className="inline-block">
              {event.registrationCount ?? 0} / {event.max_attendees}
            </span>
            <span>{t("events.seatsLabel")}</span>
          </div>
        </div>

        {capacityRatio !== null && (
          <div className="mb-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/40">
              <span>{capacityRatio}%</span>
              <span>{t("events.capacityLabel")}</span>
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
