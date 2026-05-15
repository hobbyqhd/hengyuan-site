#!/usr/bin/env node
/**
 * Prepare hy-main product JSON for the static site.
 *
 * CI without hy-main: if committed `public/data/products-*.json` already contain a
 * real catalog, those files are left unchanged and SEO is refreshed from them.
 * Otherwise writes minimal placeholder JSON so `npm run build` still succeeds.
 * Regenerate from source with HY_MAIN_ROOT or a sibling hy-main checkout.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const hyMainRoot = path.resolve(
  process.env.HY_MAIN_ROOT || path.join(siteRoot, '..', 'hy-main'),
)

const OUT_ZH = path.join(siteRoot, 'public', 'data', 'products-zh.json')
const OUT_EN = path.join(siteRoot, 'public', 'data', 'products-en.json')
const OUT_FAMILY = path.join(siteRoot, 'public', 'data', 'product-family-map.json')
const MISSING_REPORT = path.join(siteRoot, 'tools', 'hy-products-image-missing.txt')
const FRAG_ZH = path.join(siteRoot, 'content', 'fragments', 'zh', 'products.html')
const FRAG_EN = path.join(siteRoot, 'content', 'fragments', 'en', 'products.html')

const SEO_BLOCK_RE =
  /(<!--\s*SEO_CATALOG_START\s*-->)[\s\S]*?(<!--\s*SEO_CATALOG_END\s*-->)/
/** Skip tiny/invalid files when deciding whether committed JSON is usable. */
const MIN_CATALOG_FILE_BYTES = 128

const PLACEHOLDER = {
  metadata: {
    placeholder: true,
    totalProducts: 0,
    totalCategories: 0,
    lastUpdated: null,
    note:
      'hy-main not found; set HY_MAIN_ROOT or place hy-main next to this repo to regenerate product JSON.',
  },
  categories: [],
  products: [],
  familyByCategoryId: {},
}

/** @param {string | null | undefined} p */
function rewriteImagePath(p) {
  if (!p || typeof p !== 'string') return p
  const t = p.trim()
  if (!t.startsWith('/images/')) return p
  if (t.startsWith('/images/hy/')) return t
  return `/images/hy/${t.slice('/images/'.length)}`
}

/** Deep clone and rewrite every `image` string. */
function rewriteImagesDeep(value) {
  if (Array.isArray(value)) return value.map((v) => rewriteImagesDeep(v))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'image' && typeof v === 'string') out[k] = rewriteImagePath(v)
      else out[k] = rewriteImagesDeep(v)
    }
    return out
  }
  return value
}

/** Collect string values of key `image` after rewrite. */
function collectImagePaths(value, acc) {
  if (Array.isArray(value)) {
    value.forEach((v) => collectImagePaths(v, acc))
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'image' && typeof v === 'string') acc.add(v)
      else collectImagePaths(v, acc)
    }
  }
}

const RE_FITTINGS =
  /\u5f2f\u5934|\u652f\u540a\u67b6|wantou|pipe support|supports|\belbows?\b/i
const RE_ANTI =
  /3PE|TPEP|\u5185EP\u5916PE|\u5185\s*EP\s*\u5916\s*PE|EP\u5916PE|\u52a0\u5f3a\u7ea7.*\u9632\u8150|Anti[- ]corrosion|anti[- ]corrosion|Spigot.*TPEP|socket.*TPEP/i
const RE_FANG = /\u9632\u8150/
const RE_TUSU = /\u6d82\u5851/
const RE_PLASTIC =
  /\u6d82\u5851|\u7ed9\u6c34|\u6d88\u9632|\u71c3\u6c14|\u6c9f\u69fd|\u6cd5\u5170|\u627f\u63d2\u53e3\u6d82|\u5361\u7bf8|\u4e1d\u6263|\u53cc\u91d1\u5c5e|\u9540\u950c\u5185|\u5f69\u8272\u53cc\u6297|CDU|\u73af\u6c27\u6811\u8102\u6d82|Coated|Grooved|Threaded|Mining|Fire protection|Water supply|\bGas\b|Clamp|Spigot.*[Cc]oated|Bimetallic|Galvanized.*Internal|Epoxy.*[Cc]oated|Composite.*[Cc]oated|dual[- ]resistance|Quick[- ]Connector/i

/**
 * Map category display name -> product family (sidebar checkboxes).
 * @param {string} name
 */
