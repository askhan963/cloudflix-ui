import { useParams } from "react-router-dom";

export default function VideoDetail() {
  const { id } = useParams();
  return (
    <section className="rounded-xl border border-neutral-dark bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Video Detail</h1>
      <p className="mt-2 text-primary/70">Video ID: {id}</p>
      <p className="mt-2 text-primary/70">TODO: Show video player, ratings, comments.</p>
    </section>
  );
}
