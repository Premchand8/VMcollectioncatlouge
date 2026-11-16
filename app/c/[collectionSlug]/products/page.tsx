import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { ProductGallery } from "@/components/ProductGallery";
import { ViewSwitch } from "@/components/ViewSwitch";
import { getCollection, getCollections, hasCollectionFilm } from "@/lib/collections";
import { collectionPath } from "@/lib/paths";

type GalleryPageProps = {
  params: Promise<{ collectionSlug: string }>;
  searchParams: Promise<{ product?: string | string[] }>;
};

export function generateStaticParams() {
  return getCollections().map((collection) => ({
    collectionSlug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { collectionSlug } = await params;
  const collection = getCollection(collectionSlug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: `${collection.name} gallery`,
    description: `Photographs of every piece in the ${collection.name}.`,
  };
}

export default async function GalleryPage({ params, searchParams }: GalleryPageProps) {
  const { collectionSlug } = await params;
  const query = await searchParams;
  const collection = getCollection(collectionSlug);
  if (!collection) notFound();

  const rawFocus = Array.isArray(query.product) ? query.product[0] : query.product;
  const focusCode = rawFocus
    ? collection.products.some((product) => product.code === rawFocus)
      ? rawFocus
      : undefined
    : undefined;

  return (
    <main id="content" className="mx-auto w-full max-w-3xl px-4 pb-16">
      <BackLink href={collectionPath(collection.slug)} label="Collection" />
      {hasCollectionFilm(collection) ? (
        <ViewSwitch slug={collection.slug} active="gallery" />
      ) : null}
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{collection.name}</p>
      <h1 className="mt-2 font-display text-4xl leading-none">All pieces</h1>
      <p className="mt-3 mb-6 text-sm text-muted">
        Every photograph in this collection. Tap a piece to see its details.
      </p>
      <ProductGallery
        slug={collection.slug}
        products={collection.products}
        focusCode={focusCode}
      />
    </main>
  );
}
