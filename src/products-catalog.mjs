const PAGE_SIZE = 9
const DEFAULT_IMG = '/images/hy/hp-products/default.svg'

const ZH_ALL = '\u5168\u90e8'
const ZH_PREV = '\u4e0a\u4e00\u9875'
const ZH_NEXT = '\u4e0b\u4e00\u9875'
const ZH_PAGE = (cur, tot) => `\u7b2c ${cur} / ${tot} \u9875`
const ZH_ITEMS = '\u6761'
const ZH_CONN = '\u8fde\u63a5'
const ZH_FEATURES = '\u7279\u70b9'
const ZH_APPS = '\u5e94\u7528'
const ZH_LOAD_FAIL =
  '\u4ea7\u54c1\u76ee\u5f55\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002'

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * @param {object} p
 * @param {string} q
 */
function productMatchesSearch(p, q) {
  if (!q) return true
  const hay = [p.name, p.specification, p.categoryName, p.description, p.connectionType]
    .filter(Boolean)
    .join('\n')
    .toLowerCase()
  return hay.includes(q.toLowerCase())
}

/** @param {object} state */
function getFilteredProducts(state) {
  const { allProducts, familyByCategoryId, selectedFamilies, categoryId, searchQ } = state
  const showAllFamilies = selectedFamilies.length === 0

  return allProducts.filter((p) => {
    const fam = familyByCategoryId[p.categoryId] || 'anti-corrosion'
    if (!showAllFamilies && !selectedFamilies.includes(fam)) return false
    if (categoryId && categoryId !== 'all' && p.categoryId !== categoryId) return false
    if (!productMatchesSearch(p, searchQ)) return false
    return true
  })
}

function buildState(data) {
  return {
    allCategories: data.categories || [],
    allProducts: data.products || [],
    familyByCategoryId: data.familyByCategoryId || {},
    selectedFamilies: [],
    categoryId: 'all',
    searchQ: '',
    page: 1,
  }
}

