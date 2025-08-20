import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as Auth from "../api/auth";
import type { User } from "../lib/types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAccessToken: (t: string | null) => void;
  setUser: (u: User | null) => void;

  login: (payload: { usernameOrEmail: string; password: string }) => Promise<void>;
  signup: (payload: { username: string; email?: string; password: string; role: "creator" | "consumer" }) => Promise<void>;
  me: () => Promise<void>;
  refresh: (userId?: number) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      loading: false,

      setAccessToken: (t) => set({ accessToken: t }),
      setUser: (u) => set({ user: u }),

      async login(payload) {
        set({ loading: true });
        try {
          const res = await Auth.login(payload);
          set({ user: res.user, accessToken: res.accessToken });
        } finally {
          set({ loading: false });
        }
      },

      async signup(payload) {
        set({ loading: true });
        try {
          const res = await Auth.signup(payload);
          set({ user: res.user, accessToken: res.accessToken });
        } finally {
          set({ loading: false });
        }
      },

      async me() {
        const { user } = await Auth.me();
        set({ user });
      },

      async refresh(userId?: number) {
        const res = await Auth.refresh(userId ? { userId } : undefined);
        set({ accessToken: res.accessToken, user: res.user });
      },

      async logout() {
        try {
          await Auth.logout();
        } finally {
          set({ user: null, accessToken: null });
        }
      },
    }),
    {
      name: "cloudflix-auth", // localStorage key
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken }),
    }
  )
);
