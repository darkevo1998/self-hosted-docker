const GOOGLE_COOKIE = 'googtrans'
const DEFAULT_SOURCE_LANGUAGE = 'en'
const GOOGLE_COMBO_SELECTOR = 'select.goog-te-combo'
const ARTEFACT_SELECTORS = [
  '.goog-te-banner-frame.skiptranslate',
  '.goog-te-spinner-pos',
  '.goog-te-layer-shade',
  '#goog-gt-tt',
  '.goog-te-balloon-frame',
]

const normalizeLanguage = (value: string): string => {
  if (!value) {
    return DEFAULT_SOURCE_LANGUAGE
  }
  return value.split('-')[0].toLowerCase()
}

const setCookie = (value: string) => {
  const base = `${GOOGLE_COOKIE}=${value};path=/;`
  document.cookie = base
  const domain = window.location.hostname
  document.cookie = `${base}domain=.${domain};`
}

const hideBlockingOverlays = () => {
  ARTEFACT_SELECTORS.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.style.display = 'none'
      element.style.visibility = 'hidden'
      element.style.pointerEvents = 'none'
    })
  })

  if (document.body.style.position === 'relative') {
    document.body.style.position = ''
  }
  if (document.body.style.top && document.body.style.top !== '0px') {
    document.body.style.top = '0px'
  }
}

export const applyGoogleTranslateLanguage = (targetLanguage: string) => {
  const normalizedTarget = normalizeLanguage(targetLanguage)
  const cookieValue = `/${DEFAULT_SOURCE_LANGUAGE}/${normalizedTarget}`
  setCookie(cookieValue)

  const combo = document.querySelector<HTMLSelectElement>(GOOGLE_COMBO_SELECTOR)
  if (combo && combo.value !== normalizedTarget) {
    combo.value = normalizedTarget
    combo.dispatchEvent(new Event('change'))
  }

  // Google injects overlays that can block clicks; hide them after language change.
  window.requestAnimationFrame(() => {
    hideBlockingOverlays()
    // Repeat once more after the widget finishes updating.
    window.setTimeout(hideBlockingOverlays, 500)
  })
}

export const ensureGoogleOverlaysHidden = () => {
  hideBlockingOverlays()
}

