import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getUpcomingEvents } from "@/api/events";
import { EventCard } from "@/components/events/EventCard";
import { EventCardSkeletonGrid } from "@/components/events/EventCardSkeleton";
import { EventsFilterBar } from "@/components/events/EventsFilterBar";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";
import { PaginationControls } from "@/components/layout/PaginationControls";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/errors";
import type { EventType } from "@/types";

const PAGE_SIZE = 12;

export function UpcomingEventsPage() {
  const { t } = useTranslation();
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
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-2 text-3xl font-extrabold text-white">{t("events.pageTitle")}</h1>
        {result && (
          <p className="mb-6 text-sm text-white/50">
            {t("events.summary", { count: result.total })}
          </p>
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

        {isLoading && <EventCardSkeletonGrid />}

        {isError && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {getApiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && result && result.items.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">{t("events.empty")}</p>
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
      <Footer />
    </div>
  );
}
