import { Trash2, Users } from "lucide-react";
import { useState } from "react";

import type { EventItem } from "@/types";

const eventTypeLabels: Record<EventItem["event_type"], string> = {
  CONFERENCE: "مؤتمر",
  WEBINAR: "ندوة عبر الإنترنت",
  WORKSHOP: "ورشة عمل",
};

interface AdminEventRowProps {
  event: EventItem;
  onViewAttendees: (eventId: number) => void;
  onDelete: (eventId: number) => Promise<void>;
}

export function AdminEventRow({ event, onViewAttendees, onDelete }: AdminEventRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPast = new Date(event.event_date) < new Date();
  const formattedDate = new Date(event.event_date).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await onDelete(event.id);
    } finally {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 transition hover:border-brand-500/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-white">{event.name}</h3>
          <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
            {eventTypeLabels[event.event_type]}
          </span>
          {isPast && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/50">
              منتهية
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
          <span>{formattedDate}</span>
          <span className="text-white/20">•</span>
          <span>الحد الأقصى: {event.max_attendees}</span>
          {event.registrationCount !== undefined && (
            <>
              <span className="text-white/20">•</span>
              <span>المسجلون: {event.registrationCount}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {confirmingDelete ? (
          <>
            <span className="text-sm text-white/60">تأكيد الحذف؟</span>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-lg bg-danger-bg px-3 py-1.5 text-sm font-semibold text-danger-text disabled:opacity-60"
            >
              {isDeleting ? "جارٍ الحذف..." : "نعم، احذف"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              className="rounded-lg border border-surface-border px-3 py-1.5 text-sm text-white/70"
            >
              تراجع
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onViewAttendees(event.id)}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-sm font-medium text-white/80 transition hover:border-brand-500 hover:text-white"
            >
              <Users size={15} />
              المسجلون
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center gap-1.5 rounded-lg border border-danger-text/30 px-3 py-1.5 text-sm font-medium text-danger-text transition hover:bg-danger-bg"
            >
              <Trash2 size={15} />
              حذف
            </button>
          </>
        )}
      </div>
    </div>
  );
}
