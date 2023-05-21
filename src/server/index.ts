import express from "express";
import { api } from "./api";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { remultGraphql } from "remult/graphql";
import { createSchema, createYoga } from "graphql-yoga";

const app = express();
app.use(api);
const { schema, rootValue } = remultGraphql(api);
app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: buildSchema(schema),
    rootValue,
    graphiql: true,
  })
);

const yoga = createYoga({
  graphiql: true,
  graphqlEndpoint:'/api/yoga',
  schema: createSchema({
    typeDefs: schema,
    resolvers: rootValue,
  }),
});

// Bind GraphQL Yoga to the graphql endpoint to avoid rendering the playground on any path
app.use(yoga.graphqlEndpoint, yoga);

app.listen(3002, () => console.log("Server started"));
