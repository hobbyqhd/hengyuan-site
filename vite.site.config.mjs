import { defineConfig } from 'vite'
import { resolve, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync, statSync } from 'node:fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function collectHtmlInputs(rootDir, keyPrefix) {
  const inputs = {}
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (name.endsWith('.html')) {
        const rel = relative(rootDir, full).replace(/\\/g, '/')
        const key =
          `${keyPrefix}_${rel.replace(/\//g, '_').replace(/\.html$/, '')}`.replace(
            /-/g,
            '_',
          )
        inputs[key] = full
      }
    }
  }
  walk(rootDir)
  return inputs
}

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        root_index: resolve(__dirname, 'index.html'),
        ...collectHtmlInputs(resolve(__dirname, 'en'), 'en'),
        ...collectHtmlInputs(resolve(__dirname, 'zh'), 'zh'),
      },
    },
  },
})
