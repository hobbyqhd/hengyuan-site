import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const fragRoot = path.join(root, 'content', 'fragments')

const zhData = JSON.parse(
  fs.readFileSync(path.join(root, 'content', 'i18n', 'zh.json'), 'utf8'),
)

const BRAND_EN = { name: 'Hongkehua', sub: 'Pipeline Equipment Co., Ltd.' }

const LABELS_EN = {
  home: 'Home',
  solutions: 'Solutions',
  coatings: 'Coatings',
  products: 'Products',
  manufacturing: 'Manufacturing',
  compliance: 'Compliance',
  projects: 'Projects',
  resources: 'Resources',
  rfq: 'RFQ',
  contact: 'Contact',
  privacy: 'Privacy',
  footerCompany: 'Company',
  footerLegal: 'Legal',
  solOil: 'Oil & gas',
  solWater: 'Water & infrastructure',
  solInd: 'Industrial & power',
  coat3: '3LPE / 3LPP',
  coatFbe: 'FBE',
  coatCte: 'Coal tar enamel',
  resComp: 'Coating comparison',
  lang: '\u4e2d\u6587',
  langHref: '/zh/index.html',
}

/** @typedef {{ lang: 'en'|'zh', out: string, title: string, desc: string, nav: string }} PageDef */

const EN_MANIFEST = /** @type {PageDef[]} */ ([
  { lang: 'en', out: 'index.html', title: 'Hongkehua Pipeline Equipment', desc: 'Anti-corrosion coated steel pipe, fittings, and pipeline solutions for oil & gas, water, and industrial projects.', nav: 'home' },
  { lang: 'en', out: 'solutions/oil-gas.html', title: 'Oil & gas pipeline solutions | Hongkehua', desc: 'Coated line pipe and fittings for hydrocarbon transport and gathering systems.', nav: 'sol-oil' },
  { lang: 'en', out: 'solutions/water-infrastructure.html', title: 'Water & infrastructure | Hongkehua', desc: 'Drinking-water-grade coatings, distribution mains, and civil infrastructure pipe systems.', nav: 'sol-water' },
  { lang: 'en', out: 'solutions/industrial-power.html', title: 'Industrial & power piping | Hongkehua', desc: 'Protective coatings and pipe packages for process plants, power generation, and general industry.', nav: 'sol-ind' },
  { lang: 'en', out: 'coatings/3lpe-3lpp.html', title: '3LPE / 3LPP external coatings | Hongkehua', desc: 'Multi-layer polyolefin external anti-corrosion systems for buried and immersed pipelines.', nav: 'coat-3lpe' },
  { lang: 'en', out: 'coatings/fbe.html', title: 'Fusion-bonded epoxy (FBE) | Hongkehua', desc: 'Single-layer and dual-layer FBE systems for internal and external corrosion protection.', nav: 'coat-fbe' },
  { lang: 'en', out: 'coatings/coal-tar-enamel.html', title: 'Epoxy coal tar enamel (CTE) | Hongkehua', desc: 'Traditional bituminous enamel systems where project specifications require them.', nav: 'coat-cte' },
  { lang: 'en', out: 'products.html', title: 'Products overview | Hongkehua', desc: 'Six product families from public Baike scope: plastic-coated, anti-corrosion, insulation, cable conduit, fittings, and base steel pipe (illustrative photos).', nav: 'products' },
  { lang: 'en', out: 'manufacturing.html', title: 'Manufacturing & QA | Hongkehua', desc: 'Production workflow, inspection mindset, and documentation for coated pipe programs.', nav: 'mfg' },
  { lang: 'en', out: 'compliance.html', title: 'Compliance & certifications | Hongkehua', desc: 'ISO, environmental, occupational health & safety, drinking water, and special equipment licensing - types and placeholders.', nav: 'compliance' },
  { lang: 'en', out: 'projects.html', title: 'Selected projects | Hongkehua', desc: 'Anonymous case studies illustrating typical scopes for coated pipe supply.', nav: 'projects' },
  { lang: 'en', out: 'resources/coating-comparison.html', title: 'Coating comparison (overview) | Hongkehua', desc: 'High-level comparison of 3LPE/3LPP, FBE, and coal tar enamel for engineers and buyers.', nav: 'res' },
  { lang: 'en', out: 'rfq.html', title: 'Request a quote | Hongkehua', desc: 'Structured RFQ form routed via email (mailto). Replace placeholders with production contacts.', nav: 'rfq' },
  { lang: 'en', out: 'contact.html', title: 'Contact | Hongkehua', desc: 'Office location (public record), channels, and business hours placeholder.', nav: 'contact' },
  { lang: 'en', out: 'privacy.html', title: 'Privacy notice | Hongkehua', desc: 'Minimal placeholder privacy statement for the static marketing site.', nav: 'privacy' },
])

