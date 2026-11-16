import { ProductTile } from "@/components/ProductTile";
import { productPath } from "@/lib/paths";
import type { Product } from "@/lib/types";

export function ProductGrid({
  slug,
  products,
}: {
  slug: string;
  products: Product[];
}) {
  if (products.length === 0) {
    return (
      <p className="mt-6 text-muted">No pieces have been added to this collection yet.</p>
    );
  }

  return (
    <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-7 md:gap-y-14">
      {products.map((product, index) => (
        <ProductTile
          key={product.code}
          product={product}
          href={productPath(slug, product.code)}
          priority={index < 2}
          index={index}
        />
      ))}
    </ul>
  );
}
