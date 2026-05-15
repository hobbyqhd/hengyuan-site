#!/usr/bin/env node
/**
 * Scan hy-main (cn, en, css, js) for references under images/, copy files into
 * public/images/hy/ and write tools/hy-images-missing.txt for broken refs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const hyMainRoot = path.resolve(
  process.env.HY_MAIN_ROOT || path.join(siteRoot, '..', 'hy-main'),
)
const imagesSrcRoot = path.join(hyMainRoot, 'images')
const outRoot = path.join(siteRoot, 'public', 'images', 'hy')
const missingReport = path.join(siteRoot, 'tools', 'hy-images-missing.txt')

const SCAN_DIRS = ['cn', 'en', 'css', 'js'].map((d) => path.join(hyMainRoot, d))
const TEXT_EXT = new Set([
  '.html',
  '.htm',
  '.css',
  '.js',
  '.json',
  '.vue',
  '.mjs',
  '.cjs',
])

/** @param {string} raw */
function toRelativeImagesPath(raw) {
  if (!raw || typeof raw !== 'string') return null
  let u = raw.trim()
  if (/^data:/i.test(u) || /^javascript:/i.test(u) || /^mailto:/i.test(u)) return null
  const cut = (s) => {
    const q = s.indexOf('?')
    if (q >= 0) s = s.slice(0, q)
    const h = s.indexOf('#')
    if (h >= 0) s = s.slice(0, h)
    return s.trim()
  }
  u = cut(u)
  if (!u) return null
  const abs = u.match(/https?:\/\/[^/]+\/images\/(.+)$/i)
  if (abs) return decodePath(abs[1])
  if (u.startsWith('/images/')) return decodePath(u.slice('/images/'.length))
  const rel = u.match(/^(?:\.\.\/|\.\/)images\/(.+)$/i)
  if (rel) return decodePath(rel[1])
  if (/^images\//i.test(u)) return decodePath(u.replace(/^images\//i, ''))
  return null
}

function decodePath(p) {
  try {
    return decodeURIComponent(p)
  } catch {
    return p
  }
}

/** @param {string} text @param {Set<string>} out */
function extractFromText(text, out) {
  for (const m of text.matchAll(/\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    const r = toRelativeImagesPath(m[1])
    if (r) out.add(r)
  }
  for (const m of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0]
      const r = toRelativeImagesPath(url)
      if (r) out.add(r)
    }
  }
  for (const m of text.matchAll(/\burl\s*\(\s*["']?([^"')]+?)["']?\s*\)/gi)) {
    const r = toRelativeImagesPath(m[1].trim())
    if (r) out.add(r)
  }
  for (const m of text.matchAll(
    /<meta[^>]+(?:property=["']og:image["']|name=["']twitter:image["'])[^>]*\bcontent=["']([^"']+)["'][^>]*>/gi,
  )) {
    const r = toRelativeImagesPath(m[1])
    if (r) out.add(r)
  }
  for (const m of text.matchAll(/\bcontent\s*:\s*[^;]*?url\s*\(\s*["']?([^"');]+?)["']?\s*\)/gi)) {
    const r = toRelativeImagesPath(m[1].trim())
    if (r) out.add(r)
  }
  for (const m of text.matchAll(/https?:\/\/[^"'\s<>]+/g)) {
    const r = toRelativeImagesPath(m[0])
    if (r) out.add(r)
  }
  for (const m of text.matchAll(/["']((?:\.\.\/|\.\/)images\/[^"']+)["']/g)) {
    const r = toRelativeImagesPath(m[1])
    if (r) out.add(r)
  }
  for (const m of text.matchAll(/["'](\/images\/[^"']+)["']/g)) {
    const r = toRelativeImagesPath(m[1])
    if (r) out.add(r)
  }
}

function walkFiles(dir, acc) {
  if (!fs.existsSync(dir)) return
  const st = fs.statSync(dir)
  if (!st.isDirectory()) return
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue
    const full = path.join(dir, name)
    const s = fs.statSync(full)
    if (s.isDirectory()) walkFiles(full, acc)
    else acc.push(full)
  }
}

function main() {
  if (!fs.existsSync(hyMainRoot)) {
    console.error(`hy-main not found at ${hyMainRoot} (set HY_MAIN_ROOT)`)
    process.exit(1)
  }
  if (!fs.existsSync(imagesSrcRoot)) {
    console.error(`hy-main/images not found at ${imagesSrcRoot}`)
    process.exit(1)
  }

  const refs = new Set()
  const allFiles = []
  for (const d of SCAN_DIRS) walkFiles(d, allFiles)

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase()
    if (!TEXT_EXT.has(ext)) continue
    let text
    try {
      text = fs.readFileSync(file, 'utf8')
    } catch {
      continue
    }
    if (text.includes('\0')) continue
    extractFromText(text, refs)
  }

  const missing = []
  let copied = 0
  let skipped = 0

  for (const rel of [...refs].sort()) {
    if (!rel || rel.includes('..')) continue
    const src = path.join(imagesSrcRoot, rel)
    const dest = path.join(outRoot, rel)
    if (!fs.existsSync(src)) {
      missing.push(rel)
      continue
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    copied++
  }

  fs.mkdirSync(path.dirname(missingReport), { recursive: true })
  fs.writeFileSync(
    missingReport,
    missing.length ? `${missing.join('\n')}\n` : '(none)\n',
    'utf8',
  )

  console.log(
    JSON.stringify(
      {
        hyMainRoot,
        referenced: refs.size,
        copied,
        missing: missing.length,
        missingReport,
      },
      null,
      2,
    ),
  )
}

main()
