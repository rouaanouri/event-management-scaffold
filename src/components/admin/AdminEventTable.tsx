import { useTranslation } from "react-i18next";

import { AdminEventTableRow } from "@/components/admin/AdminEventTableRow";
import type { EventItem } from "@/types";

interface AdminEventTableProps {
  events: EventItem[];
  onViewAttendees: (eventId: number) => void;
  onDelete: (eventId: number) => Promise<void>;
}

export function AdminEventTable({ events, onViewAttendees, onDelete }: AdminEventTableProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-surface-border bg-surface-card md:block">
      <table className="w-full text-start">
        <thead>
          <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-white/40">
            <th className="px-4 py-3 text-start font-medium">{t("admin.tableEvent")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("admin.tableType")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("admin.tableDate")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("admin.tableCapacity")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("admin.tableState")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("admin.tableActions")}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <AdminEventTableRow
              key={event.id}
              event={event}
              onViewAttendees={onViewAttendees}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
