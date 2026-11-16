export function collectionPath(slug: string): string {
  return `/c/${encodeURIComponent(slug)}`;
}

export function galleryPath(slug: string, productCode?: string): string {
  const path = `/c/${encodeURIComponent(slug)}/products`;
  if (!productCode) return path;
  return `${path}?product=${encodeURIComponent(productCode)}`;
}

export function productPath(slug: string, productCode: string): string {
  return `/c/${encodeURIComponent(slug)}/products/${encodeURIComponent(productCode)}`;
}
