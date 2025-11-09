import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { applyGoogleTranslateLanguage, ensureGoogleOverlaysHidden } from '@/lib/google-translate'

const GOOGLE_SCRIPT_ID = 'google-translate-script'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown
      }
    }
  }
}

export const GoogleTranslateWidget = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const initializeWidget = () => {
      if (window.google?.translate?.TranslateElement) {
        const TranslateElement = window.google.translate.TranslateElement
        new TranslateElement(
          {
            pageLanguage: 'en',
          },
          'google_translate_element',
        )
        applyGoogleTranslateLanguage(i18n.language)
      }
    }

    // keep removing any google overlay that might block the UI
    const interval = window.setInterval(() => {
      ensureGoogleOverlaysHidden()
    }, 1000)

    window.googleTranslateElementInit = initializeWidget

    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      initializeWidget()
      return () => {
        window.clearInterval(interval)
      }
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    return () => {
      window.clearInterval(interval)
      // The widget doesn't expose a cleanup method; we only remove the script tag if it was added by us.
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (document.getElementById('google_translate_element')) {
        document.getElementById('google_translate_element')!.innerHTML = ''
      }
      delete window.googleTranslateElementInit
    }
  }, [])

  useEffect(() => {
    applyGoogleTranslateLanguage(i18n.language)
    ensureGoogleOverlaysHidden()
  }, [i18n.language])

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.75rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div id="google_translate_element" />
    </div>
  )
}

