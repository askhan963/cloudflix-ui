import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { uploadVideo } from "../api/videos";
import { useAuthStore } from "../store/auth";

// --- Validation ---
const MAX_MB = 500;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPTED = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska",
];

const UploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(2000, "Max 2000 characters").optional().or(z.literal("")).transform(v => v || undefined),
  genre: z.string().max(120, "Max 120 characters").optional().or(z.literal("")).transform(v => v || undefined),
  producer: z.string().max(120, "Max 120 characters").optional().or(z.literal("")).transform(v => v || undefined),
  age_rating: z.string().max(20, "Max 20 characters").optional().or(z.literal("")).transform(v => v || undefined),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  file: z
    .custom<File>((v) => v instanceof File, "File is required")
    .refine((f) => f && ACCEPTED.includes(f.type), "Unsupported file type. Use MP4/WebM/OGG/MOV/MKV.")
    .refine((f) => f && f.size <= MAX_BYTES, `File too large. Max ${MAX_MB}MB`),
});
type UploadForm = z.infer<typeof UploadSchema>;

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // route should be guarded for creators already
  const [progress, setProgress] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UploadForm>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      producer: "",
      age_rating: "",
      visibility: "public",
    },
  });

  const onSubmit = async (values: UploadForm) => {
    try {
      setSubmitting(true);
      setProgress(0);

      const res = await uploadVideo(
        {
          file: values.file as File,
          title: values.title,
          description: values.description,
          genre: values.genre,
          producer: values.producer,
          age_rating: values.age_rating,
          visibility: values.visibility,
        },
        (pct) => setProgress(pct)
      );

      await Swal.fire({
        icon: "success",
        title: "Upload complete",
        text: "Redirecting to your video…",
        confirmButtonColor: "#3B82F6",
        timer: 1200,
        showConfirmButton: true,
      });

      reset();
      navigate(`/v/${res.id}`, { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Upload failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: msg,
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-neutral-dark bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Upload a Video</h1>
        <p className="mt-1 text-sm text-primary/70">
          Supported: MP4/WebM/OGG/MOV/MKV • Max {MAX_MB}MB
        </p>
        {user?.role !== "creator" && (
          <p className="mt-2 rounded bg-accent/10 px-3 py-2 text-sm text-accent">
            Note: Only creators can upload. (This page is usually protected.)
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-neutral-dark bg-white p-6 shadow-sm"
      >
        {/* Title */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Title</label>
            <input
              {...register("title")}
              className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="My awesome short"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* File */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Video file</label>
            <Controller
              name="file"
              control={control}
              render={({ field: { onChange } }) => (
                <input
                  type="file"
                  accept={ACCEPTED.join(",")}
                  className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 file:mr-4 file:rounded file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-white hover:file:opacity-90"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    onChange(f || undefined);
                  }}
                />
              )}
            />
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{String(errors.file.message)}</p>
            )}
          </div>

          {/* Optional fields */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Say something about your video"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Genre</label>
            <input
              {...register("genre")}
              className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Comedy, Sports, Music..."
            />
            {errors.genre && (
              <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Producer</label>
            <input
              {...register("producer")}
              className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Producer name"
            />
            {errors.producer && (
              <p className="mt-1 text-sm text-red-600">{errors.producer.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Age rating</label>
            <input
              {...register("age_rating")}
              className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="G, PG, PG-13, 16+, 18+"
            />
            {errors.age_rating && (
              <p className="mt-1 text-sm text-red-600">{errors.age_rating.message}</p>
            )}
          </div>

          {/* Visibility */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Visibility</label>
            <select
              {...register("visibility")}
              className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              defaultValue="public"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
            {errors.visibility && (
              <p className="mt-1 text-sm text-red-600">{errors.visibility.message}</p>
            )}
          </div>
        </div>

        {/* Progress */}
        {submitting && (
          <div className="mt-6">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Uploading…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded bg-neutral-dark/50">
              <div
                className="h-2 bg-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-secondary px-5 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Uploading…" : "Upload"}
          </button>
        </div>
      </form>
    </section>
  );
}
