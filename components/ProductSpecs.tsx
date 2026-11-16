import {
  formatDiamondLine,
  formatMetalWeight,
  formatPurity,
} from "@/lib/format";
import type { Product } from "@/lib/types";

type SpecRow = { label: string; value: string };

/**
 * Customer-facing details only.
 * Shown: Category, Type, Metal + purity, Gold weight, Diamond, Colour stone, Stock code.
 */
export function ProductSpecs({ product }: { product: Product }) {
  const rows = buildCustomerSpecs(product);

  return (
    <section aria-label="Product details" className="mt-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-gold">
        Product details
      </p>
      <span className="gold-rule mt-3" />
      <dl className="mt-5 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 py-4"
          >
            <dt className="text-[13px] text-muted">{row.label}</dt>
            <dd className="max-w-[62%] text-right text-[13px] font-medium tracking-wide text-navy tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function buildCustomerSpecs(product: Product): SpecRow[] {
  const rows: SpecRow[] = [];

  rows.push({ label: "Category", value: product.category });

  if (product.classification) {
    rows.push({ label: "Type", value: product.classification });
  }

  const metalParts = [product.metal];
  if (typeof product.purityKt === "number") {
    metalParts.push(formatPurity(product.purityKt));
  }
  rows.push({ label: "Metal", value: metalParts.join(" · ") });

  if (typeof product.metalWeightG === "number") {
    rows.push({
      label: "Gold weight",
      value: formatMetalWeight(product.metalWeightG),
    });
  }

  const diamond = formatDiamondLine(
    product.diamondWeightCt,
    product.diamondPieces,
  );
  if (diamond) {
    rows.push({ label: "Diamond", value: diamond });
  }

  if (
    typeof product.colorStoneWeightCt === "number" &&
    product.colorStoneWeightCt > 0
  ) {
    const colorStone = formatDiamondLine(
      product.colorStoneWeightCt,
      product.colorStonePieces,
    );
    if (colorStone) {
      rows.push({ label: "Colour stone", value: colorStone });
    }
  }

  if (typeof product.totalWeightG === "number") {
    rows.push({
      label: "Total weight",
      value: formatMetalWeight(product.totalWeightG),
    });
  }

  rows.push({ label: "Stock code", value: product.code });

  return rows;
}
