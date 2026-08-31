import { create } from "zustand";
import { persist } from "zustand/middleware";

import { decodeUserFromToken, type DecodedUser } from "@/lib/jwt";
import type { User } from "@/types";

interface AuthState {
  authUser: DecodedUser | null;
  fullUser: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string) => boolean;
  setFullUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      fullUser: null,
      accessToken: null,
      isAuthenticated: false,

      setSession: (accessToken) => {
        const decoded = decodeUserFromToken(accessToken);
        if (!decoded) {
          return false;
        }
        set({ accessToken, authUser: decoded, isAuthenticated: true });
        return true;
      },

      setFullUser: (user) => set({ fullUser: user }),

      logout: () =>
        set({
          authUser: null,
          fullUser: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser,
        fullUser: state.fullUser,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
