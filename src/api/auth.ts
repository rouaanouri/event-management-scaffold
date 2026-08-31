import { apiClient } from "@/api/client";
import type { Gender, LoginResponse, RegisterResponse } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: Gender;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/auth/login",
    payload,
  );
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return data;
}
