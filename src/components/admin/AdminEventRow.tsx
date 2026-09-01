import { Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { getCapacityColor } from "@/lib/capacityColor";
import { formatEventDate, getCapacityRatio, isEventPast } from "@/lib/eventFormatting";
import type { EventItem } from "@/types";

interface AdminEventRowProps {
  event: EventItem;
  onViewAttendees: (eventId: number) => void;
  onDelete: (eventId: number) => Promise<void>;
}

export function AdminEventRow({ event, onViewAttendees, onDelete }: AdminEventRowProps) {
  const { t, i18n } = useTranslation();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPast = isEventPast(event.event_date);
  const formattedDate = formatEventDate(event.event_date, i18n.language);
  const capacityRatio = getCapacityRatio(event.registrationCount, event.max_attendees);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await onDelete(event.id);
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 transition hover:border-brand-500/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-white">{event.name}</h3>
          <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
            {t(`eventTypes.${event.event_type}`)}
          </span>
          {isPast && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/50">
              {t("admin.expiredBadge")}
            </span>
          )}
          {!isPast && event.registrationCount !== undefined && event.registrationCount >= event.max_attendees && (
            <span className="rounded-full bg-danger-bg px-2.5 py-0.5 text-xs font-semibold text-danger-text">
              {t("events.fullBadge")}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
          <span>{formattedDate}</span>
          <span className="text-white/20">•</span>
          <span>
            {event.registrationCount ?? "—"} / {event.max_attendees}
          </span>
        </div>
        {capacityRatio !== null && (
          <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${capacityRatio}%`,
                backgroundColor: getCapacityColor(capacityRatio),
              }}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onViewAttendees(event.id)}
          className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-sm font-medium text-white/80 transition hover:border-brand-500 hover:text-white"
        >
          <Users size={15} />
          {t("admin.viewAttendees")}
        </button>
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="flex items-center gap-1.5 rounded-lg border border-danger-text/30 px-3 py-1.5 text-sm font-medium text-danger-text transition hover:bg-danger-bg"
        >
          <Trash2 size={15} />
          {t("admin.delete")}
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={confirmingDelete}
        eventName={event.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
