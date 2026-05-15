/**
 * RFQ form submission via FormSubmit.co (same endpoint/pattern as hy-main message-modal.js).
 */

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/sales@hypipelines.com'

const COPY = {
  en: {
    subject: 'Hengyuan Industrial Website RFQ',
    submit: 'Submit RFQ',
    submitting: 'Submitting??',
    success: 'Successfully submitted! We will contact you soon.',
    error: 'Submission failed. Please try again later or email sales@hypipelines.com directly.',
  },
  zh: {
    subject: '????????????RFQ??',
    submit: '?????',
    submitting: '??????',
    success: '???????????????????????',
    error: '??????????????????????????? sales@hypipelines.com??',
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
  return `Pipe estimator: OD ${od.value || '??'} mm ?? wall ${wall.value || '??'} mm ?? length ${len.value || '??'} m ?? ?? ${rho.value || '??'} kg/m? ?? est. mass ${out.textContent || '??'}`
}

function buildMessage(form) {
  const company = form.company?.value?.trim() || ''
  const scope = form.scope?.value?.trim() || ''
  const standard = form.standard?.value?.trim() || ''
  const needdate = form.needdate?.value?.trim() || ''
  const snap = pipeSnapshot()

  const parts = [
    scope && `Scope:\n${scope}`,
    standard && `Standards / data sheets: ${standard}`,
    needdate && `Target response date: ${needdate}`,
    company && `Company: ${company}`,
    snap,
    `Page: ${window.location.href}`,
  ].filter(Boolean)

  return parts.join('\n\n')
}

function buildPayload(form) {
  const company = form.company?.value?.trim() || ''
  const contact = form.contact?.value?.trim() || ''
  const name = company && contact ? `${company} ?? ${contact}` : contact || company

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
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    body: buildPayload(form),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
  return response.json()
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
