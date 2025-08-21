import { api } from "./api";
import type { Video } from "../lib/types";

export type VideosListParams = {
  page?: number;
  limit?: number;
  q?: string;
  genre?: string;
  uploaderId?: number;
  visibility?: "public" | "unlisted" | "private";
};

export type VideosListResponse = {
  ok: boolean;
  data: Video[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export async function listVideos(params: VideosListParams): Promise<VideosListResponse> {
  const { data } = await api.get("/videos", { params });
  return data;
}
export async function getVideo(id: number): Promise<{ ok: boolean; video: Video }> {
  const { data } = await api.get(`/videos/${id}`);
  return data;
}
export async function removeVideo(id: number): Promise<{ ok: boolean }> {
  const { data } = await api.delete(`/videos/${id}`);
  return data;
}