const ZH_MANIFEST = zhData.pages.map((p) => ({
  lang: /** @type {'zh'} */ ('zh'),
  out: p.out,
  title: p.title,
  desc: p.desc,
  nav: p.nav,
}))

const MANIFEST = [...EN_MANIFEST, ...ZH_MANIFEST]

function navClass(nav, key) {
  return nav === key ? ' class="is-active"' : ''
}

function buildNav(lang, active) {
  const L = lang === 'en' ? LABELS_EN : zhData.labels
  const B = lang === 'en' ? BRAND_EN : zhData.brand
  const p = lang === 'en' ? '/en' : '/zh'
  const n = (href, key, label) => `<a href="${p}${href}"${navClass(active, key)}>${label}</a>`
  const caret = ' \u25be'

  return `
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="${p}/index.html">
        <strong>${B.name}</strong>
        <span>${B.sub}</span>
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="nav-panel" id="site-nav" data-nav-panel aria-label="Primary">
        ${n('/index.html', 'home', L.home)}

        <div class="nav-group">
          <button type="button">${L.solutions}${caret}</button>
          <div class="dropdown">
            ${n('/solutions/oil-gas.html', 'sol-oil', L.solOil)}
            ${n('/solutions/water-infrastructure.html', 'sol-water', L.solWater)}
            ${n('/solutions/industrial-power.html', 'sol-ind', L.solInd)}
          </div>
        </div>

        <div class="nav-group">
          <button type="button">${L.coatings}${caret}</button>
          <div class="dropdown">
            ${n('/coatings/3lpe-3lpp.html', 'coat-3lpe', L.coat3)}
            ${n('/coatings/fbe.html', 'coat-fbe', L.coatFbe)}
            ${n('/coatings/coal-tar-enamel.html', 'coat-cte', L.coatCte)}
          </div>
        </div>

        ${n('/products.html', 'products', L.products)}
        ${n('/manufacturing.html', 'mfg', L.manufacturing)}
        ${n('/compliance.html', 'compliance', L.compliance)}
        ${n('/projects.html', 'projects', L.projects)}

        <div class="nav-group">
          <button type="button">${L.resources}${caret}</button>
          <div class="dropdown">
            ${n('/resources/coating-comparison.html', 'res', L.resComp)}
          </div>
        </div>

        ${n('/rfq.html', 'rfq', L.rfq)}
        ${n('/contact.html', 'contact', L.contact)}

        <span class="lang-switch"><a href="${L.langHref}">${L.lang}</a></span>
      </nav>
    </div>
  </header>`
}

