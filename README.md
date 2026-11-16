# PMJ Jewels · Gajavali catalogue

Shoppers scan one QR on the printed creative and open the **Gajavali** collection.

## Flow

1. QR / home → `/c/gajavali` — collection film banner, then the ten pieces
2. Tap a piece → three angles, film, metal and stone notes
3. **Enquire on WhatsApp** → PMJ number from `.env.local`

## Run

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000/c/gajavali](http://localhost:3000/c/gajavali). Visiting `/` also redirects there.

Typography matches pmjjewels.com: **Quarto** for headings, **Gotham** for body (`public/fonts`).

## QR

```bash
# .env.local
CATALOG_BASE_URL=https://catalogue.example.com
npm run qr
```

Writes `public/qr/gajavali.png` → `https://catalogue.example.com/c/gajavali`.

## Customer product details

Only shopper-facing fields are shown on the piece page:

| Excel | Shown as | JSON |
| --- | --- | --- |
| CATG | Category | `category` |
| CLASIFICATION | Type | `classification` |
| metal + PURITY | Metal | `metal`, `purityKt` |
| METAL_WT | Gold weight | `metalWeightG` |
| DIA_WT + DIA_PCS | Diamond | `diamondWeightCt`, `diamondPieces` |
| CLS_WT + CLS_PCS | Colour stone | `colorStoneWeightCt`, `colorStonePieces` |
| WEIGHT | Total weight | `totalWeightG` |
| MAIN_STOCK_CODE | Stock code | `code` |

Hidden from the shopper: VARIANT, PRODTYPE, SUBCATEGORY, PIECES, CNT, Dia Gold codes, etc.
