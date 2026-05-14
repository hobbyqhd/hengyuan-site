# Source notes — claim provenance

This file maps on-site statements to **Baidu Baike (百科)** public-profile style facts versus items that require **client confirmation**. It supports legal/marketing review; it is not a warranty document.

| Topic | Site handling | Provenance |
| --- | --- | --- |
| Legal entity Chinese name | 「宏科华管道装备制造有限公司」 | Baike company name — **client to confirm** exact legal name on license |
| English branding | "Hongkehua Pipeline Equipment Co., Ltd." | Working translation for web — **client to confirm** official English name if registered |
| Founded **2018** | Stated on home + trust strip | Baike "成立时间" style fact — verify against business license |
| Location **Cangzhou / Yanshan, Hebei** | High-level geography only | Baike address-style fact — **client to confirm** full registered address, postal code, and any export office |
| Product mix (expanded product page sections) | Products page + coatings | Baike product lists — catalogs, grades, schedules **client to confirm** |
| ISO 9001 / 14001 / 45001 | Compliance types only, no images | Baike mentions — certificate scope, expiry, accreditation body **client to confirm** |
| Drinking-water hygiene / safety permit (涉水) | Compliance + water solution pages (types) | Baike mention — number, product coverage **client to confirm** |
| Special equipment manufacturing license (特种设备制造许可) | Compliance (types) | Baike mention — class & limits **client to confirm** |
| "Three major oil suppliers network" (三桶油供应商网络) | Soft, qualified wording on EN/ZH oil-gas pages | Baike narrative — **client/legal review** before hard claims |
| Employee count, revenue, ranking | **Not used** on this template | Baike sometimes lists such stats — omitted by design as potentially dated/controversial |
| Technical comparison table | Non-binding engineering summary | Industry common knowledge + **client to confirm** project-specific selections |
| Factory photos | Stock images (Pexels/Unsplash) | **Illustrative only** until client provides audited photography |
| Email `sales-placeholder@hongkehua.example` | RFQ + contact | **Placeholder** — replace before production |
| WhatsApp / phone / hours | Placeholders | **Client to supply** |
| Anonymous project cards | Fictionalized patterns | **Not** mapped to Baike; replace with approved references when allowed |

## Encoding / English fragments

- **Fix:** `content/fragments/en/**/*.html` contained mis-encoded bytes (`A1 AF`, `A1 FA`, `A1 C1`) from a legacy editor codepage issue. Replaced with ASCII apostrophe, HTML `&rarr;`, and ASCII `x` (for dimensions). Keep EN fragments saved as **UTF-8**, or restrict to ASCII plus HTML entities.

## hreflang / canonical

- Stitched pages include `<link rel="canonical">` and `hreflang` alternates. Default base URL is `https://www.example.com` until `SITE_BASE_URL` is set at build time — see [docs/INTERNATIONALIZATION.md](../docs/INTERNATIONALIZATION.md).

## Maintenance

- When Baike and the business license disagree, **the license wins**.
- Before publishing certificate thumbnails, obtain **compliance sign-off** and control distribution (extranet, not necessarily public web).
