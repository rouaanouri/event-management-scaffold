import { jwtDecode } from "jwt-decode";

import type { UserRole } from "@/types";

interface JwtPayload {
  sub: number | string;
  email?: string;
  role?: UserRole;
  exp?: number;
}

export interface DecodedUser {
  id: number;
  email?: string;
  role: UserRole;
}

export function decodeUserFromToken(token: string): DecodedUser | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (!payload.role) {
      // eslint-disable-next-line no-console
      console.error("رمز JWT لا يحتوي على حقل role.");
      return null;
    }

    return {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
