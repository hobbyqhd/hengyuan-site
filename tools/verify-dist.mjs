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
  console.error('verify-dist: missing dist/ ¡ª run vite build first')
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

console.log('verify-dist: ok (no QA hooks or javascript: URLs in dist)')
