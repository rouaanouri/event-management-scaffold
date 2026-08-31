import { apiClient } from "@/api/client";
import type {
  ApproveRegistrationResponse,
  CreateEventPayload,
  CreateEventResponse,
  DeleteEventResponse,
  EventAttendeesResponse,
  EventItem,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

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

export async function getAllEvents(
  params: PaginationParams,
): Promise<PaginatedResponse<EventItem>> {
  const { data } = await apiClient.get<PaginatedResponse<EventItem>>(
    "/events",
    { params: buildQueryParams(params) },
  );
  return data;
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<CreateEventResponse> {
  const { data } = await apiClient.post<CreateEventResponse>(
    "/events",
    payload,
  );
  return data;
}

export async function deleteEvent(id: number): Promise<DeleteEventResponse> {
  const { data } = await apiClient.delete<DeleteEventResponse>(
    `/events/${id}`,
  );
  return data;
}

export async function getEventAttendees(
  eventId: number,
  page: number,
  limit = 20,
): Promise<EventAttendeesResponse> {
  const { data } = await apiClient.get<EventAttendeesResponse>(
    `/registrations/event/${eventId}`,
    { params: { page, limit } },
  );
  return data;
}

export async function approveRegistration(
  registrationId: number,
): Promise<ApproveRegistrationResponse> {
  const { data } = await apiClient.patch<ApproveRegistrationResponse>(
    `/registrations/${registrationId}/approve`,
  );
  return data;
}
