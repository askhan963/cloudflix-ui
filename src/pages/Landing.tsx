import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-neutral text-primary">
    

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-neutral to-white/60"
          aria-hidden
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-dark bg-white px-3 py-1 text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Minimal • Fast • Typed
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Watch. Rate. Discuss. <span className="text-secondary">CloudFlix</span>
            </h1>
            <p className="mt-4 text-lg text-primary/80">
              A minimal-but-polished TikTok-style web app built with React + TypeScript,
              Tailwind, Axios, and React Query. Upload videos, get ratings, and chat in
              comments—fast.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/feed"
                className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-3 text-white hover:opacity-90"
              >
                Explore Videos
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg border border-primary px-5 py-3 hover:bg-neutral-dark"
              >
                Get Started
              </Link>
            </div>

            <p className="mt-3 text-sm text-primary/70">
              Creator?{" "}
              <Link to="/upload" className="underline decoration-accent underline-offset-4">
                Upload a video
              </Link>
            </p>

            {/* STATS */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center sm:max-w-md">
              {[
                { k: "0.2s", l: "First load" },
                { k: "100%", l: "Typed APIs" },
                { k: "0 deps", l: "Extra UI libs" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-neutral-dark bg-white p-4">
                  <div className="text-2xl font-bold">{s.k}</div>
                  <div className="text-xs text-primary/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="aspect-video w-full rounded-2xl border border-neutral-dark bg-white shadow-sm">
              <div className="flex h-full items-center justify-center">
                <div className="mx-auto max-w-sm p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-accent" />
                  <p className="text-sm text-primary/70">
                    Drop in your .mp4, track progress, and jump straight to the detail
                    page with autoplay. Ratings and comments included.
                  </p>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-secondary/10 blur-2xl"
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Why CloudFlix?</h2>
        <p className="mt-2 text-primary/70">
          Built for speed, correctness, and a clean developer experience.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group rounded-2xl border border-neutral-dark bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
                <span className="sr-only">{f.title} icon</span>
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-primary/70">{f.desc}</p>
              <div className="mt-4 text-sm">
                <span className="rounded bg-secondary/10 px-2 py-1 text-secondary">
                  {f.tag}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Get started in 3 steps</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Create an account",
              d: "Signup as creator or consumer—your call.",
              cta: { to: "/signup", label: "Signup" },
            },
            {
              t: "Browse the feed",
              d: "Paginated grid with clean loading states.",
              cta: { to: "/feed", label: "Open Feed" },
            },
            {
              t: "Upload a video",
              d: "MP4 upload with progress → instant detail view.",
              cta: { to: "/upload", label: "Upload" },
            },
          ].map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-neutral-dark bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white">
                  {i + 1}
                </span>
                <h3 className="font-semibold">{s.t}</h3>
              </div>
              <p className="mt-2 text-sm text-primary/70">{s.d}</p>
              <Link
                to={s.cta.to}
                className="mt-4 inline-flex rounded-lg border border-primary px-3 py-2 text-sm hover:bg-neutral-dark"
              >
                {s.cta.label}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold md:text-3xl">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FAQ.map((q) => (
            <details
              key={q.q}
              className="group rounded-xl border border-neutral-dark bg-white p-5"
            >
              <summary className="cursor-pointer list-none font-medium">
                {q.q}
                <span className="float-right text-secondary group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-2 text-sm text-primary/70">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-dark bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm md:flex-row">
          <p className="text-primary/70">
            © {new Date().getFullYear()} CloudFlix. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/feed" className="hover:underline">
              Feed
            </Link>
            <Link to="/me" className="hover:underline">
              Profile
            </Link>
            <Link to="/upload" className="rounded bg-accent px-3 py-1.5 text-white hover:opacity-90">
              Upload
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Data ---------- */

const FEATURES = [
  {
    title: "Typed & Cached",
    desc: "React Query with typed Axios endpoints keeps data fast and predictable.",
    tag: "React Query",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V3a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    title: "Auth & Refresh",
    desc: "JWT in store, auto refresh on 401, and me() hydrate on load.",
    tag: "Secure",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 1a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v10H4V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm3 7V6a3 3 0 1 0-6 0v2h6z" />
      </svg>
    ),
  },
  {
    title: "Upload + Progress",
    desc: "Multipart .mp4 upload with progress; redirect to detail on success.",
    tag: "Creator Flow",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M5 20h14v-2H5v2zm7-16l5 5h-3v4h-4V9H7l5-5z" />
      </svg>
    ),
  },
  {
    title: "Ratings",
    desc: "Half-star average display with optimistic user rating.",
    tag: "Engagement",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="m12 17.27 5.18 3.05-1.64-5.81L20 10.5l-6-.22L12 4 10 10.28l-6 .22 4.46 3.99L6.82 20.3 12 17.27z" />
      </svg>
    ),
  },
  {
    title: "Comments",
    desc: "Newest-first with delete for author or video owner.",
    tag: "Community",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M21 6H3v12h4v4l6-4h8z" />
      </svg>
    ),
  },
  {
    title: "Minimal Footprint",
    desc: "No bulky UI kit; Tailwind + small components only.",
    tag: "Performance",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    ),
  },
];

const FAQ = [
  {
    q: "What’s the tech stack?",
    a: "React + TypeScript + Vite, Tailwind CSS, React Router, Axios with interceptors, React Query, and RHF + zod for forms.",
  },
  {
    q: "Does the API URL include /api?",
    a: "Yes. Set VITE_API_BASE_URL to the base that already includes /api (e.g., https://<api>.azurewebsites.net/api).",
  },
  {
    q: "Who can upload?",
    a: "Users with the creator role. The UI hides Upload for others; server still enforces it.",
  },
  {
    q: "How are ratings handled?",
    a: "Average and count are part of the video payload. When you rate, we optimistically update and then confirm with the server.",
  },
];
