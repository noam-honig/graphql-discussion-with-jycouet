/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  schemaPath: './src/graphql/schema.graphql',
  plugins: {
    'houdini-svelte': {
      client: 'src/graphql/client.ts',
    },
  },
}

export default config
