import { api } from "./api";
import type { Comment } from "../lib/types";

export async function listComments(videoId: number): Promise<{ ok: boolean; data: Comment[] }> {
  const { data } = await api.get(`/videos/${videoId}/comments`);
  return data;
}
export async function addComment(videoId: number, payload: { comment: string }): Promise<{ ok: boolean; id: number }> {
  const { data } = await api.post(`/videos/${videoId}/comments`, payload);
  return data;
}
export async function removeComment(videoId: number, commentId: number): Promise<{ ok: boolean }> {
  const { data } = await api.delete(`/videos/${videoId}/comments/${commentId}`);
  return data;
}
