"use client";

import { useState } from "react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { VideoBanner } from "@/components/VideoBanner";

export function ProductMedia({
  images,
  videoUrl,
  name,
  onEdgeSwipe,
}: {
  images: string[];
  videoUrl?: string;
  name: string;
  onEdgeSwipe?: (direction: "next" | "previous") => void;
}) {
  const hasFilm = Boolean(videoUrl);
  const [tab, setTab] = useState<"photos" | "film">("photos");

  return (
    <div className="w-full">
      {hasFilm ? (
        <div
          role="tablist"
          aria-label="Piece media"
          className="mb-3 grid grid-cols-2 border border-line lg:mb-3"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "photos"}
            onClick={() => setTab("photos")}
            className={`h-11 text-[10px] uppercase tracking-[0.24em] transition-colors sm:h-12 lg:h-10 ${
              tab === "photos"
                ? "bg-navy text-white"
                : "bg-transparent text-muted hover:text-navy"
            }`}
          >
            Angles
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "film"}
            onClick={() => setTab("film")}
            className={`h-11 text-[10px] uppercase tracking-[0.24em] transition-colors sm:h-12 lg:h-10 ${
              tab === "film"
                ? "bg-navy text-white"
                : "bg-transparent text-muted hover:text-navy"
            }`}
          >
            Film
          </button>
        </div>
      ) : null}

      {tab === "photos" || !videoUrl ? (
        <ImageCarousel
          images={images}
          name={name}
          onEdgeSwipe={onEdgeSwipe}
        />
      ) : (
        <VideoBanner
          src={videoUrl}
          poster={images[0]}
          title={name}
          filmLabel="Piece film"
          backLabel="Back to piece"
        />
      )}
    </div>
  );
}
