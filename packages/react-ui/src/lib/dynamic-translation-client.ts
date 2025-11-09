import { api } from '@/lib/api'
import { ErrorCode } from '@activepieces/shared'

type TranslateParams = {
  text: string
  targetLanguage: string
  sourceLanguage?: string | null
}

type TranslateResponse = {
  translation: string
  detectedLanguage?: string
}

type TranslationStatusResponse = {
  enabled: boolean
}

const cache = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()
type TranslationStatus = 'unknown' | 'configured' | 'missing'
let clientTranslationStatus: TranslationStatus = 'unknown'

export const dynamicTranslationClient = {
  async translate({ text, targetLanguage, sourceLanguage }: TranslateParams): Promise<string> {
    const trimmed = text.trim()
    if (!trimmed) {
      return text
    }

    if (shouldSkip(trimmed)) {
      return text
    }

    const normalizedTarget = normalizeLanguage(targetLanguage)
    const cacheKey = `${normalizedTarget}::${trimmed}`

    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('[translation] Translation cache hit', {
        targetLanguage: normalizedTarget,
        textPreview: previewText(trimmed),
      })
      return reapplyWhitespace(text, cached)
    }

    if (inflight.has(cacheKey)) {
      const pending = await inflight.get(cacheKey)!
      console.log('[translation] Awaiting in-flight translation', {
        targetLanguage: normalizedTarget,
        textPreview: previewText(trimmed),
      })
      return reapplyWhitespace(text, pending)
    }

    const request = api
      .post<TranslateResponse>('/v1/translations/translate', {
        text,
        targetLanguage: normalizedTarget,
        sourceLanguage,
      })
      .then((response) => {
        const result = response.translation.trim()
        cache.set(cacheKey, result)
        inflight.delete(cacheKey)
        console.log('[translation] Translation success', {
          targetLanguage: normalizedTarget,
          textPreview: previewText(trimmed),
          sourceLanguage,
          detectedLanguage: response.detectedLanguage,
        })
        if (clientTranslationStatus !== 'configured') {
          console.log('[translation] Dynamic translation active. Server confirmed Google Translate API key.')
          clientTranslationStatus = 'configured'
        }
        return result
      })
      .catch((error) => {
        inflight.delete(cacheKey)
        if (
          clientTranslationStatus !== 'missing' &&
          api.isApError(error, ErrorCode.SYSTEM_PROP_NOT_DEFINED)
        ) {
          const serverMessage =
            (error.response?.data as { params?: { message?: string } })?.params?.message ??
            error.message
          if (serverMessage?.toLowerCase().includes('not configured')) {
            console.warn(
              '[translation] AP_GOOGLE_TRANSLATE_API_KEY is not configured on the server. Dynamic translation disabled.',
            )
            clientTranslationStatus = 'missing'
          }
          else {
            console.warn('[translation] Google Translate configuration error:', serverMessage)
          }
        }
        console.error('[translation] Translation failed', {
          targetLanguage: normalizedTarget,
          textPreview: previewText(trimmed),
          error,
        })
        throw error
      })

    inflight.set(cacheKey, request)

    const translated = await request
    return reapplyWhitespace(text, translated)
  },
  clearCache(): void {
    cache.clear()
    inflight.clear()
  },
  async checkStatus(): Promise<boolean> {
    try {
      const response = await api.get<TranslationStatusResponse>('/v1/translations/status')
      if (response.enabled) {
        console.log('[translation] Server reports Google Translate integration enabled.')
        clientTranslationStatus = 'configured'
        return true
      }
      console.warn('[translation] Server reports Google Translate integration disabled.')
      clientTranslationStatus = 'missing'
      return false
    }
    catch (error) {
      console.error('[translation] Failed to check translation status.', error)
      return false
    }
  },
}

function normalizeLanguage(lang: string): string {
  if (!lang) {
    return 'en'
  }
  if (lang.toLowerCase().startsWith('zh-')) {
    return lang
  }
  return lang.split('-')[0]
}

function shouldSkip(text: string): boolean {
  if (text.length > 800) {
    return true
  }
  if (!/[A-Za-z]/.test(text)) {
    return true
  }
  if (/[\u00C0-\u024F]/.test(text)) {
    return true
  }
  if (/{[{%]/.test(text) || /[%}]/.test(text)) {
    return true
  }
  return false
}

function reapplyWhitespace(original: string, translated: string): string {
  const leading = original.match(/^\s*/)?.[0] ?? ''
  const trailing = original.match(/\s*$/)?.[0] ?? ''
  return `${leading}${translated}${trailing}`
}

function previewText(text: string): string {
  if (text.length <= 40) {
    return text
  }
  return `${text.slice(0, 37)}...`
}


