import type { EventItem } from "@/types";

const eventTypeLabels: Record<EventItem["event_type"], string> = {
  CONFERENCE: "مؤتمر",
  WEBINAR: "ندوة عبر الإنترنت",
  WORKSHOP: "ورشة عمل",
};

interface EventCardProps {
  event: EventItem;
  onViewDetails?: (event: EventItem) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const isPast = new Date(event.event_date) < new Date();

  const formattedDate = new Date(event.event_date).toLocaleDateString(
    "ar-SA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition ${
        isPast ? "opacity-50" : "hover:border-brand-500/50"
      }`}
    >
      <div
        className="relative h-48 w-full"
        style={{
          background: isPast
            ? "linear-gradient(135deg, #2a2a2a 0%, #150c24 100%)"
            : "linear-gradient(135deg, #3a1980 0%, #150c24 100%)",
        }}
      >
        {isPast && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/70">
            فعالية منتهية
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white">{event.name}</h3>
          <span className="shrink-0 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300">
            {eventTypeLabels[event.event_type]}
          </span>
        </div>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-white/60">
          {event.description}
        </p>

        <div className="mb-5 flex items-center justify-between text-sm text-white/40">
          <span>{formattedDate}</span>
          <span>الحد الأقصى للحضور: {event.max_attendees}</span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails?.(event)}
          disabled={isPast}
          className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
        >
          {isPast ? "انتهت الفعالية" : "عرض التفاصيل"}
        </button>
      </div>
    </article>
  );
}
