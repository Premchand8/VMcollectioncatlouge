"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

type ImageCarouselProps = {
  images: string[];
  name: string;
  onEdgeSwipe?: (direction: "next" | "previous") => void;
};

export function ImageCarousel({ images, name, onEdgeSwipe }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-card text-sm text-muted">
        No photograph yet
      </div>
    );
  }

  const safeIndex = Math.min(index, images.length - 1);

  function show(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setIndex(nextIndex);
  }

  function finishDrag(clientX: number, clientY: number) {
    if (!drag) return;
    const dx = clientX - drag.x;
    const dy = clientY - drag.y;
    setDrag(null);
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      if (safeIndex < images.length - 1) show(safeIndex + 1);
      else onEdgeSwipe?.("next");
    } else if (safeIndex > 0) {
      show(safeIndex - 1);
    } else {
      onEdgeSwipe?.("previous");
    }
  }

  return (
    <div
      data-carousel
      className="touch-pan-y"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if ((event.target as HTMLElement).closest("button")) return;
        setDrag({ x: event.clientX, y: event.clientY });
      }}
      onPointerUp={(event) => finishDrag(event.clientX, event.clientY)}
      onPointerCancel={() => setDrag(null)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          show(safeIndex + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          show(safeIndex - 1);
        }
      }}
    >
      <div className="relative overflow-hidden bg-card">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {images.map((src, imageIndex) => (
            <div
              key={`${src}-${imageIndex}`}
              className="relative aspect-[4/5] w-full shrink-0 grow-0 basis-full"
            >
              <Image
                src={src}
                alt={`${name}, photograph ${imageIndex + 1} of ${images.length}`}
                fill
                priority={imageIndex === 0}
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {images.length > 1 ? (
          <p className="absolute bottom-3 left-3 bg-navy-deep/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] tabular-nums text-white backdrop-blur-sm">
            {safeIndex + 1} / {images.length}
          </p>
        ) : null}
        {images.length > 1 ? (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
            <button
              type="button"
              aria-label="Previous photograph"
              disabled={safeIndex === 0}
              onClick={() => show(safeIndex - 1)}
              className="inline-flex h-10 w-10 items-center justify-center bg-navy-deep/55 text-white backdrop-blur-sm transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next photograph"
              disabled={safeIndex === images.length - 1}
              onClick={() => show(safeIndex + 1)}
              className="inline-flex h-10 w-10 items-center justify-center bg-navy-deep/55 text-white backdrop-blur-sm transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        Photograph {safeIndex + 1} of {images.length}
      </p>
      {images.length > 1 ? (
        <div className="flex justify-center" role="tablist" aria-label="Photographs">
          {images.map((src, imageIndex) => (
            <button
              key={`${src}-dot-${imageIndex}`}
              type="button"
              role="tab"
              aria-selected={imageIndex === safeIndex}
              aria-label={`Photograph ${imageIndex + 1} of ${images.length}`}
              onClick={() => show(imageIndex)}
              className="inline-flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`h-px transition-all duration-300 ${
                  imageIndex === safeIndex
                    ? "w-6 bg-gold-fill"
                    : "w-3 bg-line"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
