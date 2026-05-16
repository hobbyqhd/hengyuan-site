/**
 * RFQ form submission via FormSubmit.co (same endpoint/pattern as hy-main message-modal.js).
 */

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/sales@hypipelines.com'

const COPY = {
  en: {
    subject: 'Hengyuan Industrial Website RFQ',
    submit: 'Submit RFQ',
    submitting: 'Submitting…',
    success: 'Successfully submitted! We will contact you soon.',
    error:
      'Submission failed. Please try again later or email sales@hypipelines.com directly.',
  },
  zh: {
    // ASCII escapes so CI / minify cannot mangle UTF-8 (hy-main embeds CJK in message-modal.js; we harden for Pages).
    subject:
      '\u6cb3\u5317\u4ea8\u6e90\u7f51\u7ad9\u8be2\u4ef7\uff08RFQ\uff09',
    submit: '\u63d0\u4ea4\u8be2\u4ef7',
    submitting: '\u6b63\u5728\u63d0\u4ea4\u2026',
    success:
      '\u63d0\u4ea4\u6210\u529f\uff01\u6211\u4eec\u4f1a\u5c3d\u5feb\u4e0e\u60a8\u8054\u7cfb\u3002',
    error:
      '\u63d0\u4ea4\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u6216\u76f4\u63a5\u53d1\u9001\u90ae\u4ef6\u81f3 sales@hypipelines.com\u3002',
  },
}

