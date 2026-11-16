import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { ProductDetail } from "@/components/ProductDetail";
import { getCollection, getCollections, getProduct } from "@/lib/collections";
import { collectionPath } from "@/lib/paths";

type ProductPageProps = {
  params: Promise<{ collectionSlug: string; productCode: string }>;
};

export function generateStaticParams() {
  return getCollections().flatMap((collection) =>
    collection.products.map((product) => ({
      collectionSlug: collection.slug,
      productCode: product.code,
    })),
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { collectionSlug, productCode } = await params;
  const collection = getCollection(collectionSlug);
  const product = collection ? getProduct(collection, productCode) : undefined;
  if (!collection || !product) return { title: "Piece not found" };
  return {
    title: product.name,
    description: `${product.name}, code ${product.code}, from the ${collection.name}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { collectionSlug, productCode } = await params;
  const collection = getCollection(collectionSlug);
  if (!collection) notFound();
  const product = getProduct(collection, productCode);
  if (!product) notFound();

  return (
    <main id="content" className="mx-auto w-full max-w-5xl pb-16">
      <div className="px-4 sm:px-6">
        <BackLink href={collectionPath(collection.slug)} label={collection.name} />
      </div>
      <ProductDetail
        slug={collection.slug}
        collectionName={collection.name}
        products={collection.products}
        product={product}
      />
    </main>
  );
}
