import { AppSystemProp } from '@activepieces/server-shared'
import { ActivepiecesError, ErrorCode, isNil } from '@activepieces/shared'
import { system } from '../helper/system/system'

type TranslateParams = {
    text: string
    sourceLanguage?: string | null
    targetLanguage: string
}

type TranslateResult = {
    translatedText: string
    detectedSourceLanguage?: string
}

type DetectionResult = {
    language: string | null
}

const CACHE_TTL_MS = 60 * 60 * 1000

const cache = new Map<string, { expiresAt: number; value: TranslateResult }>()
const inflight = new Map<string, Promise<TranslateResult>>()
const detectionCache = new Map<string, { expiresAt: number; value: DetectionResult }>()
const detectionInflight = new Map<string, Promise<DetectionResult>>()
let apiKeyStatusLogged = false

export const translationService = () => {
    const apiKey = system.get<string>(AppSystemProp.GOOGLE_TRANSLATE_API_KEY)
    const trimmedApiKey = apiKey?.trim() ?? ''
    const apiKeyPresent = trimmedApiKey.length > 0

    if (!apiKeyStatusLogged) {
        if (!apiKeyPresent) {
            console.warn('[translation] AP_GOOGLE_TRANSLATE_API_KEY is not set. Dynamic translations are disabled.')
        }
        else {
            console.log('[translation] AP_GOOGLE_TRANSLATE_API_KEY detected. Dynamic translations are enabled.')
        }
        apiKeyStatusLogged = true
    }

    return {
        isConfigured(): boolean {
            return apiKeyPresent
        },
        async translate(params: TranslateParams): Promise<TranslateResult> {
            const cleaned = params.text.trim()
            if (!cleaned) {
                return {
                    translatedText: params.text,
                }
            }

        if (!apiKeyPresent) {
            throw new ActivepiecesError({
                code: ErrorCode.SYSTEM_PROP_NOT_DEFINED,
                params: {
                    prop: AppSystemProp.GOOGLE_TRANSLATE_API_KEY,
                },
            }, 'Google Translate API key is not configured. Set AP_GOOGLE_TRANSLATE_API_KEY and restart the server.')
        }

            const targetForApi = params.targetLanguage.trim()
            const normalizedTarget = normalizeLanguageCode(targetForApi) || targetForApi.toLowerCase()
            const cacheKey = buildCacheKey(cleaned, normalizedTarget)
            const cachedValue = getCached(cacheKey)
            if (cachedValue) {
                return cachedValue
            }

            const detection = await detectLanguage(trimmedApiKey, cleaned)
            if (detection.language) {
                const normalizedDetected = normalizeLanguageCode(detection.language)
                setDetectionCached(cleaned, detection)
                if (normalizedDetected && normalizedDetected === normalizedTarget) {
                    const result: TranslateResult = {
                        translatedText: params.text,
                        detectedSourceLanguage: detection.language,
                    }
                    setCached(cacheKey, result)
                    return result
                }
            }

            let request = inflight.get(cacheKey)
            if (!request) {
                const resolvedSourceLanguage = pickSourceLanguage(params.sourceLanguage, detection.language)
                request = fetchFromGoogle(trimmedApiKey, cleaned, targetForApi, resolvedSourceLanguage)
                inflight.set(cacheKey, request)
            }

            try {
                const result = await request
                setCached(cacheKey, result)
                if (result.detectedSourceLanguage) {
                    setDetectionCached(cleaned, { language: result.detectedSourceLanguage })
                }
                return result
            }
            finally {
                inflight.delete(cacheKey)
            }
        },
    }
}

function buildCacheKey(text: string, normalizedTargetLanguage: string): string {
    return `${normalizedTargetLanguage}::${text}`
}

function getCached(key: string): TranslateResult | null {
    const cached = cache.get(key)
    if (!cached) {
        return null
    }
    if (cached.expiresAt < Date.now()) {
        cache.delete(key)
        return null
    }
    return cached.value
}

function setCached(key: string, value: TranslateResult): void {
    cache.set(key, {
        expiresAt: Date.now() + CACHE_TTL_MS,
        value,
    })
    if (cache.size > 1000) {
        pruneCache()
    }
}

function pruneCache(): void {
    const entries = Array.from(cache.entries()).sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    const itemsToRemove = entries.length - 1000
    for (let i = 0; i < itemsToRemove; i++) {
        cache.delete(entries[i][0])
    }
}

