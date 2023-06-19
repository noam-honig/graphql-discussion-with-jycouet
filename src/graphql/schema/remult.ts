import { entities } from '$shared/_entities'
import { createSchema } from 'graphql-yoga'
import { fs } from 'houdini'
import { remultGraphql } from 'remult/graphql'

const { typeDefs, resolvers } = remultGraphql({ entities })

// Houdini needs this file to start! We can write a dummy one so that onstart there is something to real. Then it will be regenerated?
// TODO JYC
fs.writeFile('./src/graphql/schema.graphql', typeDefs)

//  remult GraphQL
export const remultSchema = createSchema({ typeDefs, resolvers })
