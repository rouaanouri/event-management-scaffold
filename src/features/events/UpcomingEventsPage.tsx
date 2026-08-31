import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUpcomingEvents } from "@/api/events";
import { EventCard } from "@/components/events/EventCard";
import { EventsFilterBar } from "@/components/events/EventsFilterBar";
import { NavBar } from "@/components/layout/NavBar";
import { PaginationControls } from "@/components/layout/PaginationControls";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/errors";
import type { EventType } from "@/types";

const PAGE_SIZE = 12;

export function UpcomingEventsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<EventType | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, dateFrom, dateTo]);

  const queryParams = { page, limit: PAGE_SIZE, search: debouncedSearch, type, dateFrom, dateTo };

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["upcoming-events", queryParams],
    queryFn: () => getUpcomingEvents(queryParams),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-extrabold text-white">الفعاليات القادمة</h1>

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

        {isLoading && (
          <p className="py-12 text-center text-sm text-white/40">جارٍ تحميل الفعاليات...</p>
        )}

        {isError && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {getApiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && result && result.items.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">
            لا توجد فعاليات مطابقة لمعايير البحث الحالية.
          </p>
        )}

        {!isLoading && !isError && result && result.items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={(selected) => navigate(`/events/${selected.id}`)}
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
