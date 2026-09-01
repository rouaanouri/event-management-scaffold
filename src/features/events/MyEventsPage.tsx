import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getAttendedEvents } from "@/api/events";
import { Footer } from "@/components/layout/Footer";
import { ListRowSkeletonGroup } from "@/components/layout/ListRowSkeleton";
import { NavBar } from "@/components/layout/NavBar";
import { getApiErrorMessage } from "@/lib/errors";
import type { AttendedEventEntry } from "@/types";

function registrationStatusClass(status: AttendedEventEntry["registrationStatus"]) {
  if (status === "APPROVED") return "bg-success-bg text-success-text";
  if (status === "REJECTED") return "bg-danger-bg text-danger-text";
  return "bg-white/10 text-white/60";
}

export function MyEventsPage() {
  const { t, i18n } = useTranslation();

  const { data: entries, isLoading, isError, error } = useQuery({
    queryKey: ["attended-events"],
    queryFn: getAttendedEvents,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="mb-2 text-3xl font-extrabold text-white">{t("myEvents.pageTitle")}</h1>
        {entries && entries.length > 0 && (
          <p className="mb-6 text-sm text-white/50">
            {t("myEvents.summary", { count: entries.length })}
          </p>
        )}

        {isLoading && <ListRowSkeletonGroup />}

        {isError && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {getApiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && entries && entries.length === 0 && (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-8 text-center">
            <p className="mb-3 text-white/60">{t("myEvents.emptyMessage")}</p>
            <Link
              to="/"
              className="inline-block rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              {t("myEvents.exploreButton")}
            </Link>
          </div>
        )}

        {!isLoading && !isError && entries && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry) => {
              const formattedDate = new Date(entry.event.event_date).toLocaleDateString(
                i18n.language === "en" ? "en-US" : "ar-SA",
                { year: "numeric", month: "long", day: "numeric" },
              );

              return (
                <Link
                  key={entry.event.id}
                  to={`/events/${entry.event.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-5 transition hover:border-brand-500/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white">{entry.event.name}</h3>
                      <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                        {t(`eventTypes.${entry.event.event_type}`)}
                      </span>
                    </div>
                    <p className="text-sm text-white/50">{formattedDate}</p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${registrationStatusClass(
                      entry.registrationStatus,
                    )}`}
                  >
                    {t(`registrationStatus.${entry.registrationStatus}`)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
