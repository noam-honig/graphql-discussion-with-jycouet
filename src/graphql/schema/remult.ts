import { createSchema } from 'graphql-yoga'
import { fs } from 'houdini'

import { handleRemult } from '../../hooks/handleRemult'
import { remultGraphql } from '../../remult_tmp/graphql'

const { typeDefs, resolvers } = remultGraphql(handleRemult)

// Houdini needs this file to start! We can write a dummy one so that onstart there is something to real. Then it will be regenerated?
// TODO JYC
fs.writeFile('./src/graphql/schema.graphql', typeDefs)

//  remult GraphQL
export const remultSchema = createSchema({ typeDefs, resolvers })
