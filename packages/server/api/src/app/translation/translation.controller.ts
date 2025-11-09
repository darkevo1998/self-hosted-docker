import { PrincipalType } from '@activepieces/shared'
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { translationService } from './translation.service'

const TranslateRequestSchema = Type.Object({
    text: Type.String({ minLength: 1 }),
    targetLanguage: Type.String({ minLength: 2 }),
    sourceLanguage: Type.Optional(Type.String({ minLength: 2 })),
})

const TranslateResponseSchema = Type.Object({
    translation: Type.String(),
    detectedLanguage: Type.Optional(Type.String()),
})

export const translationController: FastifyPluginAsyncTypebox = async (app) => {
    app.get('/status', async () => {
        const translator = translationService()
        return {
            enabled: translator.isConfigured(),
        }
    })

    app.post('/translate', TranslateRouteSchema, async (request) => {
        const { text, targetLanguage, sourceLanguage } = request.body

        if (!text.trim()) {
            return {
                translation: text,
            }
        }

        if (isEnglishTarget(targetLanguage)) {
            return {
                translation: text,
            }
        }

        const translator = translationService()
        const result = await translator.translate({
            text,
            targetLanguage,
            sourceLanguage,
        })

        return {
            translation: applyOriginalWhitespace(text, result.translatedText),
            detectedLanguage: result.detectedSourceLanguage,
        }
    })
}

const TranslateRouteSchema = {
    schema: {
        body: TranslateRequestSchema,
        response: {
            200: TranslateResponseSchema,
        },
    },
    config: {
        allowedPrincipals: [PrincipalType.USER] as const,
    },
}

function isEnglishTarget(target: string): boolean {
    const normalized = target.toLowerCase()
    return normalized === 'en' || normalized.startsWith('en-')
}

function applyOriginalWhitespace(original: string, translated: string): string {
    const leading = original.match(/^\s*/)?.[0] ?? ''
    const trailing = original.match(/\s*$/)?.[0] ?? ''
    return `${leading}${translated}${trailing}`
}


