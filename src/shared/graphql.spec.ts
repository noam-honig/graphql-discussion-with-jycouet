import { RemultExpressServer, remultExpress } from "remult/remult-express";
import { describe, it, expect, beforeEach } from "vitest";
import { Task } from "./task";
import { remultGraphql } from "./graphql";
import { Category } from "./Category";

let api: RemultExpressServer;
describe("test graphql", () => {
  beforeEach(async () => {
    api = remultExpress({
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
});
