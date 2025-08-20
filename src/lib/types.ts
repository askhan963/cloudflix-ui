// Core domain types for CloudFlix

export type UserRole = "creator" | "consumer";

export type User = {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type Video = {
  id: number;
  title: string;
  description?: string;
  genre?: string;
  producer?: string;
  age_rating?: string;
  visibility: "public" | "unlisted" | "private";
  uploader_id: number;
  blob_url: string;
  created_at: string;
  updated_at: string;
  avg_rating: number;
  rating_count: number;
};

export type Comment = {
  id: number;
  video_id: number;
  user_id: number;
  username: string;
  comment: string;
  created_at: string;
};

export type Rating = {
  videoId: number;
  average: number;
  count: number;
};
