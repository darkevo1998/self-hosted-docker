const GOOGLE_COOKIE = 'googtrans'
const DEFAULT_SOURCE_LANGUAGE = 'en'
const GOOGLE_COMBO_SELECTOR = 'select.goog-te-combo'
const ARTEFACT_SELECTORS = [
  '.goog-te-banner-frame.skiptranslate',
  '.goog-te-banner-frame',
  '.goog-te-spinner-pos',
  '.goog-te-layer-shade',
  '#goog-gt-tt',
  '.goog-te-balloon-frame',
  '.goog-te-menu-frame',
  '.goog-te-menu-value',
  '.goog-te-menu2',
  'iframe[src*="translate.google.com"]',
  'iframe[src*="translate.googleapis.com"]',
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
      element.style.opacity = '0'
      element.style.zIndex = '-1'
    })
  })

  // Also hide any divs with black/dark backgrounds that might be overlays
  document.querySelectorAll<HTMLElement>('div[style*="background"], div[style*="opacity"]').forEach((element) => {
    const computedStyle = window.getComputedStyle(element)
    const bgColor = computedStyle.backgroundColor
    const opacity = computedStyle.opacity
    const zIndex = parseInt(computedStyle.zIndex) || 0
    
    // Check if it's a dark overlay with high z-index (likely a blocking overlay)
    if (zIndex > 100 && opacity !== '0' && 
        (bgColor.includes('rgba(0, 0, 0') || bgColor.includes('rgb(0, 0, 0') ||
         bgColor.includes('rgba(255, 255, 255') && parseFloat(opacity) < 1)) {
      // Make sure it's not our widget container
      if (!element.id || element.id !== 'google_translate_element') {
        const widget = document.getElementById('google_translate_element')
        if (!widget || !element.contains(widget) && !widget.contains(element)) {
          element.style.display = 'none'
          element.style.visibility = 'hidden'
          element.style.pointerEvents = 'none'
          element.style.opacity = '0'
        }
      }
    }
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

