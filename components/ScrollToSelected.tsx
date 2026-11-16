"use client";

import { useEffect } from "react";

export function ScrollToSelected({ id }: { id: string }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  }, [id]);

  return null;
}
