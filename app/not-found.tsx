import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex w-full max-w-3xl flex-col px-4 py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">PMJ Jewels</p>
      <h1 className="mt-3 font-display text-5xl leading-none">Page not found</h1>
      <p className="mt-4 max-w-sm text-muted">
        This page is not part of the Gajavali catalogue.
      </p>
      <Link
        href="/c/gajavali"
        className="mt-8 inline-flex h-12 items-center justify-center border border-line px-5 text-sm"
      >
        Back to Gajavali
      </Link>
    </main>
  );
}
