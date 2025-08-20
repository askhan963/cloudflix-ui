import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { useAuthStore } from "../store/auth";
import { getEnv } from "../config/env";

const { VITE_API_BASE_URL } = getEnv();

export const api: AxiosInstance = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true, // allow refresh-cookie mode if server sets it
});

// Attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 refresh once
let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    const status = error.response?.status;

    // only once per request
    if (status === 401 && !original?._retry) {
      original._retry = true;

      const { user, logout, refresh } = useAuthStore.getState();

      const runQueued = (ok: boolean) => {
        queue.forEach((resume) => resume());
        queue = [];
        isRefreshing = false;
        if (!ok) logout();
      };

      if (isRefreshing) {
        // wait until refresh finishes, then retry
        await new Promise<void>((resolve) => queue.push(resolve));
        const token = useAuthStore.getState().accessToken;
        original.headers = { ...(original.headers || {}), Authorization: token ? `Bearer ${token}` : undefined };
        return api(original);
      }

      try {
        isRefreshing = true;
        await refresh(user?.id); // refresh also re-sets accessToken + user
        runQueued(true);
        const token = useAuthStore.getState().accessToken;
        original.headers = { ...(original.headers || {}), Authorization: token ? `Bearer ${token}` : undefined };
        return api(original);
      } catch (e) {
        runQueued(false);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
