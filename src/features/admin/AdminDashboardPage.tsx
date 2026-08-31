import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Layers, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { deleteEvent, getAllEvents } from "@/api/admin";
import { AdminEventRow } from "@/components/admin/AdminEventRow";
import { CreateEventForm } from "@/components/admin/CreateEventForm";
import { EventAttendeesPanel } from "@/components/admin/EventAttendeesPanel";
import { EventsFilterBar } from "@/components/events/EventsFilterBar";
import { NavBar } from "@/components/layout/NavBar";
import { PaginationControls } from "@/components/layout/PaginationControls";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/errors";
import type { EventType } from "@/types";

const PAGE_SIZE = 10;

export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<EventType | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, dateFrom, dateTo]);

  const queryParams = { page, limit: PAGE_SIZE, search: debouncedSearch, type, dateFrom, dateTo };

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["admin-events", queryParams],
    queryFn: () => getAllEvents(queryParams),
    placeholderData: (previousData) => previousData,
  });

  function invalidateEventsQueries() {
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    queryClient.invalidateQueries({ queryKey: ["upcoming-events"] });
  }

  async function handleDelete(eventId: number) {
    setDeleteErrorMessage(null);
    try {
      await deleteEvent(eventId);
      if (selectedEventId === eventId) setSelectedEventId(null);
      invalidateEventsQueries();
    } catch (deleteError) {
      setDeleteErrorMessage(getApiErrorMessage(deleteError));
    }
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-white">لوحة تحكم الإدارة</h1>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            <Plus size={18} />
            {showCreateForm ? "إغلاق نموذج الإنشاء" : "إنشاء فعالية جديدة"}
          </button>
        </div>

        {result && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface-card p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-xs text-white/50">إجمالي الفعاليات</p>
                <p className="text-xl font-bold text-white">{result.total}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface-card p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-xs text-white/50">الصفحة الحالية</p>
                <p className="text-xl font-bold text-white">
                  {result.page} من {result.totalPages}
                </p>
              </div>
            </div>
          </div>
        )}

        {showCreateForm && (
          <CreateEventForm
            onCreated={() => {
              setShowCreateForm(false);
              invalidateEventsQueries();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {selectedEventId !== null && (
          <EventAttendeesPanel
            eventId={selectedEventId}
            onClose={() => setSelectedEventId(null)}
          />
        )}

        <EventsFilterBar
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
        />

        <h2 className="mb-4 text-lg font-bold text-white/90">قائمة الفعاليات</h2>

        {deleteErrorMessage && (
          <p role="alert" className="mb-4 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {deleteErrorMessage}
          </p>
        )}

        {isLoading && (
          <p className="py-12 text-center text-sm text-white/40">جارٍ تحميل الفعاليات...</p>
        )}

        {isError && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {getApiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && result && result.items.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">لا توجد فعاليات مطابقة.</p>
        )}

        {!isLoading && !isError && result && result.items.length > 0 && (
          <>
            <div className="space-y-3">
              {result.items.map((event) => (
                <AdminEventRow
                  key={event.id}
                  event={event}
                  onViewAttendees={setSelectedEventId}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <PaginationControls meta={result} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
