import { Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { getCapacityColor } from "@/lib/capacityColor";
import { formatEventDate, getCapacityRatio, isEventPast } from "@/lib/eventFormatting";
import type { EventItem } from "@/types";

interface AdminEventTableRowProps {
  event: EventItem;
  onViewAttendees: (eventId: number) => void;
  onDelete: (eventId: number) => Promise<void>;
}

export function AdminEventTableRow({ event, onViewAttendees, onDelete }: AdminEventTableRowProps) {
  const { t, i18n } = useTranslation();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPast = isEventPast(event.event_date);
  const capacityRatio = getCapacityRatio(event.registrationCount, event.max_attendees);
  const isFull = capacityRatio !== null && capacityRatio >= 100;

  const formattedDate = formatEventDate(event.event_date, i18n.language);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await onDelete(event.id);
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  let stateLabel = t("admin.stateOpen");
  let stateClass = "bg-brand-500/15 text-brand-300";
  if (isPast) {
    stateLabel = t("admin.expiredBadge");
    stateClass = "bg-white/10 text-white/50";
  } else if (isFull) {
    stateLabel = t("events.fullBadge");
    stateClass = "bg-danger-bg text-danger-text";
  }

  return (
    <tr className="border-b border-surface-border last:border-b-0 hover:bg-white/5">
      <td className="px-4 py-4">
        <p className="font-semibold text-white">{event.name}</p>
      </td>
      <td className="px-4 py-4 text-sm text-white/70">{t(`eventTypes.${event.event_type}`)}</td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-white/70">{formattedDate}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm text-white/70">
            {event.registrationCount ?? "—"} / {event.max_attendees}
          </span>
          {capacityRatio !== null && (
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${capacityRatio}%`, backgroundColor: getCapacityColor(capacityRatio) }}
              />
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${stateClass}`}>
          {stateLabel}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewAttendees(event.id)}
            className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-brand-500 hover:text-white"
            title={t("admin.viewAttendees")}
          >
            <Users size={14} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-1 rounded-lg border border-danger-text/30 px-2.5 py-1.5 text-xs font-medium text-danger-text transition hover:bg-danger-bg"
            title={t("admin.delete")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>

      <DeleteConfirmModal
        isOpen={confirmingDelete}
        eventName={event.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </tr>
  );
}
