import { RemultExpressServer, remultExpress } from "remult/remult-express";
import { beforeEach, describe, expect, it } from "vitest";
import { Category } from "../shared/Category";
import { Task } from "../shared/task";
import { remultGraphql } from "./graphql";
import { InMemoryDataProvider, remult } from "remult";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { parse } from "graphql";

import { createSchema, createYoga } from "graphql-yoga";

let api: RemultExpressServer;
describe("test graphql", () => {
  beforeEach(async () => {
    api = remultExpress({
      dataProvider: new InMemoryDataProvider(),
      entities: [Task, Category],
    });
  }),
    it("test basics", async () => {
      // rmv removeComments is very handy for testing!
      const { schema } = remultGraphql(api, { removeComments: true });

      expect(schema).toMatchInlineSnapshot(`
        "type Query {
          tasks (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): [Task!]!
          categories (limit: Int, page: Int, orderBy: categoriesOrderBy, where: categoriesWhere): [Category!]!
        }

        type Mutation {
          createTask (input: CreateTaskInput!): CreateTaskPayload
          updateTask (id: ID!, patch: UpdateTaskInput!): UpdateTaskPayload
          deleteTask (id: ID!): DeleteTaskPayload
          createCategory (input: CreateCategoryInput!): CreateCategoryPayload
          updateCategory (id: ID!, patch: UpdateCategoryInput!): UpdateCategoryPayload
          deleteCategory (id: ID!): DeleteCategoryPayload
        }

        type Task {
          id: Int!
          title: String!
          completed: Boolean!
          category: Category
        }

        input tasksOrderBy {
          id: OrderBydirection
          title: OrderBydirection
          completed: OrderBydirection
          category: OrderBydirection
        }

        input tasksWhere {
          id: tasksWhere_id
          title: tasksWhere_title
          completed: tasksWhere_completed
          category: tasksWhere_category
          OR: [tasksWhere!]
        }

        input tasksWhere_id {
          eq: Int
          ne: Int
          gt: Int
          gte: Int
          lt: Int
          lte: Int
          in: [Int!]
        }

        input tasksWhere_title {
          eq: String
          ne: String
          gt: String
          gte: String
          lt: String
          lte: String
          st: String
          contains: String
          in: [String!]
        }

        input tasksWhere_completed {
          eq: Boolean
          ne: Boolean
          in: [Boolean!]
        }

        input tasksWhere_category {
          eq: String
          ne: String
          null: Boolean
          in: [String!]
        }

        input CreateTaskInput {
          title: String!
          completed: Boolean!
        }

        type CreateTaskPayload {
          task: Task
        }

        input UpdateTaskInput {
          title: String!
          completed: Boolean!
        }

        type UpdateTaskPayload {
          task: Task
        }

        type DeleteTaskPayload {
          deletedTaskId: ID
        }

        type Category {
          id: String!
          name: String!
          tasks (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): [Task!]!
        }

        input categoriesOrderBy {
          id: OrderBydirection
          name: OrderBydirection
        }

        input categoriesWhere {
          id: categoriesWhere_id
          name: categoriesWhere_name
          OR: [categoriesWhere!]
        }

        input categoriesWhere_id {
          eq: String
          ne: String
          gt: String
          gte: String
          lt: String
          lte: String
          st: String
          contains: String
          in: [String!]
        }

        input categoriesWhere_name {
          eq: String
          ne: String
          gt: String
          gte: String
          lt: String
          lte: String
          st: String
          contains: String
          in: [String!]
        }

        input CreateCategoryInput {
          id: String!
          name: String!
        }

        type CreateCategoryPayload {
          category: Category
        }

        input UpdateCategoryInput {
          id: String!
          name: String!
        }

        type UpdateCategoryPayload {
          category: Category
        }

        type DeleteCategoryPayload {
          deletedCategoryId: ID
        }

        \\"\\"\\"
        Determines the order of items returned
        \\"\\"\\"
        enum OrderBydirection {
          \\"\\"\\"
          Sort data in ascending order
          \\"\\"\\"
          ASC
          \\"\\"\\"
          Sort data in descending order
          \\"\\"\\"
          DESC
        }
        "
      `);
    });

  it("test get values", async () => {
    api["get internal server"]().run({} as any, async () => {
      await remult.repo(Task).insert([{ title: "task a" }]);
      expect(await remult.repo(Task).count()).toBe(1);
    });
    const { resolvers } = remultGraphql(api);
    expect(
      (await (resolvers.Query.tasks as any)(undefined, {}, {})).length
    ).toBe(1);
  });

  it("test graphql", async () => {
    const { schema, resolvers } = remultGraphql(api);
    api["get internal server"]().run({} as any, async () => {
      await remult.repo(Task).insert([{ title: "task a" }]);
      expect(await remult.repo(Task).count()).toBe(1);
    });

    const yoga = createYoga({
      schema: createSchema({
        typeDefs: schema,
        resolvers,
      }),
    });

    const executor = buildHTTPExecutor({
      fetch: yoga.fetch,
    });

    const result: any = await executor({
      document: parse(/* GraphQL */ `
        query {
          tasks {
            id
            title
            completed
          }
        }
      `),
    });
    expect(result.data).toMatchInlineSnapshot(`
      {
        "tasks": [
          {
            "completed": false,
            "id": 1,
            "title": "task a",
          },
        ],
      }
    `);
  });
});
