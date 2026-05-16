#!/usr/bin/env node
/**
 * Fail the build if production dist contains QA hooks or inline javascript: URLs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distRoot = path.join(__dirname, '..', 'dist')

const FORBIDDEN = [
  /__testVirtualScrollScenario/i,
  /testVirtualScroll/i,
  /javascript:/i,
]

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = []
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) files.push(...walk(full))
    else if (/\.(html|js|css|mjs)$/i.test(name.name)) files.push(full)
  }
  return files
}

if (!fs.existsSync(distRoot)) {
  console.error('verify-dist: missing dist/ ?? run vite build first')
  process.exit(1)
}

/** @type {{ file: string, pattern: string }[]} */
const hits = []

for (const file of walk(distRoot)) {
  const text = fs.readFileSync(file, 'utf8')
  for (const re of FORBIDDEN) {
    if (re.test(text)) {
      hits.push({ file: path.relative(distRoot, file), pattern: re.source })
      break
    }
  }
}

if (hits.length) {
  console.error('verify-dist: forbidden patterns in production bundle:')
  for (const h of hits) console.error(`  ${h.file} (${h.pattern})`)
  process.exit(1)
}

const zhIndex = path.join(distRoot, 'zh', 'index.html')
const enIndex = path.join(distRoot, 'en', 'index.html')
for (const [label, file, needle] of [
  ['zh/index.html', zhIndex, '\u4ea8\u6e90'],
  ['en/index.html', enIndex, 'plastic-coated'],
]) {
  if (!fs.existsSync(file)) {
    console.error(`verify-dist: missing ${label} — run npm run build (stitch must run before vite)`)
    process.exit(1)
  }
  const html = fs.readFileSync(file, 'utf8')
  if (!html.includes(needle)) {
    console.error(`verify-dist: ${label} looks like wrong content (expected "${needle}")`)
    process.exit(1)
  }
  if (!html.includes('data-lang-switch')) {
    console.error(`verify-dist: ${label} missing data-lang-switch on language link`)
    process.exit(1)
  }
  if (html.includes('/src/site.js') || html.includes('/src/styles/main.css')) {
    console.error(`verify-dist: ${label} still references /src/* — vite build did not rewrite assets`)
    process.exit(1)
  }
  if (!/<script[^>]+src="\/assets\/[^"]+\.js"/i.test(html)) {
    console.error(`verify-dist: ${label} missing bundled /assets/*.js script`)
    process.exit(1)
  }
  if (!/<link[^>]+href="\/assets\/[^"]+\.css"/i.test(html)) {
    console.error(`verify-dist: ${label} missing bundled /assets/*.css stylesheet`)
    process.exit(1)
  }
}

console.log('verify-dist: ok (no QA hooks or javascript: URLs in dist)')
