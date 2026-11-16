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
      <div className="product-frame flex items-center justify-center bg-surface text-sm text-muted">
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

  function renderThumbs(prefix: string) {
    if (images.length <= 1) return null;
    return images.map((src, imageIndex) => (
      <button
        key={`${prefix}-${src}-${imageIndex}`}
        type="button"
        role="tab"
        aria-selected={imageIndex === safeIndex}
        aria-label={`Photograph ${imageIndex + 1} of ${images.length}`}
        onClick={() => show(imageIndex)}
        className={`relative h-14 w-14 shrink-0 overflow-hidden border transition-colors sm:h-16 sm:w-16 lg:h-14 lg:w-14 ${
          imageIndex === safeIndex
            ? "border-gold-fill"
            : "border-line hover:border-gold/50"
        }`}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="64px"
          className="object-contain bg-surface p-1"
        />
      </button>
    ));
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
      <div className="lg:flex lg:items-start lg:gap-3">
        {images.length > 1 ? (
          <div
            className="hidden lg:flex lg:max-h-[400px] lg:flex-col lg:gap-2 lg:overflow-y-auto"
            role="tablist"
            aria-label="Photographs"
          >
            {renderThumbs("desk")}
          </div>
        ) : null}

        <div className="relative min-w-0 flex-1 overflow-hidden bg-surface">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${safeIndex * 100}%)` }}
          >
            {images.map((src, imageIndex) => (
              <div
                key={`${src}-${imageIndex}`}
                className="flex w-full shrink-0 grow-0 basis-full justify-center"
              >
                <div className="product-frame">
                  <Image
                    src={src}
                    alt={`${name}, photograph ${imageIndex + 1} of ${images.length}`}
                    fill
                    priority={imageIndex === 0}
                    sizes="(max-width: 1023px) 92vw, 480px"
                    className="object-contain object-center p-2 sm:p-3"
                  />
                </div>
              </div>
            ))}
          </div>
          {images.length > 1 ? (
            <p className="absolute bottom-3 left-3 z-10 bg-navy-deep/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] tabular-nums text-white backdrop-blur-sm">
              {safeIndex + 1} / {images.length}
            </p>
          ) : null}
          {images.length > 1 ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2">
              <button
                type="button"
                aria-label="Previous photograph"
                disabled={safeIndex === 0}
                onClick={() => show(safeIndex - 1)}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center bg-navy-deep/55 text-white backdrop-blur-sm transition-opacity hover:opacity-90 disabled:opacity-30"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next photograph"
                disabled={safeIndex === images.length - 1}
                onClick={() => show(safeIndex + 1)}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center bg-navy-deep/55 text-white backdrop-blur-sm transition-opacity hover:opacity-90 disabled:opacity-30"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Photograph {safeIndex + 1} of {images.length}
      </p>

      {images.length > 1 ? (
        <div
          className="mt-3 flex justify-center gap-2 sm:mt-4 lg:hidden"
          role="tablist"
          aria-label="Photographs"
        >
          {renderThumbs("mob")}
        </div>
      ) : null}
    </div>
  );
}
