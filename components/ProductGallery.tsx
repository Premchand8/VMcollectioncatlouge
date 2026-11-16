import Image from "next/image";
import Link from "next/link";
import { ScrollToSelected } from "@/components/ScrollToSelected";
import { productPath } from "@/lib/paths";
import type { Product } from "@/lib/types";

export function ProductGallery({
  slug,
  products,
  focusCode,
}: {
  slug: string;
  products: Product[];
  focusCode?: string;
}) {
  if (products.length === 0) {
    return <p className="text-muted">No pieces have been added to this collection yet.</p>;
  }

  const cells = products.flatMap((product) => {
    if (product.images.length === 0) {
      return [{ product, src: undefined as string | undefined, imageIndex: 0 }];
    }
    return product.images.map((src, imageIndex) => ({ product, src, imageIndex }));
  });

  return (
    <>
      {focusCode ? <ScrollToSelected id={`product-${focusCode}`} /> : null}
      <ul className="grid grid-cols-2 gap-3">
        {cells.map(({ product, src, imageIndex }) => {
          const selected = product.code === focusCode;
          return (
            <li
              key={`${product.code}-${imageIndex}`}
              id={imageIndex === 0 ? `product-${product.code}` : undefined}
              className="scroll-mt-32"
            >
              <Link
                href={productPath(slug, product.code)}
                prefetch={true}
                aria-current={selected ? "true" : undefined}
                className={`block bg-card ${
                  selected ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""
                }`}
              >
                <div className="relative aspect-[4/5]">
                  {src ? (
                    <Image
                      src={src}
                      alt={`${product.name}, photograph ${imageIndex + 1} of ${Math.max(product.images.length, 1)}`}
                      fill
                      sizes="(max-width: 768px) 46vw, 360px"
                      priority={imageIndex === 0 && products[0]?.code === product.code}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted">
                      No photograph
                    </div>
                  )}
                  {selected ? (
                    <span className="absolute left-2 top-2 bg-gold-fill px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-gold-ink">
                      Selected
                    </span>
                  ) : null}
                </div>
                <span className="block px-2 py-3">
                  <span className="block text-[11px] tracking-[0.12em] text-muted">
                    {product.code}
                  </span>
                  <span className="mt-1 block font-display text-lg leading-tight">
                    {product.name}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
