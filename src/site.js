import './styles/main.css'

function initNav() {
  const toggle = document.querySelector('[data-nav-toggle]')
  const panel = document.querySelector('[data-nav-panel]')
  if (!toggle || !panel) return

  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  })

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      panel.classList.remove('is-open')
      toggle.setAttribute('aria-expanded', 'false')
    })
  })
}

/** Collapsible product filter sidebar (mobile). */
function initProductFilterPanel() {
  const root = document.querySelector('[data-product-filter-root]')
  if (!root) return
  const aside = root.querySelector('.filter-panel')
  const toggle = root.querySelector('[data-filter-toggle]')
  if (!aside || !toggle) return

  toggle.addEventListener('click', () => {
    const open = aside.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  })
}

/**
 * Filter product sections (and optional cards) by `data-family`.
 * All sections visible when no checkbox is selected (SEO: DOM stays intact).
 */
function initProductFamilyFilter() {
  const root = document.querySelector('[data-product-filter-root]')
  if (!root) return

  const boxes = root.querySelectorAll('input[type="checkbox"][name="product-family"]')
  if (!boxes.length) return

  const sections = root.querySelectorAll('.product-section[data-family]')
  const cards = root.querySelectorAll('.media-card[data-family]')

  const apply = () => {
    const selected = [...boxes].filter((b) => b.checked).map((b) => b.value)
    const showAll = selected.length === 0

    root.dispatchEvent(
      new CustomEvent('product-family-filter', {
        bubbles: false,
        detail: { selected, showAll },
      }),
    )

    sections.forEach((sec) => {
      const fam = sec.getAttribute('data-family') || ''
      const match = showAll || selected.includes(fam)
      sec.classList.toggle('is-filtered-out', !match)
    })

    cards.forEach((card) => {
      const fam = card.getAttribute('data-family') || ''
      const match = showAll || selected.includes(fam)
      card.classList.toggle('is-filtered-out', !match)
    })
  }

  boxes.forEach((b) => b.addEventListener('change', apply))
  root.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
    boxes.forEach((b) => {
      b.checked = false
    })
    apply()
  })
  apply()
}

/** Ease-out cubic for counter animation */
function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

/**
 * Animate numeric text from 0 to target when `[data-counter]` enters the viewport.
 * Uses IntersectionObserver + requestAnimationFrame (no external deps).
 */
function initCounters() {
  const nodes = document.querySelectorAll('[data-counter]')
  if (!nodes.length) return

  const runCounter = (el) => {
    const rawTarget = el.getAttribute('data-counter-target')
    const target = rawTarget != null ? Number(rawTarget) : Number(el.getAttribute('data-counter') || '0')
    if (Number.isNaN(target)) return

    const duration = Math.min(2400, Math.max(600, Number(el.getAttribute('data-counter-duration') || '1400')))
    const prefix = el.getAttribute('data-counter-prefix') || ''
    const suffix = el.getAttribute('data-counter-suffix') || ''
    const decimals = Math.max(0, Math.min(3, Number(el.getAttribute('data-counter-decimals') || '0')))

    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const v = target * easeOutCubic(t)
      const shown = decimals ? v.toFixed(decimals) : String(Math.round(v))
      el.textContent = `${prefix}${shown}${suffix}`
      if (t < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        if (el.dataset.counterAnimated === '1') return
        el.dataset.counterAnimated = '1'
        obs.unobserve(el)
        runCounter(el)
      })
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.25 },
  )

  nodes.forEach((n) => io.observe(n))
}

function initCertLightbox() {
  const dialog = document.querySelector('[data-cert-dialog]')
  const img = dialog?.querySelector('[data-cert-dialog-img]')
  const closeBtn = dialog?.querySelector('[data-cert-close]')
  if (!dialog || !img || typeof dialog.showModal !== 'function') return

  document.querySelectorAll('[data-cert-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const thumb = btn.querySelector('img')
      const src = btn.getAttribute('data-cert-src') || thumb?.getAttribute('src') || ''
      const alt = btn.getAttribute('data-cert-alt') || thumb?.getAttribute('alt') || ''
      img.setAttribute('src', src)
      img.setAttribute('alt', alt)
      dialog.showModal()
    })
  })

  closeBtn?.addEventListener('click', () => dialog.close())

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect()
    const inDialog =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
    if (!inDialog) dialog.close()
  })
}

