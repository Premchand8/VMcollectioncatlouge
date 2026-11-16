import type { Product } from "@/lib/types";

export function whatsAppHref(
  collectionName: string,
  product: Product,
): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const number = raw.replace(/[^\d]/g, "");
  if (!number) return null;

  const label =
    product.name && product.name !== product.code
      ? `${product.name} (${product.code})`
      : product.code;
  const text = `Hello, I would like to enquire about ${label} from the ${collectionName}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
