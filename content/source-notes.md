# Source notes — claim provenance

This file maps on-site statements to **public hy-main / hypipelines** messaging versus items that require **client confirmation**. It supports legal/marketing review; it is not a warranty document.

| Topic | Site handling | Provenance |
| --- | --- | --- |
| Legal entity Chinese name | 「河北亨源实业有限公司」 | hy-main structured data / site — **client to confirm** exact license wording |
| English branding | "Hebei Hengyuan Industrial Co., Ltd." (`legalName` in JSON-LD) | hy-main — **client to confirm** registered English name if different |
| Founded **2005** | About teaser + counters aligned to hy-main | JSON-LD `foundingDate` — verify against business license |
| Location **Cangzhou / Yanshan, Hebei** | Contact + JSON-LD `PostalAddress` | hy-main — **client to confirm** bilingual address block for contracts |
| Product mix (product page) | Four families aligned to hy-main index cards | hy-main public pages — catalogs, grades, schedules **client to confirm** |
| ISO 9001 / CE / SGS | Compliance + manufacturing copy | hy-main about/quality tone — certificate scope **client to confirm** |
| Drinking-water hygiene / safety permit (涉水) | Compliance + water solution pages (types) | Generic types — number, product coverage **client to confirm** |
| Special equipment manufacturing license (特种设备制造许可) | Compliance (types) | Generic types — class & limits **client to confirm** |
| National high-tech enterprise, export scope | Home trust strip / hero | hy-main index meta — **client/legal review** before hard claims in regulated markets |
| Employee count, revenue, ranking | **Not used** on this template | Omitted by design |
| Technical comparison table | Non-binding engineering summary | Industry common knowledge + **client to confirm** project-specific selections |
| Factory / product photos | `/images/hy/...` copied from hy-main scan | Company asset paths from hy-main repo — **client to confirm** reuse rights for this static site |
| Email `sales@hypipelines.com` | RFQ + contact | hy-main JSON-LD |
| Phone +86-189-3171-0082 | Contact | hy-main JSON-LD / contact page |
| WhatsApp / other IM | **Not listed** | **Client to supply** if needed |
| Anonymous project cards on projects.html | Legacy template | Replace with approved references when allowed; home index now cites named hy-main case studies |

## Encoding / English fragments

- **Fix:** `content/fragments/en/**/*.html` contained mis-encoded bytes (`A1 AF`, `A1 FA`, `A1 C1`) from a legacy editor codepage issue. Replaced with ASCII apostrophe, HTML `&rarr;`, and ASCII `x` (for dimensions). Keep EN fragments saved as **UTF-8**, or restrict to ASCII plus HTML entities.

## hreflang / canonical

- Stitched pages include `<link rel="canonical">` and `hreflang` alternates. Default base URL is `https://www.example.com` until `SITE_BASE_URL` is set at build time — see [docs/INTERNATIONALIZATION.md](../docs/INTERNATIONALIZATION.md).

## Maintenance

- When public web copy and the business license disagree, **the license wins**.
- Before publishing certificate thumbnails, obtain **compliance sign-off** and control distribution (extranet, not necessarily public web).
