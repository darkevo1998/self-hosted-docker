import { assertNotNullOrUndefined, LocalesEnum, PrincipalType, UserWithMetaInformationAndProject } from '@activepieces/shared'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { StatusCodes } from 'http-status-codes'
import { userIdentityService } from '../../authentication/user-identity/user-identity-service'
import { userService } from '../../user/user-service'
import { Type } from '@sinclair/typebox'

export const usersController: FastifyPluginAsyncTypebox = async (app) => {
    app.get('/me', GetCurrentUserRequest, async (req): Promise<UserWithMetaInformationAndProject> => {
        const userId = req.principal.id
        assertNotNullOrUndefined(userId, 'userId')

        const user = await userService.getOneOrFail({ id: userId })
        const identity = await userIdentityService(app.log).getOneOrFail({ id: user.identityId })

        return {
            id: user.id,
            platformRole: user.platformRole,
            status: user.status,
            externalId: user.externalId,
            created: user.created,
            updated: user.updated,
            platformId: user.platformId,
            firstName: identity.firstName,
            lastName: identity.lastName,
            email: identity.email,
            trackEvents: identity.trackEvents,
            newsLetter: identity.newsLetter,
            verified: identity.verified,
            projectId: req.principal.projectId,
            locale: identity.locale,
        }
    })

    app.post<{ Body: { locale?: LocalesEnum } }>('/me/locale', UpdateLocaleRequest, async (req) => {
        const userId = req.principal.id
        assertNotNullOrUndefined(userId, 'userId')

        const user = await userService.getOneOrFail({ id: userId })
        const updatedIdentity = await userIdentityService(app.log).updateLocale({
            id: user.identityId,
            locale: req.body.locale,
        })

        return {
            locale: updatedIdentity.locale,
        }
    })
}

const GetCurrentUserRequest = {
    schema: {
        response: {
            [StatusCodes.OK]: UserWithMetaInformationAndProject,
        },
    },
    config: {
        allowedPrincipals: [PrincipalType.USER] as const,
    },
}

const UpdateLocaleRequest = {
    schema: {
        body: Type.Object({
            locale: Type.Optional(Type.Enum(LocalesEnum)),
        }),
        response: {
            [StatusCodes.OK]: Type.Object({
                locale: Type.Optional(Type.Enum(LocalesEnum)),
            }),
        },
    },
    config: {
        allowedPrincipals: [PrincipalType.USER] as const,
    },
}