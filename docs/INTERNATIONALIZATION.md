# Internationalization (i18n) assessment ¡ª Hongkehua static site

## What is already suitable for global buyers

- **English-first paths** under `/en/` with procurement-oriented copy (RFQ, compliance types, coating systems, anonymous projects).
- **Professional tone**: specification-first language, disclaimers on technical tables, no fake certificate images.
- **Structured RFQ** fields aligned with international line-list practice (standards, coating, dimensions, Incoterms placeholder path via free text).
- **SEO hooks**: each stitched page exposes `<link rel="alternate" hreflang="en">`, `hreflang="zh-CN"`, and `hreflang="x-default"` (points to English). Replace the default canonical host with `SITE_BASE_URL` at build time (see README).
- **Visual language**: neutral industrial UI, system/Helvetica-class stack, responsive layout for field engineers on phones.

## Gaps before a serious overseas launch

| Gap | Risk | Mitigation |
| --- | --- | --- |
| **Only EN + ZH** | Middle East / SEA buyers may prefer Arabic, Indonesian, or others | Add languages or link to PDF datasheets in English only with a clear note. |
| **Canonical host is example.com** | Search engines merge signals incorrectly | Set `SITE_BASE_URL` to production origin in CI / Pages env. |
| **mailto RFQ** | Unreliable vs hosted forms | Formspree, Getform, or Cloudflare Worker + Resend. |
| **Units** | mm vs inch confusion | Add explicit unit toggles or dual columns in RFQ v2. |
| **Legal pages** | GDPR / cookie consent if analytics | Replace `privacy.html` with counsel-approved text; gate analytics. |
| **Incoterms / payment** | Buyers expect clarity | Add a short "Commercial terms (draft)" page after legal review. |
| **Cert claims** | Over-claim vs actual scope | Keep "types only" until scans are approved; align with ISO certificate scope text. |

## Encoding lesson (fixed)

English fragments had **legacy GBK byte pairs** (`0xA1 0xAF`, `0xA1 0xFA`, `0xA1 0xC1`) where UTF-8 punctuation was intended, which rendered as mojibake in UTF-8. **Rule:** keep `content/fragments/en/**/*.html` as **UTF-8** and prefer ASCII `'` and HTML entities (`&rarr;`) for punctuation in English-only files to avoid editor/codepage mishandling.

Chinese copy lives in UTF-8 `content/i18n/zh.json` and `content/fragments/zh/**` ¡ª verify editors save as UTF-8 without BOM issues.

## Content parity

EN and ZH **product** pages are now expanded in parallel from the same Baidu Baike taxonomy. Minor wording differences are intentional (e.g., UL/FM disclaimer emphasized in ZH). Keep both languages updated together when facts change.