/**
 * Steel pipe mass (kg) from metric OD / wall / length and density.
 * Annulus cross-section: A = (π/4)(OD² − ID²) with ID = OD − 2t (all in metres).
 * Steel volume V = A · L. Mass m = V · ρ (ρ default 7850 kg/m³ for mild steel).
 */
function computePipeMassKg(odMm, wallMm, lengthM, densityKgM3) {
  const od = odMm / 1000
  const t = wallMm / 1000
  const id = od - 2 * t
  if (od <= 0 || t <= 0 || id <= 0 || lengthM <= 0 || densityKgM3 <= 0) return null
  const area = (Math.PI / 4) * (od * od - id * id)
  const volume = area * lengthM
  return volume * densityKgM3
}

function initPipeCalculator() {
  const root = document.querySelector('[data-pipe-calc]')
  if (!root) return

  const od = root.querySelector('[data-pipe-od]')
  const wall = root.querySelector('[data-pipe-wall]')
  const length = root.querySelector('[data-pipe-length]')
  const density = root.querySelector('[data-pipe-density]')
  const out = root.querySelector('[data-pipe-out]')
  if (!od || !wall || !length || !density || !out) return

  const fmt = (n) =>
    n.toLocaleString(undefined, {
      maximumFractionDigits: n >= 100 ? 0 : 2,
      minimumFractionDigits: n >= 100 ? 0 : 2,
    })

  const recalc = () => {
    const m = computePipeMassKg(
      Number(od.value),
      Number(wall.value),
      Number(length.value),
      Number(density.value),
    )
    if (m == null) {
      out.textContent = out.getAttribute('data-msg-invalid') || '—'
      return
    }
    out.textContent = `${fmt(m)} kg`
  }

  ;[od, wall, length, density].forEach((el) => el.addEventListener('input', recalc))
  recalc()
}

function initPrintQuote() {
  const btn = document.querySelector('[data-print-quote]')
  if (!btn) return

  btn.addEventListener('click', () => {
    const sheet = document.querySelector('[data-print-quote-sheet]')
    if (sheet) {
      const company = document.querySelector('#company')?.value?.trim() || '—'
      const contact = document.querySelector('#contact')?.value?.trim() || '—'
      const email = document.querySelector('#email')?.value?.trim() || '—'
      const phone = document.querySelector('#phone')?.value?.trim() || '—'
      const scope = document.querySelector('#scope')?.value?.trim() || '—'
      const standard = document.querySelector('#standard')?.value?.trim() || '—'
      const needdate = document.querySelector('#needdate')?.value?.trim() || '—'

      const set = (sel, text) => {
        const el = sheet.querySelector(sel)
        if (el) el.textContent = text
      }

      set('[data-print-company]', company)
      set('[data-print-contact]', contact)
      set('[data-print-email]', email)
      set('[data-print-phone]', phone)
      set('[data-print-scope]', scope)
      set('[data-print-standard]', standard)
      set('[data-print-needdate]', needdate)

      const out = document.querySelector('[data-pipe-out]')
      const od = document.querySelector('[data-pipe-od]')
      const wall = document.querySelector('[data-pipe-wall]')
      const len = document.querySelector('[data-pipe-length]')
      const rho = document.querySelector('[data-pipe-density]')
      if (out && od && wall && len && rho) {
        const line = `OD ${od.value || '—'} mm · wall ${wall.value || '—'} mm · length ${len.value || '—'} m · ρ ${rho.value || '—'} kg/m³ → est. mass ${out.textContent || '—'}`
        set('[data-print-pipe]', line)
      }
    }

    window.print()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initProductFilterPanel()
  initProductFamilyFilter()
  initCounters()
  initCertLightbox()
  initPipeCalculator()
  initPrintQuote()

  if (document.querySelector('[data-catalog-root]')) {
    import('./products-catalog.mjs').then((m) => m.initProductCatalog())
  }
})
