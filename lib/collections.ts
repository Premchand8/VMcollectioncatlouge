import rawCollections from "@/data/collections.json";
import type { Collection, Product } from "@/lib/types";

const collections = rawCollections as Collection[];

export function getCollections(): Collection[] {
  return collections;
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProduct(
  collection: Collection,
  code: string,
): Product | undefined {
  return collection.products.find((product) => product.code === code);
}

export function hasCollectionFilm(collection: Collection): boolean {
  return Boolean(collection.videoUrl?.trim());
}

export function coverImage(collection: Collection): string | undefined {
  if (collection.bannerImage) return collection.bannerImage;
  if (collection.videoPoster) return collection.videoPoster;
  for (const product of collection.products) {
    if (product.images[0]) return product.images[0];
  }
  return undefined;
}
