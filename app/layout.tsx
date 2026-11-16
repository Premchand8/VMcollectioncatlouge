import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PMJ Jewels",
    template: "%s · PMJ Jewels",
  },
  description:
    "Gajavali by PMJ Jewels — elephant motif earrings and pendants, with film, photographs and WhatsApp enquiry.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf8" },
    { media: "(prefers-color-scheme: dark)", color: "#06132d" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const stored = (await cookies()).get("pmj-theme")?.value;
  const theme = stored === "light" || stored === "dark" ? stored : undefined;

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme={theme}
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <footer className="mt-auto border-t border-line bg-surface">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:px-6">
            <p className="font-display text-2xl tracking-[0.04em] text-navy">
              PMJ Jewels
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Fine jewellery crafted for South India’s celebrations and everyday
              wear.
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-gold">
              Gajavali collection
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
