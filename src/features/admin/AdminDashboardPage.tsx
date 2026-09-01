import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { deleteEvent, getAllEvents } from "@/api/admin";
import { getUpcomingEvents } from "@/api/events";
import { AdminEventRow } from "@/components/admin/AdminEventRow";
import { AdminEventTable } from "@/components/admin/AdminEventTable";
import { CreateEventForm } from "@/components/admin/CreateEventForm";
import { EventAttendeesPanel } from "@/components/admin/EventAttendeesPanel";
import { EventsDonutChart } from "@/components/admin/EventsDonutChart";
import { EventsFilterBar } from "@/components/events/EventsFilterBar";
import { Footer } from "@/components/layout/Footer";
import { ListRowSkeletonGroup } from "@/components/layout/ListRowSkeleton";
import { Modal } from "@/components/layout/Modal";
import { NavBar } from "@/components/layout/NavBar";
import { PaginationControls } from "@/components/layout/PaginationControls";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/errors";
import type { EventType } from "@/types";

const PAGE_SIZE = 10;

export function AdminDashboardPage() {
  const { t } = useTranslation();
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
    queryFn: ({ signal }) => getAllEvents(queryParams, signal),
    placeholderData: (previousData) => previousData,
  });

  const { data: upcomingResult } = useQuery({
    queryKey: ["admin-upcoming-count"],
    queryFn: ({ signal }) => getUpcomingEvents({ page: 1, limit: 1 }, signal),
  });

  const { data: allEventsForStats } = useQuery({
    queryKey: ["admin-all-events-for-stats"],
    queryFn: ({ signal }) => getAllEvents({ page: 1, limit: 100 }, signal),
  });

  const totalRegistrants = allEventsForStats?.items.reduce(
    (sum, event) => sum + (event.registrationCount ?? 0),
    0,
  );

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
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-white">{t("admin.pageTitle")}</h1>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            <Plus size={18} />
            {t("admin.createToggleOpen")}
          </button>
        </div>

        {result && upcomingResult && (
          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EventsDonutChart
              upcoming={upcomingResult.total}
              past={Math.max(0, result.total - upcomingResult.total)}
              upcomingLabel={t("admin.statUpcomingEvents")}
              pastLabel={t("admin.statPastEvents")}
            />
            <div className="flex h-full items-center gap-5 rounded-2xl border border-surface-border bg-surface-card p-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                <Users size={28} />
              </div>
              <div>
                <p className="text-5xl font-extrabold text-white">
                  {totalRegistrants !== undefined ? totalRegistrants : "—"}
                </p>
                <p className="mt-1 text-sm text-white/50">{t("admin.statTotalRegistrants")}</p>
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          title={t("admin.createFormTitle")}
        >
          <CreateEventForm
            onCreated={() => {
              setShowCreateForm(false);
              invalidateEventsQueries();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>

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

        <h2 className="mb-4 text-lg font-bold text-white/90">{t("admin.listTitle")}</h2>

        {deleteErrorMessage && (
          <p role="alert" className="mb-4 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {deleteErrorMessage}
          </p>
        )}

        {isLoading && <ListRowSkeletonGroup />}

        {isError && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {getApiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && result && result.items.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">{t("admin.empty")}</p>
        )}

        {!isLoading && !isError && result && result.items.length > 0 && (
          <>
            <AdminEventTable
              events={result.items}
              onViewAttendees={setSelectedEventId}
              onDelete={handleDelete}
            />

            <div className="space-y-3 md:hidden">
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
      <Footer />
    </div>
  );
}
