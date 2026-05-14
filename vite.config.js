import { defineConfig } from 'vite'
import { resolve, join, relative } from 'node:path'
import { readdirSync, statSync } from 'node:fs'

function collectHtmlInputs(rootDir, keyPrefix) {
  const inputs = {}
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (name.endsWith('.html')) {
        const rel = relative(rootDir, full).replaceAll('\\', '/')
        const key =
          `${keyPrefix}_${rel.replaceAll('/', '_').replace(/\.html$/, '')}`.replaceAll(
            '-',
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