function buildFooter(lang) {
  const L = lang === 'en' ? LABELS_EN : zhData.labels
  const B = lang === 'en' ? BRAND_EN : zhData.brand
  const p = lang === 'en' ? '/en' : '/zh'
  const year = new Date().getFullYear()
  const t =
    lang === 'en'
      ? {
          tagline: 'Anti-corrosion steel pipe, fittings, and engineered pipeline packages.',
          line1:
            'Hongkehua Pipeline Equipment Co., Ltd. - anti-corrosion steel pipe, fittings, and pipeline packages.',
          line2: 'Images are illustrative stock photography until factory photography is provided.',
          line3:
            'Technical tables are summary guidance only; project specs, standards, and third-party inspection govern.',
          copy: `\u00a9 ${year} Hongkehua Pipeline Equipment Co., Ltd. All rights reserved.`,
        }
      : { ...zhData.footer }

  const fl = (href, label) => `<li><a href="${p}${href}">${label}</a></li>`

  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-main">
        <div class="footer-brand-col">
          <a class="footer-brand" href="${p}/index.html">
            <strong>${B.name}</strong>
            <span>${B.sub}</span>
          </a>
          <p class="footer-tagline">${t.tagline}</p>
          <p class="footer-line1">${t.line1}</p>
        </div>
        <nav class="footer-nav-grid" aria-label="Footer">
          <div class="footer-col">
            <p class="footer-col-title">${L.solutions}</p>
            <ul class="footer-links">
              ${fl('/solutions/oil-gas.html', L.solOil)}
              ${fl('/solutions/water-infrastructure.html', L.solWater)}
              ${fl('/solutions/industrial-power.html', L.solInd)}
            </ul>
            <p class="footer-col-title footer-col-title--sub">${L.coatings}</p>
            <ul class="footer-links">
              ${fl('/coatings/3lpe-3lpp.html', L.coat3)}
              ${fl('/coatings/fbe.html', L.coatFbe)}
              ${fl('/coatings/coal-tar-enamel.html', L.coatCte)}
            </ul>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">${L.footerCompany}</p>
            <ul class="footer-links">
              ${fl('/index.html', L.home)}
              ${fl('/products.html', L.products)}
              ${fl('/manufacturing.html', L.manufacturing)}
              ${fl('/compliance.html', L.compliance)}
              ${fl('/projects.html', L.projects)}
              ${fl('/resources/coating-comparison.html', L.resComp)}
              ${fl('/rfq.html', L.rfq)}
              ${fl('/contact.html', L.contact)}
            </ul>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">${L.footerLegal}</p>
            <ul class="footer-links">
              ${fl('/privacy.html', L.privacy)}
            </ul>
          </div>
        </nav>
      </div>
      <div class="footer-disclaimer">
        <p class="fine">${t.line2}</p>
        <p class="fine">${t.line3}</p>
        <p class="fine footer-copy">${t.copy}</p>
      </div>
    </div>
  </footer>`
}

const SITE_BASE = (process.env.SITE_BASE_URL || 'https://www.example.com').replace(/\/$/, '')

function layout({ lang, title, description, nav, body, out }) {
  const navHtml = buildNav(lang, nav)
  const footerHtml = buildFooter(lang)
  const canonical = `${SITE_BASE}/${lang}/${out.replace(/^\//, '')}`
  const enAlt = `${SITE_BASE}/en/${out}`
  const zhAlt = `${SITE_BASE}/zh/${out}`
  return `<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : 'zh-CN'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${enAlt}" />
  <link rel="alternate" hreflang="zh-CN" href="${zhAlt}" />
  <link rel="alternate" hreflang="x-default" href="${enAlt}" />
  <script type="module" src="/src/site.js"></script>
</head>
<body>
  ${navHtml}
  <main>
    ${body}
  </main>
  ${footerHtml}
</body>
</html>`
}

function readFragment(lang, outRel) {
  const fragPath = path.join(fragRoot, lang, outRel)
  if (!fs.existsSync(fragPath)) {
    throw new Error(`Missing fragment: ${fragPath}`)
  }
  return fs.readFileSync(fragPath, 'utf8')
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

for (const page of MANIFEST) {
  const body = readFragment(page.lang, page.out)
  const html = layout({
    lang: page.lang,
    title: page.title,
    description: page.desc,
    nav: page.nav,
    body,
    out: page.out,
  })
  const outAbs = path.join(root, page.lang, page.out)
  ensureDir(outAbs)
  fs.writeFileSync(outAbs, html, 'utf8')
}

console.log(`Stitched ${MANIFEST.length} pages into /en and /zh`)
