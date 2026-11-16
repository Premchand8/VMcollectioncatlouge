export type ProductCategory = "Earrings" | "Pendant" | "Ring";

export type Product = {
  /** MAIN_STOCK_CODE — barcode printed with the piece */
  code: string;
  name: string;
  /** Short shopper-facing note */
  description: string;
  /** CATG → Earrings / Pendant / Ring */
  category: ProductCategory;
  /** CLASIFICATION → e.g. Diamond */
  classification: string;
  /** Metal colour / type for the shopper */
  metal: string;
  /** PURITY → 18 or 22 */
  purityKt?: number;
  /** METAL_WT in grams */
  metalWeightG?: number;
  /** DIA_WT in carats */
  diamondWeightCt?: number;
  /** DIA_PCS */
  diamondPieces?: number;
  /** CLS_WT in carats — colour stones, if any */
  colorStoneWeightCt?: number;
  /** CLS_PCS */
  colorStonePieces?: number;
  /** WEIGHT — total piece weight in grams */
  totalWeightG?: number;
  /** Angle photographs: barcode_1, barcode_2, barcode_3 */
  images: string[];
  /** Piece film: barcode_4 */
  videoUrl?: string;
};

export type Collection = {
  /** Permanent QR path segment: /c/[slug] */
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage?: string;
  videoUrl?: string;
  videoPoster?: string;
  products: Product[];
};