export function initProductCatalog() {
  const root = document.querySelector('[data-catalog-root]')
  if (!root) return

  const lang = root.getAttribute('data-catalog-lang') === 'en' ? 'en' : 'zh'
  const filterRoot = document.querySelector('[data-product-filter-root]')
  const searchInput = root.querySelector('[data-catalog-search]')
  const catHost = root.querySelector('[data-catalog-categories]')
  const grid = root.querySelector('[data-catalog-grid]')
  const pag = root.querySelector('[data-catalog-pagination]')
  const dialog = document.getElementById('product-detail')
  const dialogBody = dialog?.querySelector('[data-catalog-dialog-body]')
  const dialogClose = dialog?.querySelector('[data-catalog-dialog-close]')

  if (!catHost || !grid || !pag || !dialog || !dialogBody || !searchInput) return

  /** @type {ReturnType<typeof buildState> | null} */
  let state = null

  const renderCategories = () => {
    if (!state) return
    const chips = []
    const allLabel = lang === 'zh' ? ZH_ALL : 'All'
    chips.push(
      `<button type="button" class="catalog-chip${state.categoryId === 'all' ? ' is-active' : ''}" data-cat-id="all">${escapeHtml(allLabel)}</button>`,
    )
    for (const c of state.allCategories) {
      const active = state.categoryId === c.id ? ' is-active' : ''
      chips.push(
        `<button type="button" class="catalog-chip${active}" data-cat-id="${escapeHtml(c.id)}">${escapeHtml(c.name)} <span class="catalog-chip__count">${Number(c.count) || 0}</span></button>`,
      )
    }
    catHost.innerHTML = chips.join('')
    catHost.querySelectorAll('[data-cat-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!state) return
        state.categoryId = btn.getAttribute('data-cat-id') || 'all'
        state.page = 1
        renderCategories()
        renderGrid()
      })
    })
  }

  const renderGrid = () => {
    if (!state) return
    const list = getFilteredProducts(state)
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
    if (state.page > totalPages) state.page = totalPages
    const start = (state.page - 1) * PAGE_SIZE
    const slice = list.slice(start, start + PAGE_SIZE)

    grid.innerHTML = slice
      .map((p) => {
        const img = p.image && String(p.image).trim() ? escapeHtml(p.image) : DEFAULT_IMG
        const fam = state.familyByCategoryId[p.categoryId] || ''
        return `<article class="catalog-card" data-product-id="${escapeHtml(p.id)}" data-family="${escapeHtml(fam)}">
  <button type="button" class="catalog-card__open" data-open-product="${escapeHtml(p.id)}">
    <span class="catalog-card__media"><img src="${img}" alt="" width="400" height="300" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${DEFAULT_IMG}'" /></span>
    <span class="catalog-card__body">
      <span class="catalog-card__cat fine">${escapeHtml(p.categoryName || '')}</span>
      <span class="catalog-card__title">${escapeHtml(p.name || '')}</span>
      <span class="catalog-card__spec">${escapeHtml(p.specification || '')}</span>
    </span>
  </button>
</article>`
      })
      .join('')

    grid.querySelectorAll('[data-open-product]').forEach((btn) => {
      btn.addEventListener('click', () => openDetail(btn.getAttribute('data-open-product') || ''))
    })

    const prevLabel = lang === 'zh' ? ZH_PREV : 'Previous'
    const nextLabel = lang === 'zh' ? ZH_NEXT : 'Next'
    const pageLabel = lang === 'zh' ? ZH_PAGE(state.page, totalPages) : `Page ${state.page} / ${totalPages}`
    const mid = lang === 'zh' ? '\u00b7' : '\u00b7'

    pag.innerHTML = `<div class="catalog-pagination__inner">
  <button type="button" class="btn btn-outline catalog-page-btn" data-page-dir="-1" ${state.page <= 1 ? 'disabled' : ''}>${escapeHtml(prevLabel)}</button>
  <span class="catalog-pagination__status fine">${escapeHtml(pageLabel)} ${mid} ${list.length} ${lang === 'zh' ? ZH_ITEMS : 'items'}</span>
  <button type="button" class="btn btn-outline catalog-page-btn" data-page-dir="1" ${state.page >= totalPages ? 'disabled' : ''}>${escapeHtml(nextLabel)}</button>
</div>`

    pag.querySelectorAll('[data-page-dir]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!state) return
        const dir = Number(btn.getAttribute('data-page-dir') || '0')
        const next = state.page + dir
        const tp = Math.max(1, Math.ceil(getFilteredProducts(state).length / PAGE_SIZE))
        state.page = Math.min(tp, Math.max(1, next))
        renderGrid()
      })
    })
  }

  const openDetail = (id) => {
    if (!state) return
    const p = state.allProducts.find((x) => x.id === id)
    if (!p) return
    const img = p.image && String(p.image).trim() ? escapeHtml(p.image) : DEFAULT_IMG
    const feats = Array.isArray(p.features)
      ? `<ul>${p.features.map((f) => `<li>${escapeHtml(String(f))}</li>`).join('')}</ul>`
      : ''
    const apps = Array.isArray(p.applications)
      ? `<ul>${p.applications.map((a) => `<li>${escapeHtml(a?.name || '')}</li>`).join('')}</ul>`
      : ''
    const conn = p.connectionType
      ? `<p class="fine"><strong>${lang === 'zh' ? ZH_CONN : 'Connection'}:</strong> ${escapeHtml(String(p.connectionType))}</p>`
      : ''

    dialogBody.innerHTML = `<div class="catalog-detail__grid">
  <div class="catalog-detail__media"><img src="${img}" alt="" width="640" height="480" loading="eager" onerror="this.onerror=null;this.src='${DEFAULT_IMG}'" /></div>
  <div class="catalog-detail__main">
    <p class="fine">${escapeHtml(p.categoryName || '')}</p>
    <h2 class="catalog-detail__title">${escapeHtml(p.name || '')}</h2>
    <p class="catalog-detail__spec">${escapeHtml(p.specification || '')}</p>
    ${conn}
    <div class="catalog-detail__desc"><p>${escapeHtml(p.description || '').replace(/\n/g, '</p><p>')}</p></div>
    ${feats ? `<div class="catalog-detail__block"><h3>${lang === 'zh' ? ZH_FEATURES : 'Features'}</h3>${feats}</div>` : ''}
    ${apps ? `<div class="catalog-detail__block"><h3>${lang === 'zh' ? ZH_APPS : 'Applications'}</h3>${apps}</div>` : ''}
  </div>
</div>`

    if (typeof dialog.showModal === 'function') dialog.showModal()
  }

  dialogClose?.addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close()
  })

  searchInput.addEventListener('input', () => {
    if (!state) return
    state.searchQ = searchInput.value.trim()
    state.page = 1
    renderGrid()
  })

  filterRoot?.addEventListener('product-family-filter', (e) => {
    if (!state || !e.detail) return
    state.selectedFamilies = Array.isArray(e.detail.selected) ? [...e.detail.selected] : []
    if (e.detail.showAll) {
      state.categoryId = 'all'
      renderCategories()
    }
    state.page = 1
    renderGrid()
  })

  const catalogFile = `products-${lang === 'en' ? 'en' : 'zh'}.json`
  const catalogUrl = `${import.meta.env.BASE_URL || '/'}data/${catalogFile}`

  fetch(catalogUrl)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json()
    })
    .then((data) => {
      const hasProducts =
        data &&
        data.metadata?.placeholder !== true &&
        Array.isArray(data.products) &&
        data.products.length > 0
      if (!hasProducts) {
        throw new Error('empty-catalog')
      }
      state = buildState(data)
      const boxes = filterRoot?.querySelectorAll('input[type="checkbox"][name="product-family"]')
      if (boxes?.length) {
        state.selectedFamilies = [...boxes].filter((b) => b.checked).map((b) => b.value)
      }
      renderCategories()
      renderGrid()
    })
    .catch(() => {
      grid.innerHTML =
        lang === 'zh'
          ? `<p class="fine">${escapeHtml(ZH_LOAD_FAIL)}</p>`
          : '<p class="fine">Could not load the product catalog. Please try again later.</p>'
    })
}
