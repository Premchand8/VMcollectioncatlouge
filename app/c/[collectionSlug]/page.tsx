import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionBanner } from "@/components/CollectionBanner";
import { ProductGrid } from "@/components/ProductGrid";
import {
  getCollection,
  getCollections,
  hasCollectionFilm,
} from "@/lib/collections";

type CollectionPageProps = {
  params: Promise<{ collectionSlug: string }>;
};

export function generateStaticParams() {
  return getCollections().map((collection) => ({
    collectionSlug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collectionSlug } = await params;
  const collection = getCollection(collectionSlug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = await params;
  const collection = getCollection(collectionSlug);
  if (!collection) notFound();

  const film = hasCollectionFilm(collection);
  const poster = collection.videoPoster ?? collection.bannerImage;
  const earrings = collection.products.filter((p) => p.category === "Earrings").length;
  const pendants = collection.products.filter((p) => p.category === "Pendant").length;
  const count = collection.products.length;

  return (
    <main id="content" className="pb-20">
      {film && collection.videoUrl ? (
        <CollectionBanner
          videoUrl={collection.videoUrl}
          poster={poster}
          title={collection.name}
          tagline={collection.tagline}
        />
      ) : null}

      <section
        id="pieces"
        className="mx-auto w-full max-w-5xl scroll-mt-24 px-4 pt-14 sm:px-6"
      >
        <div className="max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
            The collection
          </p>
          {!film ? (
            <h1 className="mt-4 font-display text-5xl leading-none text-navy">
              {collection.name}
            </h1>
          ) : (
            <h2 className="mt-4 font-display text-[2.6rem] leading-none text-navy sm:text-5xl">
              Earrings &amp; pendants
            </h2>
          )}
          <span className="gold-rule mt-5" />
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
            {collection.description}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted">
            {count} pieces
            {earrings || pendants
              ? ` · ${earrings} earrings · ${pendants} pendants`
              : null}
          </p>
        </div>
        <ProductGrid slug={collection.slug} products={collection.products} />
      </section>
    </main>
  );
}
