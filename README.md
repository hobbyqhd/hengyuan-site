# Hebei Hengyuan (亨源) static marketing site

Vite multi-page (MPA) with English (`/en/`) and Chinese (`/zh/`) entry points. Shared layout is generated from `content/fragments/` via `tools/stitch.mjs` so navigation and footers stay consistent.

Internationalization assessment (gaps, hreflang, encoding): [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md).

## Install

```bash
cd hengyuan-site
npm install
```

## Develop

```bash
npm run dev
```

Then open the URL Vite prints (defaults to `http://localhost:5173/`). Start from the language gateway at `/` or go directly to `/en/index.html` or `/zh/index.html`.

The `predev` / `prebuild` step writes generated HTML into `en/` and `zh/` (gitignored). Edit source fragments under `content/fragments/` or strings in `content/i18n/zh.json`, then re-run dev/build.

## Build

```bash
# Optional: set production origin for canonical + hreflang URLs in stitched HTML
export SITE_BASE_URL="https://your-domain.com"
npm run build
```

If `SITE_BASE_URL` is unset, pages default to `https://www.example.com` (replace before launch).

Output is written to `dist/`. The `prebuild` hook regenerates `/en` and `/zh` HTML from fragments.

## Preview production build

```bash
npm run preview
```

## Deploy to Cloudflare Workers (workers.dev)

After `npm run build`, deploy static assets from `dist/`:

```bash
npm run deploy
# or: npm run build && wrangler deploy
```

With worker name `hengyuan-site`, the default URL is **https://hengyuan-site.workers.dev** (requires `wrangler login` and a Workers account).

Set **`SITE_BASE_URL`** to that URL (or your custom domain) before build when you want correct `canonical` / `hreflang` links.

## Deploy to Cloudflare Pages (optional)


1. Push the **hengyuan-site** repository (GitHub: `hobbyqhd/hengyuan-site`) to GitHub/GitLab. In a monorepo, use only the `hengyuan-site/` folder on disk.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) ?? **Workers & Pages** ?? **Create** ?? **Pages** ?? **Connect to Git**.
3. Select the repository and set:
   - **Root directory** (if deploying from monorepo): `hengyuan-site`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Environment**: Node 20+ recommended (matches Vite 6). Add **`SITE_BASE_URL`** (e.g. `https://www.yourcompany.com`) so `canonical` and `hreflang` links are correct.
5. Deploy. Optional: add a **Custom domain** and enable **Always Use HTTPS**.

### SPA routing note

This site is static HTML with real paths (`/en/...`). No client-side router is required. Cloudflare Pages serves `*.html` paths as files; deep links work as long as URLs include `.html` or you add `_redirects` / `public/_routes.json` if you later switch to extensionless URLs.

## Editing content

- Page bodies: `content/fragments/en/**` and `content/fragments/zh/**`
- Chinese titles, meta descriptions, nav/footer labels: `content/i18n/zh.json` (UTF-8)
- English manifest + stitch logic: `tools/stitch.mjs`
- Styles / mobile menu: `src/styles/main.css`, `src/site.js`

After changing fragments or `stitch.mjs`, run `npm run dev` or `npm run build` (both invoke `predev` / `prebuild` stitching).
