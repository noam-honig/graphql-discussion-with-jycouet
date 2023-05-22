import express from "express";
import { api } from "./api";
import { buildSchema } from "graphql";

import { remultGraphql } from "remult/graphql";
import { createSchema, createYoga } from "graphql-yoga";

const app = express();
app.use(api);
const { schema, resolvers } = remultGraphql(api);

const yoga = createYoga({
  graphiql: true,
  graphqlEndpoint: "/api/yoga",
  schema: createSchema({
    typeDefs: schema,
    resolvers,
  }),
});
// Bind GraphQL Yoga to the graphql endpoint to avoid rendering the playground on any path
app.use(yoga.graphqlEndpoint, yoga);

app.listen(3002, () => console.log("Server started"));
