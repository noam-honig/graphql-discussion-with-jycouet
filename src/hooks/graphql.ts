import { mergeSchemas } from '@graphql-tools/schema'
import type { Handle } from '@sveltejs/kit'
import { createSchema, createYoga, type YogaInitialContext } from 'graphql-yoga'
import { fs } from 'houdini'

import { remultGraphql } from '../remult_tmp/graphql'
import { remultApi } from './remult'

const { typeDefs, resolvers } = remultGraphql(remultApi)

// Houdini needs this file to start! We can write a dummy one so that onstart there is something to real. Then it will be regenerated?
// TODO JYC
fs.writeFile('./src/graphql/schema.graphql', typeDefs)

export const handleGraphql = (options?: { endpoint: string }): Handle => {
  const { endpoint } = {
    endpoint: '/api/graphql',
    ...options,
  }

  const schema = mergeSchemas({
    schemas: [
      //  remult GraphQL
      createSchema({ typeDefs, resolvers }),

      // extended one
      createSchema({
        typeDefs: `
			type Query {
				me: CurrentUser
			}
			
			type CurrentUser {
				name: String
			}
			`,
        resolvers: {
          Query: {
            me: async (root, arg, ctx: KitQLContext, info) => {
              return { name: ctx.currentUser?.name }
            },
          },
        },
      }),
    ],
  })

  type KitQLContext = Awaited<ReturnType<typeof context>>
  const context = async (ctx: YogaInitialContext) => {
    // console.log(`cookie`, ctx.request.headers.get('cookie'))
    // get the the user from the cookie...
    // and pass it to allllll resolvers
    let currentUser: { name: string } | null = null
    currentUser = { name: 'JYC' }

    // TODO Noam. (Actually to look together)
    // get remult api and passit to allllll resolvers?
    // const api = await remultApi.getRemult(ctx.request)
    return {
      ...ctx,
      currentUser,
    }
  }

  const yoga = createYoga({
    graphiql: {
      defaultQuery: `# Welcome to Remult GraphQL

# In this editor you can test your operations (query, mutation, subscription) 
# against the Remult GraphQL API.
# You can also discover the API using the built-in documentation explorer.
			
query My_First_Query {
	tasks(orderBy: { title: ASC }) {
		id
		title
	}
}
			`,
      title: 'KitQL - Remult',
    },
    context,
    graphqlEndpoint: endpoint,
    schema,
  })
  return async ({ event, resolve }) => {
    if (event.url && event.url.pathname === endpoint) {
      return await yoga.handleRequest(event.request, {})
    }
    return resolve(event)
  }
}
