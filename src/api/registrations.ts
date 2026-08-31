import { apiClient } from "@/api/client";
import type { CreateRegistrationPayload, CreateRegistrationResponse } from "@/types";

export async function registerForEvent(
  eventId: number,
  payload: CreateRegistrationPayload,
): Promise<CreateRegistrationResponse> {
  const { data } = await apiClient.post<CreateRegistrationResponse>(
    `/registrations/${eventId}`,
    payload,
  );
  return data;
}
