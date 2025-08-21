import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/auth";
import type { Video, Comment } from "../lib/types";
import { getVideo, removeVideo } from "../api/videos";
import { listComments, addComment, removeComment } from "../api/comments";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { rateVideo } from "../api/ratings";

const CommentSchema = z.object({
  comment: z.string().min(1, "Write a comment").max(500, "Max 500 chars"),
});
type CommentForm = z.infer<typeof CommentSchema>;

export default function VideoDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, accessToken } = useAuthStore();

  // --- Video query
  const videoQ = useQuery({
    queryKey: ["video", id],
    queryFn: () => getVideo(id),
    enabled: Number.isFinite(id),
  });

  // --- Comments query
  const commentsQ = useQuery({
    queryKey: ["comments", id],
    queryFn: () => listComments(id),
    enabled: Number.isFinite(id),
  });

  // --- Rate mutation (optimistic)
  const rateMut = useMutation({
    mutationFn: (rating: number) => rateVideo(id, { rating }),
    onMutate: async (rating) => {
      await qc.cancelQueries({ queryKey: ["video", id] });
      const prev = qc.getQueryData<{ ok: boolean; video: Video }>(["video", id]);
      if (prev?.video) {
        const v = prev.video;
        const newCount = v.rating_count + 1; // naive; server will correct
        const newAvg = (v.avg_rating * v.rating_count + rating) / newCount;
        qc.setQueryData(["video", id], {
          ok: prev.ok,
          video: { ...v, rating_count: newCount, avg_rating: newAvg },
        });
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["video", id], ctx.prev);
      Swal.fire({
        icon: "error",
        title: "Rating failed",
        text: "Please try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["video", id] }),
  });

  // --- Add comment
  const addMut = useMutation({
    mutationFn: (payload: { comment: string }) => addComment(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", id] }),
    onError: (e: any) => {
      Swal.fire({
        icon: "error",
        title: "Could not add comment",
        text: e?.response?.data?.message || e?.message || "Try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
  });

  // --- Delete comment
  const delCommentMut = useMutation({
    mutationFn: (commentId: number) => removeComment(id, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", id] }),
    onError: (e: any) => {
      Swal.fire({
        icon: "error",
        title: "Could not delete comment",
        text: e?.response?.data?.message || e?.message || "Try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
  });

  // --- Delete video
  const delVideoMut = useMutation({
    mutationFn: () => removeVideo(id),
    onSuccess: async () => {
      await Swal.fire({
        icon: "success",
        title: "Video deleted",
        confirmButtonColor: "#3B82F6",
      });
      navigate("/feed", { replace: true });
    },
    onError: (e: any) => {
      Swal.fire({
        icon: "error",
        title: "Could not delete video",
        text: e?.response?.data?.message || e?.message || "Try again.",
        confirmButtonColor: "#3B82F6",
      });
    },
  });

  // --- Comment form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentForm>({
    resolver: zodResolver(CommentSchema),
    defaultValues: { comment: "" },
  });

  const onAddComment = async (data: CommentForm) => {
    await addMut.mutateAsync({ comment: data.comment });
    reset();
  };

  if (videoQ.isLoading) {
    return (
      <section className="rounded-xl border border-neutral-dark bg-white p-8 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-dark/40" />
        <div className="mt-4 aspect-video w-full animate-pulse rounded bg-neutral-dark/40" />
      </section>
    );
  }

  if (videoQ.isError || !videoQ.data?.video) {
    return (
      <section className="rounded-xl border border-neutral-dark bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Video not found</h1>
        <Link to="/feed" className="mt-4 inline-block rounded bg-secondary px-4 py-2 text-white hover:opacity-90">
          Back to Feed
        </Link>
      </section>
    );
  }

  const video = videoQ.data.video;
  const isOwner = user?.id === video.uploader_id;

  return (
    <section className="space-y-6">
      {/* Player */}
      <div className="rounded-xl border border-neutral-dark bg-white p-4 shadow-sm">
        <video
          src={video.blob_url}
          controls
          muted
          autoPlay
          loop
          className="aspect-video w-full rounded"
        />
      </div>

      {/* Header */}
      <div className="rounded-xl border border-neutral-dark bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{video.title}</h1>
            {video.description && (
              <p className="mt-2 text-primary/70">{video.description}</p>
            )}
            <p className="mt-2 text-sm text-primary/60">
              Uploaded: {new Date(video.created_at).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-primary/60">
              Visibility: <span className="font-medium">{video.visibility}</span>
            </p>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-2">
              {/* Implement edit flow later */}
              <button
                className="rounded border border-primary px-3 py-2 text-sm hover:bg-neutral-dark"
                onClick={() => Swal.fire({
                  title: "Edit coming soon",
                  text: "PATCH /videos/:id will be wired next.",
                  icon: "info",
                  confirmButtonColor: "#3B82F6",
                })}
              >
                Edit
              </button>
              <button
                className="rounded bg-accent px-3 py-2 text-sm text-white hover:opacity-90"
                onClick={async () => {
                  const result = await Swal.fire({
                    icon: "warning",
                    title: "Delete this video?",
                    text: "This action cannot be undone.",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#F59E0B",
                  });
                  if (result.isConfirmed) delVideoMut.mutate();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <RatingStars
            average={video.avg_rating}
            count={video.rating_count}
            onRate={
              accessToken
                ? (n) => rateMut.mutate(n)
                : undefined
            }
          />
          {!accessToken && (
            <span className="text-sm text-primary/60">
              <Link to="/login" className="text-secondary underline">Login</Link> to rate
            </span>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="rounded-xl border border-neutral-dark bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Comments</h2>

        {accessToken ? (
          <form onSubmit={handleSubmit(onAddComment)} className="mt-4 flex gap-2">
            <input
              {...register("comment")}
              className="w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Write a comment…"
            />
            <button
              type="submit"
              className="rounded bg-secondary px-4 py-2 text-white hover:opacity-90"
              disabled={addMut.isLoading}
            >
              {addMut.isLoading ? "Posting…" : "Post"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-primary/60">
            <Link to="/login" className="text-secondary underline">Login</Link> to comment
          </p>
        )}

        <div className="mt-6 space-y-3">
          {commentsQ.isLoading ? (
            <p className="text-primary/60">Loading comments…</p>
          ) : (commentsQ.data?.data?.length ?? 0) === 0 ? (
            <p className="text-primary/60">No comments yet.</p>
          ) : (
            commentsQ.data!.data.map((c: Comment) => (
              <CommentRow
                key={c.id}
                c={c}
                canDelete={isOwner || c.user_id === user?.id}
                onDelete={() => delCommentMut.mutate(c.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- UI bits ---------- */

function RatingStars({
  average,
  count,
  onRate,
}: {
  average: number;
  count: number;
  onRate?: (n: number) => void;
}) {
  // show 5 clickable stars; half-stars via text fallback is fine for MVP
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onRate && onRate(n)}
            className={`px-1 text-xl ${onRate ? "cursor-pointer" : "cursor-default"}`}
            title={onRate ? `Rate ${n}` : undefined}
          >
            <span className={n <= Math.round(average) ? "text-accent" : "text-neutral-dark"}>
              ★
            </span>
          </button>
        ))}
      </div>
      <span className="text-sm text-primary/60">
        {round1(average)} · {count} ratings
      </span>
    </div>
  );
}

function CommentRow({
  c,
  canDelete,
  onDelete,
}: {
  c: Comment;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="rounded border border-neutral-dark p-3">
      <div className="flex items-center justify-between">
        <p className="font-medium">{c.username}</p>
        <span className="text-xs text-primary/50">
          {new Date(c.created_at).toLocaleString()}
        </span>
      </div>
      <p className="mt-1 text-sm text-primary/80">{c.comment}</p>
      {canDelete && (
        <div className="mt-2 text-right">
          <button
            onClick={onDelete}
            className="rounded border border-primary px-2 py-1 text-xs hover:bg-neutral-dark"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
