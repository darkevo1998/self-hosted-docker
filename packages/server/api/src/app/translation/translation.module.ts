import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { translationController } from './translation.controller'

export const translationModule: FastifyPluginAsyncTypebox = async (fastify) => {
    await fastify.register(translationController, { prefix: '/v1/translations' })
}


