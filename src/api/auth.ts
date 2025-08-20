import type { User } from "../lib/types";
import { api } from "./api";

type LoginPayload = { usernameOrEmail: string; password: string };
type SignupPayload = { username: string; email?: string; password: string; role: "creator" | "consumer" };
type RefreshBody = { userId?: number };

export async function login(payload: LoginPayload): Promise<{ user: User; accessToken: string }> {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function signup(payload: SignupPayload): Promise<{ user: User; accessToken: string }> {
  const { data } = await api.post("/auth/signup", payload);
  return data;
}

export async function refresh(body?: RefreshBody): Promise<{ accessToken: string; user: User }> {
  const { data } = await api.post("/auth/refresh", body ?? {});
  return data;
}

export async function me(): Promise<{ user: User }> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logout(): Promise<{ ok: boolean }> {
  const { data } = await api.post("/auth/logout");
  return data;
}
