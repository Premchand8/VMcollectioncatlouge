"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { ProductMedia } from "@/components/ProductMedia";
import { ProductSpecs } from "@/components/ProductSpecs";
import { productPath } from "@/lib/paths";
import type { Product } from "@/lib/types";
import { whatsAppHref } from "@/lib/whatsapp";

export function ProductDetail({
  slug,
  collectionName,
  products,
  product,
}: {
  slug: string;
  collectionName: string;
  products: Product[];
  product: Product;
}) {
  const router = useRouter();
  const drag = useRef<{ x: number; y: number } | null>(null);
  const index = products.findIndex((item) => item.code === product.code);
  const previous = index > 0 ? products[index - 1] : undefined;
  const next = index >= 0 && index < products.length - 1 ? products[index + 1] : undefined;
  const enquire = whatsAppHref(collectionName, product);

  const go = useCallback(
    (code: string | undefined) => {
      if (!code) return;
      router.push(productPath(slug, code));
    },
    [router, slug],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-carousel]")) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(next?.code);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(previous?.code);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, next?.code, previous?.code]);

  return (
    <article className="pb-28 lg:pb-16">
      <p className="sr-only" aria-live="polite">
        {product.name}, piece {index + 1} of {products.length}
      </p>

      <div className="px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8 xl:gap-12">
        <div className="lg:sticky lg:top-[4.75rem] lg:self-start">
          <ProductMedia
            key={product.code}
            images={product.images}
            videoUrl={product.videoUrl}
            name={product.name}
            onEdgeSwipe={(direction) =>
              go(direction === "next" ? next?.code : previous?.code)
            }
          />
        </div>

        <div
          className="touch-pan-y lg:flex lg:min-h-0 lg:flex-col lg:pt-0"
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("a, button")) return;
            drag.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!drag.current) return;
            const dx = event.clientX - drag.current.x;
            const dy = event.clientY - drag.current.y;
            drag.current = null;
            if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
            go(dx < 0 ? next?.code : previous?.code);
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-gold lg:mt-0">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-[2.15rem] leading-[1.05] text-navy sm:text-4xl lg:mt-2 lg:text-[2.35rem]">
            {product.name}
          </h1>
          <span className="gold-rule mt-3 lg:mt-3" />
          <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-muted lg:mt-3 lg:line-clamp-3">
            {product.description}
          </p>

          <ProductSpecs product={product} />

          {enquire ? (
            <a
              href={enquire}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 hidden h-11 w-full items-center justify-center bg-navy px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 lg:mt-5 lg:inline-flex"
            >
              Enquire on WhatsApp
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
          ) : null}

          <nav
            aria-label="Other pieces in this collection"
            className="mt-10 lg:mt-8"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">
              More from {collectionName}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {previous ? (
                <NeighborCard
                  label="Previous"
                  product={previous}
                  href={productPath(slug, previous.code)}
                  align="left"
                />
              ) : (
                <span className="flex min-h-20 items-center border border-line px-3 text-sm text-muted">
                  Previous
                </span>
              )}
              {next ? (
                <NeighborCard
                  label="Next"
                  product={next}
                  href={productPath(slug, next.code)}
                  align="right"
                />
              ) : (
                <span className="flex min-h-20 items-center justify-end border border-line px-3 text-sm text-muted">
                  Next
                </span>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile sticky enquire — desktop uses the in-column CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 backdrop-blur-md lg:hidden">
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-gold-fill/60 to-transparent"
        />
        <div className="mx-auto flex max-w-5xl gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          {enquire ? (
            <a
              href={enquire}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-1 items-center justify-center bg-navy px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            >
              Enquire on WhatsApp
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-12 flex-1 items-center justify-center bg-navy px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white opacity-60"
            >
              Enquire on WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function NeighborCard({
  label,
  product,
  href,
  align,
}: {
  label: string;
  product: Product;
  href: string;
  align: "left" | "right";
}) {
  const thumb = product.images[0];
  return (
    <Link
      href={href}
      prefetch={true}
      className={`flex min-h-20 items-center gap-3 border border-line bg-card p-2 transition-colors hover:border-gold/50 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-surface">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="56px"
            className="object-contain p-0.5"
          />
        ) : null}
      </div>
      <span className="min-w-0">
        <span className="block text-[9px] uppercase tracking-[0.2em] text-gold">
          {label}
        </span>
        <span className="mt-1 block font-display text-lg leading-tight text-navy">
          {product.name}
        </span>
      </span>
    </Link>
  );
}
