export function formatMetalWeight(grams: number): string {
  return `${Number(grams.toFixed(3))} g`;
}

export function formatCarats(carats: number): string {
  return `${Number(carats.toFixed(2))} ct`;
}

export function formatPurity(kt: number): string {
  return `${kt}K`;
}

export function formatDiamondLine(
  weightCt?: number,
  pieces?: number,
): string | null {
  if (typeof weightCt !== "number" && typeof pieces !== "number") return null;
  const parts: string[] = [];
  if (typeof weightCt === "number") parts.push(formatCarats(weightCt));
  if (typeof pieces === "number") {
    parts.push(`${pieces} ${pieces === 1 ? "pc" : "pcs"}`);
  }
  return parts.join(" · ");
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
}
