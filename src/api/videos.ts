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
export type UploadPayload = {
  file: File;
  title: string;
  description?: string;
  genre?: string;
  producer?: string;
  age_rating?: string;
  visibility?: "public" | "unlisted" | "private";
};

export async function uploadVideo(
  payload: UploadPayload,
  onProgress?: (pct: number) => void
): Promise<{ ok: boolean; id: number; url: string }> {
  const fd = new FormData();
  fd.append("file", payload.file);
  fd.append("title", payload.title);
  if (payload.description) fd.append("description", payload.description);
  if (payload.genre) fd.append("genre", payload.genre);
  if (payload.producer) fd.append("producer", payload.producer);
  if (payload.age_rating) fd.append("age_rating", payload.age_rating);
  if (payload.visibility) fd.append("visibility", payload.visibility);

  const { data } = await api.post("/videos/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      const pct = Math.round((evt.loaded * 100) / evt.total);
      onProgress?.(pct);
    },
  });
  return data;
}
export type UpdateVideoPayload = {
  title?: string;
  description?: string;
  genre?: string;
  producer?: string;
  age_rating?: string;
  visibility?: "public" | "unlisted" | "private";
};

export async function updateVideo(
  id: number,
  payload: UpdateVideoPayload
): Promise<{ ok: boolean }> {
  const { data } = await api.patch(`/videos/${id}`, payload);
  return data;
}