function localeFromDocument() {
  const lang = document.documentElement.lang || ''
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

function t(key) {
  const loc = localeFromDocument()
  return COPY[loc][key] ?? COPY.en[key] ?? key
}

function pipeSnapshot() {
  const out = document.querySelector('[data-pipe-out]')
  const od = document.querySelector('[data-pipe-od]')
  const wall = document.querySelector('[data-pipe-wall]')
  const len = document.querySelector('[data-pipe-length]')
  const rho = document.querySelector('[data-pipe-density]')
  if (!out || !od || !wall || !len || !rho) return ''
  const zh = localeFromDocument() === 'zh'
  if (zh) {
    const dash = '\u2014'
    return (
      '\u91cd\u91cf\u4f30\u7b97\uff1a\u5916\u5f84 ' +
      (od.value || dash) +
      ' mm\uff0c\u58c1\u539a ' +
      (wall.value || dash) +
      ' mm\uff0c\u957f\u5ea6 ' +
      (len.value || dash) +
      ' m\uff0c\u5bc6\u5ea6 ' +
      (rho.value || dash) +
      ' kg/m\u00b3\uff0c\u4f30\u7b97\u8d28\u91cf ' +
      (out.textContent || dash)
    )
  }
  return `Pipe estimator: OD ${od.value || '—'} mm · wall ${wall.value || '—'} mm · length ${len.value || '—'} m · ρ ${rho.value || '—'} kg/m³ → est. mass ${out.textContent || '—'}`
}

function buildMessage(form) {
  const zh = localeFromDocument() === 'zh'
  const company = form.company?.value?.trim() || ''
  const scope = form.scope?.value?.trim() || ''
  const standard = form.standard?.value?.trim() || ''
  const needdate = form.needdate?.value?.trim() || ''
  const snap = pipeSnapshot()

  const parts = zh
    ? [
        scope && '\u8303\u56f4\u6458\u8981\uff1a\n' + scope,
        standard &&
          '\u9002\u7528\u6807\u51c6 / \u6570\u636e\u8868\uff1a' + standard,
        needdate &&
          '\u671f\u671b\u56de\u590d\u65e5\u671f\uff1a' + needdate,
        company && '\u516c\u53f8 / \u673a\u6784\uff1a' + company,
        snap,
        '\u9875\u9762\uff1a' + window.location.href,
      ]
    : [
        scope && `Scope:\n${scope}`,
        standard && `Standards / data sheets: ${standard}`,
        needdate && `Target response date: ${needdate}`,
        company && `Company: ${company}`,
        snap,
        `Page: ${window.location.href}`,
      ]

  return parts.filter(Boolean).join('\n\n')
}

function buildPayload(form) {
  const company = form.company?.value?.trim() || ''
  const contact = form.contact?.value?.trim() || ''
  const name =
    company && contact
      ? `${company} · ${contact}`
      : contact || company

  const params = new URLSearchParams()
  params.set('_subject', t('subject'))
  params.set('_template', 'table')
  params.set('_captcha', 'true')
  params.set('_honey', '')
  params.set('name', name)
  params.set('email', form.email?.value?.trim() || '')
  params.set('phone', form.phone?.value?.trim() || '')
  params.set('message', buildMessage(form))
  if (company) params.set('company', company)
  if (form.standard?.value?.trim()) params.set('standard', form.standard.value.trim())
  if (form.needdate?.value?.trim()) params.set('needdate', form.needdate.value.trim())
  return params
}

async function postRfq(form) {
  const action = form.getAttribute('action') || FORM_ENDPOINT
  const response = await fetch(action, {
    method: 'POST',
    body: buildPayload(form),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return { success: false }
  }
}

function ensureFeedback(form) {
  let box = form.querySelector('[data-rfq-feedback]')
  if (box) return box

  box = document.createElement('div')
  box.className = 'rfq-feedback'
  box.setAttribute('data-rfq-feedback', '')
  box.setAttribute('role', 'status')
  box.hidden = true

  const success = document.createElement('p')
  success.className = 'rfq-feedback__msg rfq-feedback__msg--success'
  success.setAttribute('data-rfq-success', '')
  success.hidden = true
  success.textContent = t('success')

  const error = document.createElement('p')
  error.className = 'rfq-feedback__msg rfq-feedback__msg--error'
  error.setAttribute('data-rfq-error', '')
  error.hidden = true
  error.textContent = t('error')

  box.append(success, error)

  const submitBtn = form.querySelector('button[type="submit"]')
  if (submitBtn) form.insertBefore(box, submitBtn)
  else form.append(box)

  return box
}

function setLoading(submitBtn, loading) {
  if (!submitBtn) return
  if (!submitBtn.dataset.rfqDefaultLabel) {
    submitBtn.dataset.rfqDefaultLabel = submitBtn.textContent?.trim() || t('submit')
  }
  submitBtn.disabled = loading
  submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false')
  submitBtn.textContent = loading ? t('submitting') : submitBtn.dataset.rfqDefaultLabel
}

function showFeedback(form, kind) {
  const box = ensureFeedback(form)
  const success = box.querySelector('[data-rfq-success]')
  const error = box.querySelector('[data-rfq-error]')
  box.hidden = false
  success?.toggleAttribute('hidden', kind !== 'success')
  error?.toggleAttribute('hidden', kind !== 'error')
}

function hideFeedback(form) {
  const box = form.querySelector('[data-rfq-feedback]')
  if (!box) return
  box.hidden = true
  box.querySelector('[data-rfq-success]')?.setAttribute('hidden', 'hidden')
  box.querySelector('[data-rfq-error]')?.setAttribute('hidden', 'hidden')
}

export function initRfqSubmit() {
  const form = document.querySelector('form.rfq')
  if (!form) return

  const subj = form.querySelector('input[name="_subject"]')
  if (subj) subj.value = t('subject')

  const submitBtn = form.querySelector('button[type="submit"]')
  if (submitBtn && !submitBtn.dataset.rfqDefaultLabel) {
    submitBtn.dataset.rfqDefaultLabel = submitBtn.textContent?.trim() || t('submit')
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    hideFeedback(form)
    setLoading(submitBtn, true)

    try {
      const result = await postRfq(form)
      setLoading(submitBtn, false)

      if (result?.success) {
        showFeedback(form, 'success')
        form.reset()
        return
      }
      showFeedback(form, 'error')
    } catch (err) {
      console.error('RFQ submit failed:', err)
      setLoading(submitBtn, false)
      showFeedback(form, 'error')
    }
  })
}
