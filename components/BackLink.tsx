import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-navy"
    >
      <ChevronLeftIcon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
