import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductTile({
  product,
  href,
  priority = false,
  index = 0,
}: {
  product: Product;
  href: string;
  priority?: boolean;
  index?: number;
}) {
  const image = product.images[0];

  return (
    <li
      className="animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
    >
      <Link href={href} prefetch={true} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          {image ? (
            <Image
              src={image}
              alt={`${product.name}, angle 1`}
              fill
              sizes="(max-width: 768px) 46vw, 280px"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-sm text-muted">
              No photograph
            </div>
          )}
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-gold">
          {product.category}
        </p>
        <p className="mt-2 font-display text-[1.4rem] leading-tight text-navy transition-colors group-hover:text-gold">
          {product.name}
        </p>
        <p className="mt-2 text-[11px] tracking-[0.12em] text-muted">
          {product.code}
        </p>
        <span
          aria-hidden="true"
          className="mt-3 block h-px w-0 bg-gold-fill transition-all duration-500 group-hover:w-10"
        />
      </Link>
    </li>
  );
}
