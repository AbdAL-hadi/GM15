# THETIA redesign: handoff for the backend

The front end is done and reviewed. Everything that needs a server is mocked in the browser today. This page lists those parts.

## Run it

```bash
npm ci
npm run dev        # http://127.0.0.1:5173  (Arabic, RTL)
                   # http://127.0.0.1:5173/en  (English, LTR)
npm run typecheck && npm run lint && npm test
```

## Where the code is

All new work is in `src/thetia/`. `src/App.tsx` routes every page twice: once at `/` (Arabic) and once under `/en` (English).

| File | What it is |
| --- | --- |
| `catalog.ts` | Products, prices, notes, accords, English copy, sensory descriptions, brand contact details |
| `i18n.tsx` | Every UI string in Arabic and English, hand-written, plus note-name translations |
| `notePhotos.ts` | Ingredient photo per note (Wikimedia Commons) |
| `bag.tsx` | Cart and wishlist state |
| `Layout.tsx` | Header, footer, cart drawer, language switch |
| `Home.tsx`, `Shop.tsx`, `Product.tsx` | Main shopping pages |
| `Bottle3D.tsx` | 3D perfume bottle, roll-on oil and cream tube (Three.js) |
| `NotesWheel.tsx`, `Quiz.tsx` | Notes wheel and "help me choose" quiz |
| `Refill.tsx` | Refill bar: refill wall, make-your-own blend with a name, bottle refills, film placeholder |
| `Story.tsx`, `Contact.tsx`, `Account.tsx`, `Wishlist.tsx` | Content and account pages |

The older pages in `src/pages/` are no longer routed. The existing tests still cover them.

## What the backend needs to replace

| Area | Today | Needs |
| --- | --- | --- |
| Products and stock | Hard-coded in `catalog.ts`, read from thetia.shop on 2026-11-20. Images hotlink to thetia.shop | A products API (WooCommerce already holds the data), with images served from our own storage |
| Prices per size | Only price ranges are known. Per-size prices are estimates | Real prices per variant |
| Cart | `localStorage` key `thetia-bag`. Checkout is switched off | Cart and checkout API, payments |
| Custom blends | A bag line holds `title` (the customer's perfume name) and `detail` (e.g. "Jawa 70% · Cloud 30%"). There is a ₪10 blend fee | Store blend orders, confirm pricing |
| Refills | 30% off when the customer brings a bottle back (placeholder) | Real refill price rule |
| Refill wall stock levels | Demo numbers made from the product slug | Live stock per dispenser |
| Wishlist | `localStorage` key `thetia-wish` | Save per user |
| Account | Mock sign-in. Profile in `thetia-user` and addresses in `thetia-addresses`, all in `localStorage`. Passwords are never stored | Real auth, profile, addresses, order history |
| Contact form | Opens the customer's email app (`mailto:`) | Optional: a send-message endpoint |
| Instagram / TikTok | Placeholder links in `brand` in `catalog.ts` | THETIA's real handles |
| Behind-the-scenes film | Placeholder frame | The real video file |

## Before launch

- Note photos come from Wikimedia Commons and need attribution. Each entry in `notePhotos.ts` links to its source page, where the author and licence are listed. Download the images into `/public/notes` and add an image credits page.
- Product photos are hotlinked from thetia.shop. Copy them into our own storage.
- The Google Maps embed on the contact page needs no key.
