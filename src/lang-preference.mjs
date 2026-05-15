const STORAGE_KEY = 'site-lang'

/** @returns {'zh' | 'en' | null} */
export function readStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'zh' || v === 'en' ? v : null
  } catch {
    return null
  }
}

/** @param {'zh' | 'en'} lang */
export function writeStoredLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* private mode / blocked storage */
  }
}

/** @returns {'zh' | 'en'} */
export function detectBrowserLang() {
  const list = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || '']
  const zh = list.some((l) => String(l).toLowerCase().startsWith('zh'))
  return zh ? 'zh' : 'en'
}

/**
 * Same path in the other locale (e.g. /zh/products.html → /en/products.html).
 * @param {string} pathname
 * @returns {string | null}
 */
export function alternateLocaleHref(pathname) {
  const m = pathname.match(/^\/(en|zh)\/(.+)$/i)
  if (!m) return null
  const other = m[1].toLowerCase() === 'en' ? 'zh' : 'en'
  return `/${other}/${m[2]}`
}

/** Root gateway: redirect using stored preference or browser locale. */
export function runRootLocaleRedirect() {
  const base =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : '/'
  let path = window.location.pathname
  if (path.startsWith(base)) {
    path = path.slice(base.length) || '/'
  }
  path = path.replace(/^\//, '') || '/'
  if (path !== '' && path !== '/' && path !== 'index.html') return

  const stored = readStoredLang()
  const lang = stored ?? detectBrowserLang()
  const target = `${base}${lang}/index.html`.replace(/\/{2,}/g, '/')
  window.location.replace(target)
}

/** Header/footer language switch: persist choice; href stays the stitched alternate URL. */
export function initLangSwitch() {
  document.querySelectorAll('[data-lang-switch]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-lang-target')
      if (target === 'zh' || target === 'en') writeStoredLang(target)
    })
  })

  document.querySelectorAll('[data-lang-pick]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-lang-pick')
      if (target === 'zh' || target === 'en') writeStoredLang(target)
    })
  })
}
