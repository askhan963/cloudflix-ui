import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-extrabold text-primary">404</h1>
      <p className="mt-2 text-primary/70">Page not found</p>
      <Link
        to="/"
        className="mt-6 rounded bg-secondary px-4 py-2 text-white hover:opacity-90"
      >
        Go Home
      </Link>
    </section>
  );
}
