import type { Handle } from '@sveltejs/kit';
import { remultGraphql } from '../remult_tmp/graphql';

import { createSchema, createYoga } from 'graphql-yoga';
import { remultApi } from './remult';

const { typeDefs, resolvers } = remultGraphql(remultApi);

export const handleGraphql = (): Handle => {
	const yoga = createYoga({
		graphiql: true,
		// graphqlEndpoint: "/api/yoga",
		schema: createSchema({
			typeDefs,
			resolvers
		})
	});
	return async ({ event, resolve }) => {
		const endpoint = '/api/graphql';
		if (event.url && event.url.pathname === endpoint) {
			return await yoga.handleRequest(event.request, {});
		}

		return resolve(event);
	};
};
