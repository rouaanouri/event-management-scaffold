import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getEventById } from "@/api/events";
import { NavBar } from "@/components/layout/NavBar";
import { RegistrationForm } from "@/components/registrations/RegistrationForm";
import { getApiErrorMessage } from "@/lib/errors";
import type { EventItem } from "@/types";

const eventTypeLabels: Record<EventItem["event_type"], string> = {
  CONFERENCE: "مؤتمر",
  WEBINAR: "ندوة عبر الإنترنت",
  WORKSHOP: "ورشة عمل",
};

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const queryClient = useQueryClient();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { data: event, isLoading, isError, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId),
    enabled: Number.isFinite(eventId),
  });

  function handleRegistrationSuccess() {
    setRegistrationSuccess(true);
    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    queryClient.invalidateQueries({ queryKey: ["attended-events"] });
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/" className="mb-6 inline-block text-sm font-medium text-brand-300 hover:text-brand-100">
          العودة إلى الفعاليات القادمة
        </Link>

        {isLoading && (
          <p className="py-12 text-center text-sm text-white/40">جارٍ تحميل تفاصيل الفعالية...</p>
        )}

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
  const isPast = new Date(event.event_date) < new Date();
  const isFull =
    event.registrationCount !== undefined && event.registrationCount >= event.max_attendees;
  const registrationDisabled = isPast || isFull;

  const formattedDate = new Date(event.event_date).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={isPast ? "opacity-60" : ""}>
      <div
        className="mb-6 h-56 w-full rounded-2xl"
        style={{ background: "linear-gradient(135deg, #3a1980 0%, #150c24 100%)" }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-white">{event.name}</h1>
        <span className="shrink-0 rounded-full bg-brand-500/15 px-3 py-1 text-sm font-semibold text-brand-300">
          {eventTypeLabels[event.event_type]}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {isPast && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
            فعالية منتهية
          </span>
        )}
        {!isPast && isFull && (
          <span className="rounded-full bg-danger-bg px-3 py-1 text-xs font-semibold text-danger-text">
            مكتملة العدد
          </span>
        )}
      </div>

      <p className="mb-6 text-base leading-relaxed text-white/70">{event.description}</p>

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-2xl border border-surface-border bg-surface-raised/40 p-5 text-sm">
        <div>
          <p className="mb-1 text-white/40">التاريخ والوقت</p>
          <p className="font-medium text-white">{formattedDate}</p>
        </div>
        <div>
          <p className="mb-1 text-white/40">الحد الأقصى للحضور</p>
          <p className="font-medium text-white">{event.max_attendees}</p>
        </div>
        {event.registrationCount !== undefined && (
          <div>
            <p className="mb-1 text-white/40">عدد المسجلين حالياً</p>
            <p className="font-medium text-white">{event.registrationCount}</p>
          </div>
        )}
      </div>

      {registrationSuccess ? (
        <div className="rounded-2xl border border-success-text/20 bg-success-bg p-6 text-center">
          <p className="mb-1 text-lg font-bold text-success-text">تم إرسال طلب التسجيل بنجاح</p>
          <p className="text-sm text-success-text/70">
            طلبك الآن قيد المراجعة من قبل الإدارة، وستصلك حالة التسجيل بعد الموافقة عليه.
          </p>
        </div>
      ) : registrationDisabled ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 text-center">
          <p className="text-sm text-white/60">
            {isPast ? "لا يمكن التسجيل في فعالية منتهية." : "لا يمكن التسجيل، الفعالية مكتملة العدد."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
          <h2 className="mb-4 text-lg font-bold text-white">التسجيل في الفعالية</h2>
          <RegistrationForm eventId={event.id} onSuccess={onRegistrationSuccess} />
        </div>
      )}
    </div>
  );
}
