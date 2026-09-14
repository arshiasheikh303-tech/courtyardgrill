"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Cat = "All" | "Food" | "BBQ" | "Restaurant" | "Atmosphere";

const photos: { src: string; alt: string; cat: Cat }[] = [
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80", alt: "Beef tikka skewers on the grill", cat: "BBQ" },
  { src: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80", alt: "Whole charcoal grilled chicken", cat: "BBQ" },
  { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80", alt: "Restaurant interior seating", cat: "Restaurant" },
  { src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80", alt: "Malai boti plated", cat: "Food" },
  { src: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80", alt: "Beef seekh kebabs", cat: "Food" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80", alt: "Guests dining together", cat: "Atmosphere" },
  { src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80", alt: "Whole grilled fish", cat: "Food" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80", alt: "Evening ambience at the restaurant", cat: "Atmosphere" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=80", alt: "Charcoal grill flames", cat: "BBQ" },
];

const cats: Cat[] = ["All", "Food", "BBQ", "Restaurant", "Atmosphere"];

export default function GalleryPage() {
  const [active, setActive] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const visible = active === "All" ? photos : photos.filter((p) => p.cat === active);

  return (
    <div className="bg-char-900">
      <section className="container-px mx-auto max-w-7xl py-20">
        <p className="text-sm text-ember-400">Gallery</p>
        <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">See It, Smell It, Crave It</h1>

        <div className="mt-8 flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs transition",
                active === c
                  ? "border-ember-500 bg-ember-500 text-char-950"
                  : "border-parchment/20 text-parchment/70 hover:border-parchment/40"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {visible.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setLightbox(photo.src)}
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-char-950/95 p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 text-parchment hover:text-cream"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <div className="relative h-[80vh] w-full max-w-3xl">
            <Image src={lightbox} alt="Enlarged photo" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
