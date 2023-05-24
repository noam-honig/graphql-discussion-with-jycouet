import { createSchema, createYoga } from 'graphql-yoga'
import { InMemoryDataProvider, remult } from 'remult'
import { remultExpress, type RemultExpressServer } from 'remult/remult-express'
import { beforeEach, describe, expect, it } from 'vitest'

import { Category } from '../../shared/Category'
import { Task } from '../../shared/Task'
import { remultGraphql } from '../graphql'

// import { remultSveltekit, type RemultSveltekitServer } from 'remult/remult-sveltekit';

// let api: RemultSveltekitServer;
let api: RemultExpressServer
describe('graphql-connection', () => {
  beforeEach(async () => {
    // api = remultSveltekit({
    api = remultExpress({
      logApiEndPoints: false, // We don't need this in tests
      dataProvider: new InMemoryDataProvider(),
      entities: [Task, Category],
    })
  })

  it('test basics', async () => {
    // rmv removeComments is very handy for testing!
    const { typeDefs } = remultGraphql(api, {
      removeComments: true,
    })

    expect(typeDefs).toMatchInlineSnapshot(`
			"type Query {
			  task (id: ID!): Task
			  tasks (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): [Task!]!
			  tasksConnection (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): TaskConnection
			  category (id: ID!): Category
			  categories (limit: Int, page: Int, orderBy: categoriesOrderBy, where: categoriesWhere): [Category!]!
			  categoriesConnection (limit: Int, page: Int, orderBy: categoriesOrderBy, where: categoriesWhere): CategoryConnection
			}

			type Mutation {
			  createTask (input: CreateTaskInput!): CreateTaskPayload
			  updateTask (id: ID!, patch: UpdateTaskInput!): UpdateTaskPayload
			  deleteTask (id: ID!): DeleteTaskPayload
			  createCategory (input: CreateCategoryInput!): CreateCategoryPayload
			  updateCategory (id: ID!, patch: UpdateCategoryInput!): UpdateCategoryPayload
			  deleteCategory (id: ID!): DeleteCategoryPayload
			}

			type Task implements Node {
			  nodeId: ID!
			  id: Int!
			  title: String!
			  completed: Boolean!
			  category: Category
			}

			input tasksOrderBy {
			  id: OrderByDirection
			  title: OrderByDirection
			  completed: OrderByDirection
			  category: OrderByDirection
			}

			input tasksWhere {
			  id: WhereInt
			  title: WhereString
			  completed: WhereBoolean
			  OR: [tasksWhere!]
			}

			type TaskConnection {
			  totalCount: Int!
			  edges: [TaskEdge!]!
			  pageInfo: PageInfo!
			}

			type TaskEdge {
			  node: Task!
			  cursor: String!
			}

			input CreateTaskInput {
			  title: String
			  completed: Boolean
			}

			type CreateTaskPayload {
			  task: Task
			}

			input UpdateTaskInput {
			  title: String
			  completed: Boolean
			}

			type UpdateTaskPayload {
			  task: Task
			}

			type DeleteTaskPayload {
			  deletedTaskId: ID
			}

			type Category implements Node {
			  nodeId: ID!
			  id: String!
			  name: String!
			  tasks (limit: Int, page: Int, orderBy: tasksOrderBy, where: tasksWhere): [Task!]!
			}

			input categoriesOrderBy {
			  id: OrderByDirection
			  name: OrderByDirection
			}

			input categoriesWhere {
			  id: WhereString
			  name: WhereString
			  OR: [categoriesWhere!]
			}

			type CategoryConnection {
			  totalCount: Int!
			  edges: [CategoryEdge!]!
			  pageInfo: PageInfo!
			}

			type CategoryEdge {
			  node: Category!
			  cursor: String!
			}

			input CreateCategoryInput {
			  id: String
			  name: String
			}

			type CreateCategoryPayload {
			  category: Category
			}

			input UpdateCategoryInput {
			  id: String
			  name: String
			}

			type UpdateCategoryPayload {
			  category: Category
			}

			type DeleteCategoryPayload {
			  deletedCategoryId: ID
			}

			input WhereString {
			  eq: String
			  ne: String
			  in: [String!]
			  gt: String
			  gte: String
			  lt: String
			  lte: String
			  st: String
			}

			input WhereStringNullable {
			  eq: String
			  ne: String
			  in: [String!]
			  gt: String
			  gte: String
			  lt: String
			  lte: String
			  st: String
			  null: Boolean
			}

			input WhereInt {
			  eq: Int
			  ne: Int
			  in: [Int!]
			  gt: Int
			  gte: Int
			  lt: Int
			  lte: Int
			}

			input WhereIntNullable {
			  eq: Int
			  ne: Int
			  in: [Int!]
			  gt: Int
			  gte: Int
			  lt: Int
			  lte: Int
			  null: Boolean
			}

			input WhereFloat {
			  eq: Float
			  ne: Float
			  in: [Float!]
			  gt: Float
			  gte: Float
			  lt: Float
			  lte: Float
			}

			input WhereFloatNullable {
			  eq: Float
			  ne: Float
			  in: [Float!]
			  gt: Float
			  gte: Float
			  lt: Float
			  lte: Float
			  null: Boolean
			}

			input WhereBoolean {
			  eq: Boolean
			  ne: Boolean
			  in: [Boolean!]
			}

			input WhereBooleanNullable {
			  eq: Boolean
			  ne: Boolean
			  in: [Boolean!]
			  null: Boolean
			}

			input WhereID {
			  eq: ID
			  ne: ID
			  in: [ID!]
			}

			input WhereIDNullable {
			  eq: ID
			  ne: ID
			  in: [ID!]
			  null: Boolean
			}

			type PageInfo {
			  endCursor: String!
			  hasNextPage: Boolean!
				hasPreviousPage: Boolean!
				startCursor: String!
			}

			\\"\\"\\"
			Determines the order of items returned
			\\"\\"\\"
			enum OrderByDirection {
			  \\"\\"\\"
			  Sort data in ascending order
			  \\"\\"\\"
			  ASC
			  \\"\\"\\"
			  Sort data in descending order
			  \\"\\"\\"
			  DESC
			}

			\\"\\"\\"
			Node interface of remult entities (eg: nodeId: \`Task:1\` so \`Typename:id\`)
			\\"\\"\\"
			interface Node {
			  nodeId: ID!
			}
			"
		`)
  })

  it('test get values', async () => {
    api['get internal server']().run({} as any, async () => {
      await remult.repo(Task).insert([{ title: 'task a' }])
      expect(await remult.repo(Task).count()).toBe(1)
    })
    const { resolvers } = remultGraphql(api)
    expect((await (resolvers.Query.tasks as any)(undefined, {}, {})).length).toBe(1)
  })

  it('test graphql', async () => {
    const { typeDefs, resolvers } = remultGraphql(api)

    const yoga = createYoga({
      schema: createSchema({
        typeDefs,
        resolvers,
      }),
    })

    await api['get internal server']().run({} as any, async () => {
      await remult.repo(Task).insert([{ title: 'task c' }])
      await remult.repo(Task).insert([{ title: 'task b' }])
      await remult.repo(Task).insert([{ title: 'task a' }])
      expect(await remult.repo(Task).count()).toBe(3)
    })

    const result = await yoga.getResultForParams({
      request: new Request('http://...'),
      params: {
        query: /* GraphQL */ `
          query Tasks {
            tasks(orderBy: { title: ASC }) {
              id
              title
              completed
            }
          }
        `,
      },
    })

    expect(result).toMatchInlineSnapshot(`
			{
			  "data": {
			    "tasks": [
			      {
			        "completed": false,
			        "id": 3,
			        "title": "task a",
			      },
			      {
			        "completed": false,
			        "id": 2,
			        "title": "task b",
			      },
			      {
			        "completed": false,
			        "id": 1,
			        "title": "task c",
			      },
			    ],
			  },
			}
		`)
  })
})
