/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	// Encountered error in src/shared/Category.ts
	// This experimental syntax requires enabling one of the following parser plugin(s): "decorators", "decorators-legacy". (3:0)
	// so removing the ts for now. //TOD JYC in Houdini
	include: [`src/**/*.{svelte,graphql,gql,js}`],
	schemaPath: './src/graphql/schema.graphql',
	plugins: {
		'houdini-svelte': {
			client: 'src/graphql/client.ts'
		}
	}
};

export default config;
