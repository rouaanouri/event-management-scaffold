import { apiClient } from "@/api/client";
import type { AttendedEventEntry, EventItem, PaginatedResponse, PaginationParams } from "@/types";

function buildQueryParams(params: PaginationParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (params.page) query.page = String(params.page);
  if (params.limit) query.limit = String(params.limit);
  if (params.search) query.search = params.search;
  if (params.type) query.type = params.type;
  if (params.dateFrom) query.dateFrom = params.dateFrom;
  if (params.dateTo) query.dateTo = params.dateTo;
  return query;
}

export async function getUpcomingEvents(
  params: PaginationParams,
): Promise<PaginatedResponse<EventItem>> {
  const { data } = await apiClient.get<PaginatedResponse<EventItem>>(
    "/events/upcoming",
    { params: buildQueryParams(params) },
  );
  return data;
}

export async function getEventById(id: number): Promise<EventItem> {
  const { data } = await apiClient.get<EventItem>(`/events/${id}`);
  return data;
}

export async function getAttendedEvents(): Promise<AttendedEventEntry[]> {
  const { data } = await apiClient.get<{ message: string; events: AttendedEventEntry[] }>(
    "/events/attended",
  );
  return data.events;
}
