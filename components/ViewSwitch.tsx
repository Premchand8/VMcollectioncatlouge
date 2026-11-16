import Link from "next/link";
import { collectionPath, galleryPath } from "@/lib/paths";

export function ViewSwitch({
  slug,
  active,
}: {
  slug: string;
  active: "film" | "gallery";
}) {
  const filmHref = collectionPath(slug);
  const galleryHref = galleryPath(slug);

  return (
    <nav
      aria-label="Switch between the film and the gallery"
      className="sticky top-14 z-30 -mx-4 mb-5 border-b border-line bg-background/95 px-4 backdrop-blur"
    >
      <div className="grid grid-cols-2">
        <Link
          href={filmHref}
          prefetch={true}
          aria-current={active === "film" ? "page" : undefined}
          className={`flex h-11 items-center justify-center text-xs uppercase tracking-[0.18em] ${
            active === "film"
              ? "border-b-2 border-gold text-foreground"
              : "text-muted"
          }`}
        >
          Film
        </Link>
        <Link
          href={galleryHref}
          prefetch={true}
          aria-current={active === "gallery" ? "page" : undefined}
          className={`flex h-11 items-center justify-center text-xs uppercase tracking-[0.18em] ${
            active === "gallery"
              ? "border-b-2 border-gold text-foreground"
              : "text-muted"
          }`}
        >
          Gallery
        </Link>
      </div>
    </nav>
  );
}
