// src/pages/Home.tsx
import { useState } from "react";
import type { Video } from "../lib/types";

export default function Home() {
  const [videos] = useState<Video[]>([]); // typed array

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Video Feed</h1>

      {videos.length === 0 ? (
        <div className="rounded-lg border border-neutral-dark bg-white p-8 text-center">
          <p className="text-primary/70">No videos yet. Upload your first video!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <div key={v.id} className="rounded-lg border border-neutral-dark bg-white p-4">
              <p className="font-semibold">{v.title}</p>
              <p className="text-sm text-primary/60">Uploader ID: {v.uploader_id}</p>
              {/* Replace with uploader username when your API returns it */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
