import { getSession } from '@auth/sveltekit'
import { createSchema, type YogaInitialContext } from 'graphql-yoga'
import { authConfig } from '../../hooks/handleAuth'
import type { KitQLContext } from '../../hooks/handleGraphql'

export const authSession = async (ctx: YogaInitialContext) => {
  // @ts-ignore issue with types (probably because of kit)
  return await getSession(ctx.request, authConfig)
}

export const authSchema = createSchema({
  typeDefs: `
		type Query {
			me: Session
		}

		type Session {
			user: UserInfo!
			expires: String!
		}

		type UserInfo {
			id: String
			name: String
			roles: [String!]
		}
`,
  resolvers: {
    Query: {
      me: async (root, arg, ctx: KitQLContext, info) => {
        return ctx.session
      },
    },
  },
})
