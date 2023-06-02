import { mergeSchemas } from '@graphql-tools/schema'
import type { Handle } from '@sveltejs/kit'
import { createYoga, type YogaInitialContext } from 'graphql-yoga'

import { authSchema, authSession } from '../graphql/schema/auth'
import { remultSchema } from '../graphql/schema/remult'

export type KitQLContext = Awaited<ReturnType<typeof context>>
const context = async (ctx: YogaInitialContext) => {
  return {
    ...ctx,
    session: await authSession(ctx),
  }
}

export const handleGraphql = (options?: { endpoint: string }): Handle => {
  const { endpoint } = {
    endpoint: '/api/graphql',
    ...options,
  }

  const schema = mergeSchemas({
    schemas: [remultSchema, authSchema],
  })

  const yoga = createYoga({
    graphiql: {
      defaultQuery: `# Welcome to Remult GraphQL

# In this editor you can test your operations (query, mutation, subscription) 
# against the Remult GraphQL API.
# You can also discover the API using the built-in documentation explorer.
			
query My_First_Query {
  tasks(orderBy: {id: DESC}) {
    totalCount
    items {
      title
    }
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
