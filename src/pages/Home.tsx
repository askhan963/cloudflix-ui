// src/pages/Home.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { Video, Comment } from "../lib/types";
import { listVideos } from "../api/videos";
import { listComments, addComment, removeComment } from "../api/comments";
import { rateVideo } from "../api/ratings";
import { useAuthStore } from "../store/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

const PAGE_SIZE = 5;

/* ------------------------------ Page ------------------------------ */
export default function Home() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["videos", "shorts", PAGE_SIZE],
    queryFn: ({ pageParam = 1 }) =>
      listVideos({ page: pageParam, limit: PAGE_SIZE, visibility: "public" }),
    getNextPageParam: (last) => (last?.hasMore ? (last.page ?? 1) + 1 : undefined),
  });

  useEffect(() => {
    if (!isError) return;
    const msg =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Failed to load feed.";
    Swal.fire({ icon: "error", title: "Error", text: msg, confirmButtonColor: "#3B82F6" });
  }, [isError, error]);

  const items: Video[] = useMemo(
    () => data?.pages?.flatMap((p) => p?.data ?? []) ?? [],
    [data]
  );

  return (
    <section className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Container with vertical snap like TikTok */}
      {isLoading ? (
        <ShortsSkeleton />
      ) : items.length === 0 ? (
        <div className="grid h-full place-items-center">
          <div className="rounded-xl border border-neutral-dark bg-white p-8 text-center">
            <p className="text-primary/70">No videos yet. Be the first to upload!</p>
            <Link
              to="/upload"
              className="mt-4 inline-flex items-center rounded bg-secondary px-4 py-2 text-white hover:opacity-90"
            >
              Upload a video
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="relative mx-auto h-full max-w-[480px] snap-y snap-mandatory overflow-y-scroll rounded-2xl border border-neutral-dark bg-black md:max-w-[540px]"
          // fetch more when near the end
          onScroll={(e) => {
            const el = e.currentTarget;
            if (hasNextPage && !isFetchingNextPage && el.scrollTop + el.clientHeight * 2 > el.scrollHeight) {
              fetchNextPage();
            }
          }}
        >
          {items.map((v) => (
            <Short key={v.id} video={v} />
          ))}

          {!hasNextPage && (
            <div className="sticky bottom-0 z-10 grid h-12 w-full place-items-center bg-gradient-to-t from-black/60 to-transparent text-xs text-white">
              You’re all caught up
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------------------ One Short ------------------------------ */
function Short({ video }: { video: Video }) {
  const { user, accessToken } = useAuthStore();
  const qc = useQueryClient();
  const isOwner = user?.id === video.uploader_id;

  const [showComments, setShowComments] = useState(false);

  // Autoplay/pause with IntersectionObserver
  const vref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = vref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            el.play().catch(() => undefined);
          } else {
            el.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Comments
  const commentsQ = useQuery({
    queryKey: ["comments", video.id],
    queryFn: () => listComments(video.id),
    enabled: showComments, // lazy load when opened
  });

  // Rate (optimistic)
  const rateMut = useMutation({
    mutationFn: (rating: number) => rateVideo(video.id, { rating }),
    onMutate: async (rating) => {
      await qc.cancelQueries({ queryKey: ["videos", "shorts", PAGE_SIZE] });
      const prevDetail = qc.getQueryData<{ ok: boolean; video: Video }>(["video", video.id]);
      // optimistic: add one rating into average
      const newCount = video.rating_count + 1;
      const newAvg = (video.avg_rating * video.rating_count + rating) / newCount;
      // set local cache for detailed (if any)
      if (prevDetail?.video) {
        qc.setQueryData(["video", video.id], {
          ok: true,
          video: { ...prevDetail.video, avg_rating: newAvg, rating_count: newCount },
        });
      }
      return { prevDetail };
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Rating failed",
        text: "Please try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["videos", "shorts", PAGE_SIZE] });
      qc.invalidateQueries({ queryKey: ["video", video.id] });
    },
  });

  return (
    <article className="relative h-full snap-start">
      {/* Video fills screen (phone-like 9:16) */}
      <video
        ref={vref}
        src={video.blob_url}
        playsInline
        muted
        loop
        controls={false}
        className="h-full w-full object-cover"
      />

      {/* Gradient overlays to improve legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Right-side actions (stack) */}
      <div className="absolute right-3 top-1/3 z-10 flex -translate-y-1/2 flex-col items-center gap-4 text-white">
        <Action onClick={accessToken ? () => rateMut.mutate(5) : undefined} label="Like">
          <StarIcon filled />
        </Action>
        <div className="text-center text-xs opacity-90">
          {round1(video.avg_rating)}★
          <div className="opacity-75">{video.rating_count}</div>
        </div>
        <Action onClick={() => setShowComments(true)} label="Comments">
          <BubbleIcon />
        </Action>
        <Link
          to={`/v/${video.id}`}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/30 text-xs hover:bg-black/50"
          title="Open detail"
        >
          i
        </Link>
      </div>

      {/* Bottom-left meta (title/desc/time) */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[80%] text-white drop-shadow">
        <h3 className="line-clamp-2 text-lg font-semibold">{video.title}</h3>
        {video.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/90">{video.description}</p>
        )}
        <p className="mt-1 text-xs text-white/70">
          {new Date(video.created_at).toLocaleString()}
        </p>
      </div>

      {/* Comments sheet */}
      <CommentsSheet
        open={showComments}
        onClose={() => setShowComments(false)}
        videoId={video.id}
        canModerate={isOwner}
      />
    </article>
  );
}

/* ------------------------------ Comments Sheet ------------------------------ */
const CommentSchema = z.object({
  comment: z.string().min(1, "Write a comment").max(500, "Max 500 chars"),
});
type CommentForm = z.infer<typeof CommentSchema>;

function CommentsSheet({
  open,
  onClose,
  videoId,
  canModerate,
}: {
  open: boolean;
  onClose: () => void;
  videoId: number;
  canModerate: boolean;
}) {
  const { user, accessToken } = useAuthStore();
  const qc = useQueryClient();

  const commentsQ = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => listComments(videoId),
    enabled: open,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentForm>({
    resolver: zodResolver(CommentSchema),
    defaultValues: { comment: "" },
  });

  const addMut = useMutation({
    mutationFn: (payload: { comment: string }) => addComment(videoId, payload),
    onSuccess: async () => {
      reset();
      await qc.invalidateQueries({ queryKey: ["comments", videoId] });
    },
    onError: (e: any) => {
      Swal.fire({
        icon: "error",
        title: "Could not add comment",
        text: e?.response?.data?.message || e?.message || "Try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
  });

  const delMut = useMutation({
    mutationFn: (commentId: number) => removeComment(videoId, commentId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["comments", videoId] });
    },
    onError: (e: any) => {
      Swal.fire({
        icon: "error",
        title: "Could not delete comment",
        text: e?.response?.data?.message || e?.message || "Try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
  });

  return (
    <div
      aria-hidden={!open}
      className={`pointer-events-none absolute inset-0 z-20 transform transition ${
        open ? "pointer-events-auto" : "translate-y-full"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close comments"
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[70%] rounded-t-2xl bg-white p-4 text-primary shadow-xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded bg-neutral-dark" />
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Comments</h4>
          <button
            onClick={onClose}
            className="rounded border border-primary px-2 py-1 text-sm hover:bg-neutral-dark"
          >
            Close
          </button>
        </div>

        {/* Add form */}
        {accessToken ? (
          <form
            onSubmit={handleSubmit((d) => addMut.mutate(d))}
            className="mt-3 flex gap-2"
          >
            <input
              {...register("comment")}
              placeholder="Write a comment…"
              className="w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              className="rounded bg-secondary px-3 py-2 text-white hover:opacity-90 disabled:opacity-60"
              disabled={addMut.isLoading}
            >
              {addMut.isLoading ? "Posting…" : "Post"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-primary/70">
            <Link to="/login" className="text-secondary underline">Login</Link> to comment
          </p>
        )}
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}

        {/* List */}
        <div className="mt-4 space-y-2 overflow-y-auto">
          {commentsQ.isLoading ? (
            <p className="text-primary/60">Loading…</p>
          ) : (commentsQ.data?.data?.length ?? 0) === 0 ? (
            <p className="text-primary/60">No comments yet.</p>
          ) : (
            commentsQ.data!.data.map((c: Comment) => (
              <div key={c.id} className="rounded border border-neutral-dark p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.username}</span>
                  <span className="text-xs text-primary/50">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary/80">{c.comment}</p>
                {(canModerate || c.user_id === user?.id) && (
                  <div className="mt-1 text-right">
                    <button
                      onClick={() => delMut.mutate(c.id)}
                      className="rounded border border-primary px-2 py-1 text-xs hover:bg-neutral-dark"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ UI bits ------------------------------ */
function Action({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`grid h-12 w-12 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur ${
        onClick ? "cursor-pointer" : "cursor-default"
      } hover:bg-black/50`}
    >
      {children}
    </button>
  );
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <span className={filled ? "text-accent" : ""} aria-hidden>
      ★
    </span>
  );
}
function BubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M21 6H3v12h4v4l6-4h8z" />
    </svg>
  );
}

function ShortsSkeleton() {
  return (
    <div className="relative mx-auto h-full max-w-[480px] overflow-hidden rounded-2xl border border-neutral-dark bg-black md:max-w-[540px]">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-full w-full snap-start">
          <div className="h-full w-full animate-pulse bg-neutral-dark/40" />
        </div>
      ))}
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
