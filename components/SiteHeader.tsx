"use client";

import type { MouseEvent } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@/components/icons";

const THEME_COOKIE = "pmj-theme";

function resolveTheme(): "light" | "dark" {
  const saved = document.documentElement.dataset.theme;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function persistTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function SiteHeader() {
  useEffect(() => {
    const stored = localStorage.getItem(THEME_COOKIE);
    if (stored !== "light" && stored !== "dark") return;
    if (document.documentElement.dataset.theme === stored) return;
    persistTheme(stored);
  }, []);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const next = resolveTheme() === "dark" ? "light" : "dark";
    persistTheme(next);
    localStorage.setItem(THEME_COOKIE, next);
    event.currentTarget.setAttribute(
      "aria-label",
      next === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/c/gajavali" className="group flex flex-col">
          <span className="font-display text-[1.65rem] leading-none tracking-[0.04em] text-navy">
            PMJ
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-[0.32em] text-gold">
            Jewels
          </span>
        </Link>
        <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted">
          Gajavali
        </p>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="inline-flex h-10 w-10 items-center justify-center text-navy transition-colors hover:text-gold"
        >
          <SunIcon className="theme-sun h-4 w-4" />
          <MoonIcon className="theme-moon h-4 w-4" />
        </button>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-fill/70 to-transparent" />
    </header>
  );
}