function classifyCategoryFamily(name) {
  if (!name || typeof name !== 'string') return 'anti-corrosion'
  const n = name
  if (RE_FITTINGS.test(n)) return 'fittings'
  if (RE_ANTI.test(n)) return 'anti-corrosion'
  if (RE_FANG.test(n) && !RE_TUSU.test(n)) return 'anti-corrosion'
  if (RE_PLASTIC.test(n)) return 'plastic-coated'
  return 'anti-corrosion'
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const SEO_SEP = '\uff1b'
const SEO_TITLE_ZH =
  '\u4ee5\u4e0b\u4e3a\u4ea7\u54c1\u76ee\u5f55\u6458\u8981\uff08\u7ad9\u5185\u641c\u7d22\u4e0e\u5206\u9875\u9700\u542f\u7528 JavaScript\uff09\uff1a'

/**
 * @param {{ categories: { id: string, name: string }[], products: { categoryId: string, categoryName: string, name: string }[] }} data
 * @param {'zh'|'en'} lang
 */
function buildSeoCatalogHtml(data, lang) {
  const lines = []
  for (const c of data.categories || []) {
    const prods = (data.products || []).filter((p) => p.categoryId === c.id)
    const names = prods.map((p) => escapeHtml(p.name)).join(SEO_SEP)
    const countWrap = lang === 'zh' ? `\uff08${prods.length}\uff09` : ` (${prods.length}) `
    lines.push(
      `<li><strong>${escapeHtml(c.name)}</strong>${countWrap}${names ? `${lang === 'zh' ? '\uff1a' : ': '}${names}` : ''}</li>`,
    )
  }
  const title =
    lang === 'zh'
      ? SEO_TITLE_ZH
      : 'Product catalog summary (search and pagination in the site require JavaScript):'
  return `<div class="seo-catalog-fallback" data-seo-catalog="1"><p class="fine">${escapeHtml(title)}</p><ul>${lines.join('')}</ul></div>`
}

/** @param {string} fragPath @param {string} seoInner */
function injectSeoBlock(fragPath, seoInner) {
  if (!fs.existsSync(fragPath)) return
  let html = fs.readFileSync(fragPath, 'utf8')
  if (!SEO_BLOCK_RE.test(html)) {
    console.warn(`prepare-products: no SEO markers in ${fragPath}, skip SEO inject`)
    return
  }
  html = html.replace(SEO_BLOCK_RE, `$1\n${seoInner}\n$2`)
  fs.writeFileSync(fragPath, html, 'utf8')
}

/** @param {string} p */
function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

/** @param {any} data */
function isRealProductCatalogData(data) {
  if (!data || typeof data !== 'object') return false
  if (data.metadata && data.metadata.placeholder === true) return false
  const nMeta = Number(data.metadata?.totalProducts) || 0
  const nProd = Array.isArray(data.products) ? data.products.length : 0
  return nMeta > 0 || nProd > 0
}

/** @param {string} p */
function isRealCatalogJsonFile(p) {
  if (!fs.existsSync(p)) return false
  try {
    const st = fs.statSync(p)
    if (!st.isFile() || st.size < MIN_CATALOG_FILE_BYTES) return false
  } catch {
    return false
  }
  return isRealProductCatalogData(readJsonSafe(p))
}

/** @param {string} p */
function isRealFamilyMapFile(p) {
  if (!fs.existsSync(p)) return false
  const data = readJsonSafe(p)
  if (!data || typeof data !== 'object') return false
  if (data.placeholder === true) return false
  const m = data.byCategoryId
  return m && typeof m === 'object' && Object.keys(m).length > 0
}

/**
 * @param {object} data product catalog JSON (cn or en shape)
 * @returns {Record<string, string>}
 */
function familyMapFromCatalogData(data) {
  const familyByCategoryId = {}
  for (const c of data.categories || []) {
    if (c?.id) familyByCategoryId[c.id] = classifyCategoryFamily(c.name || '')
  }
  return familyByCategoryId
}

/** @param {string} hyMainRoot */
function useCommittedCatalogWhenHyMainMissing(hyMainRoot) {
  if (!isRealCatalogJsonFile(OUT_ZH) || !isRealCatalogJsonFile(OUT_EN)) return false

  console.warn(
    `prepare-products: hy-main missing (looked under ${hyMainRoot}); keeping committed JSON in public/data/ (set HY_MAIN_ROOT to regenerate from source).`,
  )

  const zhData = readJsonSafe(OUT_ZH)
  const enData = readJsonSafe(OUT_EN)
  if (!zhData || !enData) return false

  const neededFamily = !isRealFamilyMapFile(OUT_FAMILY)
  if (neededFamily) {
    const mergedFamily = { ...familyMapFromCatalogData(zhData), ...familyMapFromCatalogData(enData) }
    fs.mkdirSync(path.dirname(OUT_FAMILY), { recursive: true })
    fs.writeFileSync(
      OUT_FAMILY,
      `${JSON.stringify({ byCategoryId: mergedFamily }, null, 2)}\n`,
      'utf8',
    )
  }

  const missing = [...new Set([...listMissingImages(zhData), ...listMissingImages(enData)])].sort()
  fs.mkdirSync(path.dirname(MISSING_REPORT), { recursive: true })
  fs.writeFileSync(
    MISSING_REPORT,
    missing.length ? `${missing.join('\n')}\n` : '(none)\n',
    'utf8',
  )

  injectSeoBlock(FRAG_ZH, buildSeoCatalogHtml(zhData, 'zh'))
  injectSeoBlock(FRAG_EN, buildSeoCatalogHtml(enData, 'en'))

  console.log(
    JSON.stringify(
      {
        hyMainRoot,
        mode: 'committed-json',
        kept: [OUT_ZH, OUT_EN],
        rewroteFamilyMap: neededFamily,
        seoFragments: [FRAG_ZH, FRAG_EN],
        missingImages: missing.length,
        missingReport: MISSING_REPORT,
      },
      null,
      2,
    ),
  )
  return true
}

/** @param {string} urlPath e.g. /images/hy/foo.jpg */
function publicFileExists(urlPath) {
  if (!urlPath.startsWith('/')) return false
  const rel = urlPath.replace(/^\//, '')
  const abs = path.join(siteRoot, 'public', rel)
  return fs.existsSync(abs) && fs.statSync(abs).isFile()
}

/**
 * @param {object} data prepared data
 * @returns {string[]}
 */
function listMissingImages(data) {
  const paths = new Set()
  collectImagePaths(data, paths)
  const missing = []
  for (const p of [...paths].sort()) {
    if (!p.startsWith('/images/hy/')) continue
    if (!publicFileExists(p)) missing.push(p)
  }
  return missing
}

/**
 * @param {string} srcJsonPath
 * @param {string} outJsonPath
 */
function processFile(srcJsonPath, outJsonPath) {
  const raw = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'))
  const data = rewriteImagesDeep(raw)
  const familyByCategoryId = {}
  for (const c of data.categories || []) {
    if (c?.id) familyByCategoryId[c.id] = classifyCategoryFamily(c.name || '')
  }
  data.familyByCategoryId = familyByCategoryId
  fs.mkdirSync(path.dirname(outJsonPath), { recursive: true })
  fs.writeFileSync(outJsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  return { data, familyByCategoryId }
}

function writePlaceholderOutputs(message) {
  console.warn(`prepare-products: ${message}`)
  fs.mkdirSync(path.dirname(OUT_ZH), { recursive: true })
  fs.writeFileSync(OUT_ZH, `${JSON.stringify(PLACEHOLDER, null, 2)}\n`, 'utf8')
  fs.writeFileSync(OUT_EN, `${JSON.stringify(PLACEHOLDER, null, 2)}\n`, 'utf8')
  fs.writeFileSync(
    OUT_FAMILY,
    `${JSON.stringify({ byCategoryId: {}, placeholder: true }, null, 2)}\n`,
    'utf8',
  )
  const emptySeoZh =
    '<p class="fine">\u672c\u6784\u5efa\u672a\u5305\u542b\u4ea7\u54c1\u76ee\u5f55\u6570\u636e\u3002\u5b8c\u6574\u76ee\u5f55\u3001\u641c\u7d22\u4e0e\u5206\u9875\u9700\u5728\u6d4f\u89c8\u5668\u4e2d\u542f\u7528 JavaScript\u3002</p>'
  const emptySeoEn =
    '<p class="fine">This build does not include product catalog data. The full catalog, search, and pagination require JavaScript in your browser.</p>'
  injectSeoBlock(FRAG_ZH, emptySeoZh)
  injectSeoBlock(FRAG_EN, emptySeoEn)
  fs.mkdirSync(path.dirname(MISSING_REPORT), { recursive: true })
  fs.writeFileSync(MISSING_REPORT, '(none ?? placeholder build)\n', 'utf8')
}

function main() {
  const cnPath = path.join(hyMainRoot, 'cn', 'products.json')
  const enPath = path.join(hyMainRoot, 'en', 'products.json')

  if (!fs.existsSync(hyMainRoot) || !fs.existsSync(cnPath) || !fs.existsSync(enPath)) {
    if (useCommittedCatalogWhenHyMainMissing(hyMainRoot)) {
      process.exit(0)
      return
    }
    writePlaceholderOutputs(`hy-main or products.json missing (looked under ${hyMainRoot})`)
    process.exit(0)
    return
  }

  const { data: zhData, familyByCategoryId: famZh } = processFile(cnPath, OUT_ZH)
  const { data: enData, familyByCategoryId: famEn } = processFile(enPath, OUT_EN)

  const mergedFamily = { ...famZh, ...famEn }
  fs.writeFileSync(
    OUT_FAMILY,
    `${JSON.stringify({ byCategoryId: mergedFamily }, null, 2)}\n`,
    'utf8',
  )

  const missing = [...new Set([...listMissingImages(zhData), ...listMissingImages(enData)])].sort()
  fs.mkdirSync(path.dirname(MISSING_REPORT), { recursive: true })
  fs.writeFileSync(
    MISSING_REPORT,
    missing.length ? `${missing.join('\n')}\n` : '(none)\n',
    'utf8',
  )

  injectSeoBlock(FRAG_ZH, buildSeoCatalogHtml(zhData, 'zh'))
  injectSeoBlock(FRAG_EN, buildSeoCatalogHtml(enData, 'en'))

  console.log(
    JSON.stringify(
      {
        hyMainRoot,
        wrote: [OUT_ZH, OUT_EN, OUT_FAMILY],
        missingImages: missing.length,
        missingReport: MISSING_REPORT,
      },
      null,
      2,
    ),
  )
}

main()