async function fetchFromGoogle(apiKey: string, text: string, targetLanguage: string, sourceLanguage?: string | null): Promise<TranslateResult> {
    const url = new URL('https://translation.googleapis.com/language/translate/v2')
    url.searchParams.set('key', apiKey)

    const body: Record<string, unknown> = {
        q: text,
        target: targetLanguage,
        format: 'text',
        model: 'nmt',
    }
    if (!isNil(sourceLanguage) && sourceLanguage.trim().length > 0) {
        body.source = sourceLanguage
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    const payload = await response.json() as GoogleTranslateResponse

    if (!response.ok) {
        handleGoogleError(response.status, payload)
    }

    const translation = payload?.data?.translations?.[0]
    if (!translation || !translation.translatedText) {
        throw new ActivepiecesError({
            code: ErrorCode.ENGINE_OPERATION_FAILURE,
            params: {
                message: 'Unexpected response from Google Translate API.',
            },
        })
    }

    return {
        translatedText: decodeHtmlEntities(translation.translatedText),
        detectedSourceLanguage: translation.detectedSourceLanguage,
    }
}

type GoogleTranslateResponse = {
    data?: {
        translations: Array<{
            translatedText: string
            detectedSourceLanguage?: string
        }>
    }
    error?: {
        message?: string
        status?: string
    }
}

function handleGoogleError(statusCode: number, payload: GoogleTranslateResponse): never {
    const message = payload?.error?.message ?? 'Google Translate API request failed.'
    throw new ActivepiecesError({
        code: ErrorCode.ENGINE_OPERATION_FAILURE,
        params: {
            message,
            context: {
                statusCode,
            },
        },
    })
}

const htmlEntityRegex = /&(#?(x?))(\w+);/gi

function decodeHtmlEntities(value: string): string {
    return value.replace(htmlEntityRegex, (_, isNumeric: string, type: string, entity: string) => {
        if (isNumeric) {
            const codePoint = type === 'x' || type === 'X' ? parseInt(entity, 16) : parseInt(entity, 10)
            if (!Number.isNaN(codePoint)) {
                return String.fromCodePoint(codePoint)
            }
            return _
        }

        const reference = htmlEntitiesMap[entity]
        return reference ?? _
    })
}

const htmlEntitiesMap: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
}

async function detectLanguage(apiKey: string, text: string): Promise<DetectionResult> {
    const cached = getDetectionCached(text)
    if (cached) {
        return cached
    }

    let request = detectionInflight.get(text)
    if (!request) {
        request = fetchDetection(apiKey, text)
        detectionInflight.set(text, request)
    }

    try {
        const result = await request
        setDetectionCached(text, result)
        return result
    }
    finally {
        detectionInflight.delete(text)
    }
}

async function fetchDetection(apiKey: string, text: string): Promise<DetectionResult> {
    const url = new URL('https://translation.googleapis.com/language/translate/v2/detect')
    url.searchParams.set('key', apiKey)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: text }),
    })

    const payload = await response.json() as GoogleDetectResponse

    if (!response.ok) {
        handleGoogleDetectionError(response.status, payload)
    }

    const detection = payload?.data?.detections?.[0]?.[0]
    if (!detection) {
        return { language: null }
    }

    return { language: detection.language ?? null }
}

type GoogleDetectResponse = {
    data?: {
        detections?: Array<Array<{
            language?: string
            isReliable?: boolean
            confidence?: number
        }>>
    }
    error?: {
        message?: string
        status?: string
    }
}

function handleGoogleDetectionError(statusCode: number, payload: GoogleDetectResponse): never {
    const message = payload?.error?.message ?? 'Google Translate API detection request failed.'
    throw new ActivepiecesError({
        code: ErrorCode.ENGINE_OPERATION_FAILURE,
        params: {
            message,
            context: {
                statusCode,
            },
        },
    })
}

function getDetectionCached(text: string): DetectionResult | null {
    const cached = detectionCache.get(text)
    if (!cached) {
        return null
    }
    if (cached.expiresAt < Date.now()) {
        detectionCache.delete(text)
        return null
    }
    return cached.value
}

function setDetectionCached(text: string, value: DetectionResult): void {
    detectionCache.set(text, {
        expiresAt: Date.now() + CACHE_TTL_MS,
        value,
    })
    if (detectionCache.size > 1000) {
        pruneDetectionCache()
    }
}

function pruneDetectionCache(): void {
    const entries = Array.from(detectionCache.entries()).sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    const itemsToRemove = entries.length - 1000
    for (let i = 0; i < itemsToRemove; i++) {
        detectionCache.delete(entries[i][0])
    }
}

function normalizeLanguageCode(value: string | null | undefined): string {
    if (!value) {
        return ''
    }
    const lower = value.toLowerCase()
    if (lower.startsWith('zh-')) {
        return lower
    }
    const [base] = lower.split('-')
    return base
}

function pickSourceLanguage(explicitSource: string | null | undefined, detected: string | null): string | null {
    if (explicitSource && explicitSource.trim().length > 0) {
        return explicitSource.trim()
    }
    if (detected && detected.trim().length > 0 && detected !== 'und') {
        return detected.trim()
    }
    return null
}


