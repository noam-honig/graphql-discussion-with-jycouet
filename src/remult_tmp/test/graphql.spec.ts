import { createSchema, createYoga } from 'graphql-yoga'
import { InMemoryDataProvider, remult } from 'remult'
import { remultExpress, type RemultExpressServer } from 'remult/remult-express'
import { beforeEach, describe, expect, it } from 'vitest'

import { Category } from '../../shared/Category'
import { Task } from '../../shared/Task'
import { remultGraphql } from '../graphql'

// import { remultSveltekit, type RemultSveltekitServer } from 'remult/remult-sveltekit';

describe('graphql-connection', () => {
  let api: RemultExpressServer
  async function withRemult<T>(what: () => Promise<T>): Promise<T> {
    return await api['get internal server']().run({} as any, what)
  }
  let gql: (gql: string) => Promise<any>

  beforeEach(async () => {
    // api = remultSveltekit({
    api = remultExpress({
      logApiEndPoints: false, // We don't need this in tests
      dataProvider: new InMemoryDataProvider(),
      entities: [Task, Category],
    })

    const { typeDefs, resolvers } = remultGraphql(api)

    const yoga = createYoga({
      schema: createSchema({
        typeDefs,
        resolvers,
      }),
    })

    gql = async (query: string) => {
      return await yoga.getResultForParams({
        request: {} as any,
        params: {
          query,
        },
      })
    }
  })

  it('test mutation delete', async () => {
    await withRemult(
      async () =>
        await remult
          .repo(Task)
          .insert([{ title: 'task a' }, { title: 'task b' }, { title: 'task c' }]),
    )
    expect(
      await gql(`mutation delete{
      deleteTask(id:2){
        deletedTaskId
      }
    }`),
    ).toMatchSnapshot()
    expect(await withRemult(async () => await remult.repo(Task).find())).toMatchSnapshot()
  })

  it('test mutation create', async () => {
    const result = await gql(`
    mutation {
      createTask(input: {title: "testing"}) {
        task {
          id
          title
        }
      }
    }`)
    expect(result).toMatchSnapshot()
    expect(await withRemult(async () => await remult.repo(Task).find())).toMatchSnapshot()
  })

  it('test mutation update', async () => {
    await withRemult(async () => await remult.repo(Task).insert({ title: 'aaa' }))

    const result = await gql(`
       mutation {
         updateTask(id:1, patch: {title: "bbb"}) {
           task {
             id
             title
           }
         }
      }`)
    expect(result).toMatchSnapshot()
  })

  it('test graphql', async () => {
    await withRemult(async () => {
      await remult.repo(Task).insert([{ title: 'task c' }])
      await remult.repo(Task).insert([{ title: 'task b' }])
      await remult.repo(Task).insert([{ title: 'task a' }])
      expect(await remult.repo(Task).count()).toBe(3)
    })

    const result = await gql(/* GraphQL */ `
      query Tasks {
        tasks(orderBy: { title: ASC }) {
          id
          title
          completed
        }
      }
    `)

    expect(result).toMatchSnapshot()
  })

  it('test basics', async () => {
    // rmv removeComments is very handy for testing!
    const { typeDefs } = remultGraphql(api, {
      removeComments: true,
    })

    expect(typeDefs).toMatchSnapshot()
  })

  it('test get values', async () => {
    await withRemult(async () => {
      await remult.repo(Task).insert([{ title: 'task a' }])
      expect(await remult.repo(Task).count()).toBe(1)
    })
    const { resolvers } = remultGraphql(api)
    expect((await (resolvers.Query.tasks as any)(undefined, {}, {})).length).toBe(1)
  })
})
