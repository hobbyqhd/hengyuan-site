import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const fragRoot = path.join(root, 'content', 'fragments')

const zhData = JSON.parse(
  fs.readFileSync(path.join(root, 'content', 'i18n', 'zh.json'), 'utf8'),
)

const BRAND_EN = { name: 'Hebei Hengyuan Industrial', sub: 'Co., Ltd.' }

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
  {
    lang: 'en',
    out: 'index.html',
    title: 'Plastic-Coated Steel Pipe Manufacturer | 3PE/TPEP Anti-Corrosion Pipes — Hebei Hengyuan',
    desc: 'Hebei Hengyuan Industrial is a national high-tech enterprise manufacturing plastic-coated steel pipes, 3PE/TPEP anti-corrosion pipes, galvanized pipes & fittings (DN15-DN2200) for 60+ countries.',
    nav: 'home',
  },
  {
    lang: 'en',
    out: 'solutions/oil-gas.html',
    title: 'Oil & gas pipeline solutions — Hebei Hengyuan',
    desc: 'Plastic-coated, 3PE/TPEP and galvanized line pipe and fittings for gathering, transmission and gas distribution — coatings and MTRs per your ITP.',
    nav: 'sol-oil',
  },
  {
    lang: 'en',
    out: 'solutions/water-infrastructure.html',
    title: 'Water & infrastructure piping — Hebei Hengyuan',
    desc: 'Potable-water-grade plastic coating, internal and external anti-corrosion systems, and large-diameter water transmission options discussed against project hygiene codes.',
    nav: 'sol-water',
  },
  {
    lang: 'en',
    out: 'solutions/industrial-power.html',
    title: 'Industrial & energy piping — Hebei Hengyuan',
    desc: 'Coated and lined steel pipe packages for process plants, power and general industry, aligned with service conditions and inspection regimes you provide.',
    nav: 'sol-ind',
  },
  {
    lang: 'en',
    out: 'coatings/3lpe-3lpp.html',
    title: '3PE / multi-layer polyolefin external coatings — Hebei Hengyuan',
    desc: 'External layered polyolefin systems commonly used for buried and immersed steel pipe — layer build and thickness per project specification.',
    nav: 'coat-3lpe',
  },
  {
    lang: 'en',
    out: 'coatings/fbe.html',
    title: 'Fusion-bonded epoxy (FBE) — Hebei Hengyuan',
    desc: 'Single- and dual-layer FBE and related fusion-bonded epoxy systems for internal and external corrosion protection where epoxy is specified.',
    nav: 'coat-fbe',
  },
  {
    lang: 'en',
    out: 'coatings/coal-tar-enamel.html',
    title: 'Epoxy coal tar enamel & bituminous systems — Hebei Hengyuan',
    desc: 'Coal-tar enamel and epoxy coal tar systems when legacy owner standards or specifications still reference them, subject to regional HSE rules.',
    nav: 'coat-cte',
  },
  {
    lang: 'en',
    out: 'products.html',
    title: 'Products: Plastic-Coated, 3PE, TPEP, Galvanized Steel Pipes & Fittings — Hebei Hengyuan',
    desc: 'Full product range: plastic-coated steel pipes, 3PE/TPEP anti-corrosion pipes, galvanized pipes, fire-fighting pipes, cable conduits and matching fittings. DN15-DN2200, customizable color & joints.',
    nav: 'products',
  },
  {
    lang: 'en',
    out: 'manufacturing.html',
    title: 'Manufacturing & quality assurance — Hebei Hengyuan',
    desc: 'Production flow, key inspection equipment and batch-release mindset — ISO9001 / CE / SGS framing; detailed hold points follow contract and ITP.',
    nav: 'mfg',
  },
  {
    lang: 'en',
    out: 'compliance.html',
    title: 'Standards & certifications — Hebei Hengyuan Industrial',
    desc: 'ISO 9001:2015, ISO 14001, ISO 45001, mining safety mark, water-related product license, high-tech enterprise, AAA credit and contract-honoring credentials; GB/industry/international standards summary aligned with the corporate quality page.',
    nav: 'compliance',
  },
  {
    lang: 'en',
    out: 'projects.html',
    title: 'Case studies — water, fire & gas projects — Hebei Hengyuan',
    desc: 'Hengyuan plastic-coated and 3PE/TPEP pipes in municipal water, fire protection, gas distribution, mining drainage and cable protection — representative scopes.',
    nav: 'projects',
  },
  {
    lang: 'en',
    out: 'resources/coating-comparison.html',
    title: 'Coating comparison (overview) — Hebei Hengyuan',
    desc: 'High-level strengths and caveats for 3LPE/3LPP, FBE and coal tar enamel — defer to project NACE/ISO and owner standards.',
    nav: 'res',
  },
  {
    lang: 'en',
    out: 'rfq.html',
    title: 'Request a quote — Hebei Hengyuan Industrial Co., Ltd.',
    desc: 'Structured RFQ routed by email — include line items, standards, quantities and required inspection regime.',
    nav: 'rfq',
  },
  {
    lang: 'en',
    out: 'contact.html',
    title: 'Contact Hebei Hengyuan — plastic-coated steel pipe quotes & technical support',
    desc: 'Contact Hebei Hengyuan Industrial 24/7 for plastic-coated steel pipe quotes, 3PE/TPEP technical consultation, custom orders and samples. Tel +86-189-3171-0082, Yanshan Industrial Park, Hebei.',
    nav: 'contact',
  },
  {
    lang: 'en',
    out: 'privacy.html',
    title: 'Privacy notice — Hebei Hengyuan',
    desc: 'Minimal privacy statement for this static marketing site.',
    nav: 'privacy',
  },
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
  const caret = '<span class="nav-caret" aria-hidden="true">\u25be</span>'
  const dropBtn = (label, ddId) =>
    `<button type="button" aria-expanded="false" aria-controls="${ddId}" aria-haspopup="true"><span class="nav-label">${label}</span>${caret}</button>`
  const brandAlt =
    lang === 'en' ? 'Hebei Hengyuan Industrial Co., Ltd.' : '河北亨源实业有限公司'

  return `
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="${p}/index.html">
        <img class="brand-logo" src="/images/hy/logo.jpg" width="372" height="122" alt="${brandAlt}" fetchpriority="high" loading="eager" />
        <span class="brand-text">
          <strong>${B.name}</strong>
          <span class="brand-sub">${B.sub}</span>
        </span>
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="nav-panel" id="site-nav" data-nav-panel aria-label="Primary">
        ${n('/index.html', 'home', L.home)}

        <div class="nav-group">
          ${dropBtn(L.solutions, 'nav-dd-solutions')}
          <div class="nav-dropdown" id="nav-dd-solutions" role="group">
            ${n('/solutions/oil-gas.html', 'sol-oil', L.solOil)}
            ${n('/solutions/water-infrastructure.html', 'sol-water', L.solWater)}
            ${n('/solutions/industrial-power.html', 'sol-ind', L.solInd)}
          </div>
        </div>

        <div class="nav-group">
          ${dropBtn(L.coatings, 'nav-dd-coatings')}
          <div class="nav-dropdown" id="nav-dd-coatings" role="group">
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
          ${dropBtn(L.resources, 'nav-dd-resources')}
          <div class="nav-dropdown" id="nav-dd-resources" role="group">
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
          tagline:
            'Plastic-coated, 3PE/TPEP anti-corrosion and galvanized steel pipe and fittings — DN15–DN2200 for municipal, fire, gas and export projects.',
          line1:
            'Hebei Hengyuan Industrial Co., Ltd. — pipeline anti-corrosion and plastic-coated steel pipe manufacturing and supply.',
          line2: 'Site imagery is drawn from company assets; technical data is governed by datasheets, contracts and third-party inspection.',
          line3:
            'Summary tables are non-binding; invoked standards, owner specifications and inspection plans take precedence.',
          copy: `\u00a9 ${year} Hebei Hengyuan Industrial Co., Ltd. All rights reserved.`,
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
