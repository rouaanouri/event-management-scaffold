import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { getEventById } from "@/api/events";
import { EventDetailsSkeleton } from "@/components/events/EventDetailsSkeleton";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";
import { RegistrationForm } from "@/components/registrations/RegistrationForm";
import { getCapacityColor } from "@/lib/capacityColor";
import { getApiErrorMessage } from "@/lib/errors";
import { formatEventDate, getCapacityRatio, isEventPast } from "@/lib/eventFormatting";
import { getEventImage } from "@/lib/eventImages";
import { eventTypeIcons } from "@/lib/eventTypeIcons";
import type { EventItem } from "@/types";

export function EventDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const queryClient = useQueryClient();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { data: event, isLoading, isError, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ signal }) => getEventById(eventId, signal),
    enabled: Number.isFinite(eventId),
  });

  function handleRegistrationSuccess() {
    setRegistrationSuccess(true);

    queryClient.setQueryData<EventItem>(["event", eventId], (previous) =>
      previous
        ? { ...previous, registrationCount: (previous.registrationCount ?? 0) + 1 }
        : previous,
    );

    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    queryClient.invalidateQueries({ queryKey: ["attended-events"] });
    queryClient.invalidateQueries({ queryKey: ["upcoming-events"] });
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Link to="/" className="mb-6 inline-block text-sm font-medium text-brand-300 hover:text-brand-100">
          {t("eventDetails.backLink")}
        </Link>

        {isLoading && <EventDetailsSkeleton />}

        {isError && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {getApiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && event && (
          <EventDetailsContent
            event={event}
            registrationSuccess={registrationSuccess}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

interface EventDetailsContentProps {
  event: EventItem;
  registrationSuccess: boolean;
  onRegistrationSuccess: () => void;
}

function EventDetailsContent({
  event,
  registrationSuccess,
  onRegistrationSuccess,
}: EventDetailsContentProps) {
  const { t, i18n } = useTranslation();
  const isPast = isEventPast(event.event_date);
  const capacityRatio = getCapacityRatio(event.registrationCount, event.max_attendees);
  const isFull = capacityRatio !== null && capacityRatio >= 100;
  const registrationDisabled = isPast || isFull;
  const TypeIcon = eventTypeIcons[event.event_type];

  const formattedDate = formatEventDate(event.event_date, i18n.language, true);

  return (
    <div className={`grid grid-cols-1 gap-8 lg:grid-cols-2 ${isPast ? "opacity-60" : ""}`}>
      <div>
        <div
          className="relative mb-6 h-56 w-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${getEventImage(event.id)})` }}
        >
          <span className="absolute left-4 top-4 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-semibold text-white">
            {t(`eventTypes.${event.event_type}`)}
          </span>
          <div
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/30 bg-black/50 text-brand-300 backdrop-blur"
            style={{ filter: "drop-shadow(0 0 6px rgba(139, 47, 214, 0.6))" }}
          >
            <TypeIcon size={20} />
          </div>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          {isPast && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              {t("eventDetails.expiredBadge")}
            </span>
          )}
          {!isPast && isFull && (
            <span className="rounded-full bg-danger-bg px-3 py-1 text-xs font-semibold text-danger-text">
              {t("eventDetails.fullBadge")}
            </span>
          )}
        </div>

        <h1 className="mb-3 text-3xl font-extrabold text-white">{event.name}</h1>
        <p className="mb-6 text-base leading-relaxed text-white/70">{event.description}</p>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-surface-border bg-surface-raised/40 p-4">
            <Users size={18} className="mb-2 text-brand-300" />
            <p className="text-xs text-white/40">{t("eventDetails.currentRegistrationsLabel")}</p>
            <p className="text-lg font-bold text-white">{event.registrationCount ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-raised/40 p-4">
            <Users size={18} className="mb-2 text-brand-300" />
            <p className="text-xs text-white/40">{t("eventDetails.maxAttendeesLabel")}</p>
            <p className="text-lg font-bold text-white">{event.max_attendees}</p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-raised/40 p-4">
            <CalendarDays size={18} className="mb-2 text-brand-300" />
            <p className="text-xs text-white/40">{t("eventDetails.dateTimeLabel")}</p>
            <p className="text-sm font-bold text-white">{formattedDate}</p>
          </div>
        </div>

        {capacityRatio !== null && (
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/50">
              <span>{capacityRatio}%</span>
              <span>{t("eventDetails.currentRegistrationsLabel")}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${capacityRatio}%`, backgroundColor: getCapacityColor(capacityRatio) }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        {registrationSuccess ? (
          <div className="rounded-2xl border border-success-text/20 bg-success-bg p-6 text-center">
            <p className="mb-1 text-lg font-bold text-success-text">{t("eventDetails.successTitle")}</p>
            <p className="text-sm text-success-text/70">{t("eventDetails.successSubtitle")}</p>
          </div>
        ) : registrationDisabled ? (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 text-center">
            <p className="text-sm text-white/60">
              {isPast ? t("eventDetails.disabledExpired") : t("eventDetails.disabledFull")}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">{t("eventDetails.registrationTitle")}</h2>
            <RegistrationForm eventId={event.id} onSuccess={onRegistrationSuccess} />
          </div>
        )}
      </div>
    </div>
  );
}
