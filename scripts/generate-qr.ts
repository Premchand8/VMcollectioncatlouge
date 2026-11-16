import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

type CollectionRecord = {
  slug: string;
};

function loadEnvFile(filename: string) {
  let text = "";
  try {
    text = readFileSync(path.join(process.cwd(), filename), "utf8");
  } catch {
    return;
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const base = (process.env.CATALOG_BASE_URL ?? "https://YOUR-DOMAIN").replace(
    /\/$/,
    "",
  );
  if (base.includes("YOUR-DOMAIN")) {
    console.warn(
      "CATALOG_BASE_URL is still the placeholder. Set the public domain in .env.local before you print the codes.",
    );
  }

  const collections = JSON.parse(
    readFileSync(new URL("../data/collections.json", import.meta.url), "utf8"),
  ) as CollectionRecord[];

  const outDir = path.join(process.cwd(), "public", "qr");
  await mkdir(outDir, { recursive: true });

  for (const collection of collections) {
    const url = `${base}/c/${collection.slug}`;
    const file = path.join(outDir, `${collection.slug}.png`);
    await QRCode.toFile(file, url, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1c1915",
        light: "#ffffff",
      },
    });
    console.log(`${path.relative(process.cwd(), file)} -> ${url}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
