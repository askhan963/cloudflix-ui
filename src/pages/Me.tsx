import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import type { Video } from "../lib/types";
import { useAuthStore } from "../store/auth";
import { listVideos } from "../api/videos";

const PAGE_SIZE = 12;

export default function Me() {
  const { user } = useAuthStore();

  // Safeguard: in case route guard wasn't applied yet
  const userId = user?.id ?? 0;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["myVideos", userId, PAGE_SIZE],
    queryFn: ({ pageParam = 1 }) =>
      listVideos({ page: pageParam, limit: PAGE_SIZE, uploaderId: userId }),
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? (lastPage.page ?? 1) + 1 : undefined,
    enabled: Boolean(userId),
  });

  if (isError) {
    const msg =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Failed to load your videos.";
    Swal.fire({
      icon: "error",
      title: "Error",
      text: msg,
      confirmButtonColor: "#3B82F6",
    });
  }

  const items: Video[] = useMemo(
    () => data?.pages?.flatMap((p) => p?.data ?? []) ?? [],
    [data]
  );

  return (
    <section className="space-y-8">
      {/* Profile Card */}
      <div className="rounded-xl border border-neutral-dark bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {user ? (
          <div className="mt-4 grid gap-2 text-sm">
            <div>
              <span className="font-medium">Username:</span> {user.username}
            </div>
            {user.email && (
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
            )}
            <div>
              <span className="font-medium">Role:</span>{" "}
              <span className="rounded bg-secondary/10 px-2 py-0.5 text-secondary">
                {user.role}
              </span>
            </div>
            <div>
              <span className="font-medium">User ID:</span> {user.id}
            </div>

            {user.role === "creator" && (
              <div className="mt-3">
                <Link
                  to="/upload"
                  className="inline-flex items-center rounded bg-secondary px-4 py-2 text-white hover:opacity-90"
                >
                  Upload a video
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-2 text-primary/70">
            Loading profile… (If this persists, please sign in again.)
          </p>
        )}
      </div>

      {/* My Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Videos</h2>
          <button
            onClick={() => refetch()}
            className="rounded border border-primary px-3 py-1.5 text-sm hover:bg-neutral-dark"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <VideoGridSkeleton />
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-neutral-dark bg-white p-8 text-center">
            <p className="text-primary/70">
              You haven’t uploaded any videos yet.
            </p>
            {user?.role === "creator" && (
              <div className="mt-4">
                <Link
                  to="/upload"
                  className="inline-flex items-center rounded bg-accent px-4 py-2 text-white hover:opacity-90"
                >
                  Upload your first video
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((v) => (
                <VideoCardMini key={v.id} video={v} />
              ))}
            </div>

            <div className="pt-2">
              {hasNextPage ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full rounded border border-primary px-4 py-2 hover:bg-neutral-dark disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </button>
              ) : (
                <p className="text-center text-sm text-primary/60">
                  You’ve reached the end.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- Small components ---------- */

function VideoGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-neutral-dark bg-white p-4"
        >
          <div className="aspect-video w-full rounded bg-neutral-dark/60" />
          <div className="mt-3 h-4 w-2/3 rounded bg-neutral-dark/60" />
          <div className="mt-2 h-3 w-1/3 rounded bg-neutral-dark/50" />
        </div>
      ))}
    </div>
  );
}

function VideoCardMini({ video }: { video: Video }) {
  return (
    <Link
      to={`/v/${video.id}`}
      className="group block rounded-xl border border-neutral-dark bg-white p-4 transition hover:shadow-sm"
    >
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-dark/30">
        {/* Minimal preview using <video>. Replace with a poster/thumb if you have one */}
        <video
          src={video.blob_url}
          muted
          loop
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mt-3 line-clamp-1 font-semibold group-hover:underline">
        {video.title}
      </h3>
      <p className="mt-1 text-sm text-primary/60">
        Avg ★ {round1(video.avg_rating)} · {video.rating_count} ratings
      </p>
      <p className="mt-1 text-xs text-primary/50">
        {new Date(video.created_at).toLocaleString()}
      </p>
    </Link>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
