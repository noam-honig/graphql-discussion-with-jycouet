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
      const { schema } = remultGraphql(api);

      expect(schema).toMatchInlineSnapshot(`
        "\\"\\"\\"
        Represents all Remult entities.
        \\"\\"\\"
        type Query {
          \\"\\"\\"
          List all \`tasks\`
          \\"\\"\\"
          tasks (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): [tasks!]!
          \\"\\"\\"
          List all \`categories\`
          \\"\\"\\"
          categories (limit: Int, page: Int, orderBy: categoriesOrderBy, where: categoriesWhere): [categories!]!
        }

        \\"\\"\\"
        Represents \`tasks\` entity.
        \\"\\"\\"
        type tasks {
          \\"\\"\\"
          Id
          \\"\\"\\"
          id: Int!
          \\"\\"\\"
          The Title
          \\"\\"\\"
          title: String!
          \\"\\"\\"
          Is it completed?
          \\"\\"\\"
          completed: Boolean!
          \\"\\"\\"
          Category
          \\"\\"\\"
          category: categories
        }

        \\"\\"\\"
        Represents \`categories\` entity.
        \\"\\"\\"
        type categories {
          \\"\\"\\"
          Id
          \\"\\"\\"
          id: String!
          \\"\\"\\"
          Name
          \\"\\"\\"
          name: String!
          \\"\\"\\"
          List all \`tasks\` of \`categories\`
          \\"\\"\\"
          tasks (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): [tasks!]!
        }

        \\"\\"\\"
        OrderBy options for \`tasks\`
        \\"\\"\\"
        input tasksOrderBy {
          id: OrderBydirection
          title: OrderBydirection
          completed: OrderBydirection
          category: OrderBydirection
        }

        \\"\\"\\"
        OrderBy options for \`categories\`
        \\"\\"\\"
        input categoriesOrderBy {
          id: OrderBydirection
          name: OrderBydirection
        }

        \\"\\"\\"
        Where options for \`tasks\`
        \\"\\"\\"
        input tasksWhere {
          id: tasksWhereid
          title: tasksWheretitle
          completed: tasksWherecompleted
          category: tasksWherecategory
          OR: [tasksWhere!]
        }

        \\"\\"\\"
        Where options for \`categories\`
        \\"\\"\\"
        input categoriesWhere {
          id: categoriesWhereid
          name: categoriesWherename
          OR: [categoriesWhere!]
        }
        \\"\\"\\"
        Where options for \`tasks.id\`
        \\"\\"\\"
        input tasksWhereid {
          eq: Int
          ne: Int
          gt: Int
          gte: Int
          lt: Int
          lte: Int
          in: [Int!]
        }

        \\"\\"\\"
        Where options for \`tasks.title\`
        \\"\\"\\"
        input tasksWheretitle {
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

        \\"\\"\\"
        Where options for \`tasks.completed\`
        \\"\\"\\"
        input tasksWherecompleted {
          eq: Boolean
          ne: Boolean
          in: [Boolean!]
        }

        \\"\\"\\"
        Where options for \`tasks.category\`
        \\"\\"\\"
        input tasksWherecategory {
          eq: String
          ne: String
          null: Boolean
          in: [String!]
        }

        \\"\\"\\"
        Where options for \`categories.id\`
        \\"\\"\\"
        input categoriesWhereid {
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

        \\"\\"\\"
        Where options for \`categories.name\`
        \\"\\"\\"
        input categoriesWherename {
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

    const result:any = await executor({
      document: parse(/* GraphQL */ `
        query {
          tasks {
            title
          }
        }
      `),
    });
    expect(result.data.tasks[0].title).toBe("task a")
  });
});
