import { api } from "./api";

export async function rateVideo(videoId: number, payload: { rating: number }): Promise<{ ok: boolean }> {
  const { data } = await api.post(`/videos/${videoId}/ratings`, payload);
  return data;
}
