import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { approveRegistration, getEventAttendees } from "@/api/admin";
import { PaginationControls } from "@/components/layout/PaginationControls";
import { getApiErrorMessage } from "@/lib/errors";

interface EventAttendeesPanelProps {
  eventId: number;
}

export function EventAttendeesPanel({ eventId }: EventAttendeesPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["event-attendees", eventId, page],
    queryFn: () => getEventAttendees(eventId, page),
  });

  const approveMutation = useMutation({
    mutationFn: approveRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-attendees", eventId] });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  return (
    <div>
      {isLoading && (
        <p className="py-8 text-center text-sm text-white/40">{t("admin.attendeesLoading")}</p>
      )}

      {isError && (
        <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {getApiErrorMessage(error)}
        </p>
      )}

      {approveMutation.isError && (
        <p role="alert" className="mb-4 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {getApiErrorMessage(approveMutation.error)}
        </p>
      )}

      {!isLoading && !isError && result && result.attendees.length === 0 && (
        <p className="py-8 text-center text-sm text-white/40">{t("admin.attendeesEmpty")}</p>
      )}

      {!isLoading && !isError && result && result.attendees.length > 0 && (
        <>
          <div className="space-y-3">
            {result.attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface-raised/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{attendee.user.email}</p>
                  <p className="mt-1 text-xs text-white/50">
                    {attendee.education_level && (
                      <>{t("admin.educationLevelPrefix")}: {t(`educationLevels.${attendee.education_level}`)} · </>
                    )}
                    {attendee.linkedin_profile && (
                      <a
                        href={attendee.linkedin_profile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-300 hover:text-brand-100"
                      >
                        {t("admin.linkedinLink")}
                      </a>
                    )}
                  </p>
                  {attendee.motivation && (
                    <p className="mt-1 text-sm text-white/60">{attendee.motivation}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      attendee.status === "APPROVED"
                        ? "bg-success-bg text-success-text"
                        : attendee.status === "REJECTED"
                          ? "bg-danger-bg text-danger-text"
                          : "bg-white/10 text-white/60"
                    }`}
                  >
                    {t(`registrationStatus.${attendee.status}`)}
                  </span>

                  {attendee.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => approveMutation.mutate(attendee.id)}
                      disabled={approveMutation.isPending}
                      className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                      {approveMutation.isPending ? t("admin.approving") : t("admin.approve")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <PaginationControls meta={result} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}