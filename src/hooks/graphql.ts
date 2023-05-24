import type { Handle } from '@sveltejs/kit';
import { remultGraphql } from '../remult_tmp/graphql';

import { createSchema, createYoga } from 'graphql-yoga';
import { remultApi } from './remult';
import { fs } from 'houdini';

const { typeDefs, resolvers } = remultGraphql(remultApi);

// Houdini needs this file to start! We can write a dummy one so that onstart there is something to real. Then it will be regenerated?
// TODO JYC
console.log('coucou');
fs.writeFile('./src/graphql/schema.graphql', typeDefs);

export const handleGraphql = (options?: { endpoint: string }): Handle => {
	const { endpoint } = {
		endpoint: '/api/graphql',
		...options
	};

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
			title: 'KitQL - Remult'
		},
		graphqlEndpoint: endpoint,
		schema: createSchema({
			typeDefs,
			resolvers
		})
	});
	return async ({ event, resolve }) => {
		if (event.url && event.url.pathname === endpoint) {
			return await yoga.handleRequest(event.request, {});
		}
		return resolve(event);
	};
};
