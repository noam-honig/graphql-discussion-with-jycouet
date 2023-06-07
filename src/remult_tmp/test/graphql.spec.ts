import { createSchema, createYoga } from 'graphql-yoga'
import { Filter, InMemoryDataProvider, remult } from 'remult'
import { remultExpress, type RemultExpressServer } from 'remult/remult-express'
import { beforeEach, describe, expect, it } from 'vitest'

import { Category } from '../../shared/Category'
import { Task } from '../../shared/Task'
import { TasksController } from '../../shared/tasksController'
import { remultGraphql, translateWhereToRestBody } from '../graphql'

// import { remultSveltekit, type RemultSveltekitServer } from 'remult/remult-sveltekit';

describe('graphql-connection', () => {
  let api: RemultExpressServer
  async function withRemult<T>(what: () => Promise<T>): Promise<T> {
    return await api['get internal server']().run({} as any, what)
  }
  let gql: (gql: string) => Promise<any>
  it('test where translator', async () => {
    const fields = await withRemult(async () => remult.repo(Task).fields)
    expect(
      translateWhereToRestBody(fields, {
        where: {
          title: { eq: 'aaa' },
        },
      }),
    ).toMatchSnapshot()
  })
  it('test where translator in', async () => {
    const meta = await withRemult(async () => remult.repo(Task).metadata)
    const result = translateWhereToRestBody(meta.fields, {
      where: {
        title: {
          in: ['aaa', 'ccc'],
        },
      },
    })
    expect(result).toMatchSnapshot()
    
  })


  it('test where', async () => {
    await withRemult(() =>
      remult.repo(Task).insert(['aaa', 'bbb', 'ccc', 'ddd'].map(x => ({ title: x }))),
    )
    expect(
      (
        await gql(`
    query{
      tasks(where:{}){
        totalCount
      }
    }`)
      ).data.tasks.totalCount,
    ).toBe(4)
  })
  it('test where eq', async () => {
    await withRemult(() =>
      remult.repo(Task).insert(['aaa', 'bbb', 'ccc', 'ddd'].map(x => ({ title: x }))),
    )
    expect(
      (
        await gql(`
    query{
      tasks(where:{
        title:{
          eq:"bbb"
        }
      }){
        totalCount
      }
    }`)
      ).data.tasks.totalCount,
    ).toBe(1)
  })
  it('test where in', async () => {
    await withRemult(() =>
      remult.repo(Task).insert(['aaa', 'bbb', 'ccc', 'ddd'].map(x => ({ title: x }))),
    )
    expect(
      (
        await gql(`
    query{
      tasks(where:{
        title:{
          in:["bbb","ddd"]
        }
      }){
        totalCount
      }
    }`)
      ).data.tasks.totalCount,
    ).toBe(2)
  })
  it('test where or', async () => {
    await withRemult(() =>
      remult.repo(Task).insert(['aaa', 'bbb', 'ccc', 'ddd'].map(x => ({ title: x }))),
    )
    expect(
      (
        await gql(`
    query{
      tasks(where:{
        OR: [{ title: { eq: "aaa" } }, { title: { eq: "bbb" } }],
      }){
        totalCount
      }
    }`)
      ).data.tasks.totalCount,
    ).toBe(2)
  })
  
  it('test where not in', async () => {
    await withRemult(() =>
      remult.repo(Task).insert(['aaa', 'bbb', 'ccc', 'ddd'].map(x => ({ title: x }))),
    )
    expect(
      (
        await gql(`
    query{
      tasks(where:{
        title:{
          nin:["bbb"]
        }
      }){
        totalCount
      }
    }`)
      ).data.tasks.totalCount,
    ).toBe(3)
  })

  it('gets related entities', async () => {
    await withRemult(async () => {
      const cat = await remult.repo(Category).insert([{ name: 'c1' }, { name: 'c2' }])
      return [
        await remult.repo(Task).insert({ title: 'task a', category: cat[0] }),
        await remult.repo(Task).insert({ title: 'task b', category: cat[1] }),
      ]
    })

    const result = await gql(`
    query{
      tasks{
        items{
          title
          category{
            name
            tasks{
              items {
              title
            }
            }
          }
        }
      }
    }`)
    expect(result).toMatchSnapshot()
    expect(result.data.tasks.items[0].category.name).toBe('c1')
    expect(result.data.tasks.items[0].category.tasks.items[0].title).toBe('task a')
    expect(result.data.tasks.items[1].category.name).toBe('c2')
    expect(result.data.tasks.items[1].category.tasks.items[0].title).toBe('task b')
  })
  it('test get single task by id', async () => {
    const tasks = await withRemult(() =>
      remult.repo(Task).insert([{ title: 'aaa' }, { title: 'bbb' }, { title: 'ccc' }]),
    )
    expect(
      await gql(`
    query{
      task(id: ${tasks[1].id}){
        id,
        title
      }
    }`),
    ).toMatchSnapshot()
  })

  it('test count', async () => {
    await withRemult(() =>
      remult.repo(Task).insert([{ title: 'aaa' }, { title: 'bbb' }, { title: 'ccc' }]),
    )
    expect(
      await gql(`
    query{
      tasks{
        totalCount
      }
    }`),
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "tasks": {
            "totalCount": 3,
          },
        },
      }
    `)
  })

  it('test count 2', async () => {
    await withRemult(() =>
      remult.repo(Task).insert([{ title: 'aaa' }, { title: 'bbb' }, { title: 'ccc' }]),
    )
    expect(
      await gql(`
    query{
      tasks(
        where:{
          title:{
            lte:"bbb"
          }
        }
      ){
        totalCount
      }
    }`),
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "tasks": {
            "totalCount": 2,
          },
        },
      }
    `)
  })
  it('test mutation delete', async () => {
    await withRemult(
      async () =>
        await remult
          .repo(Task)
          .insert([{ title: 'task a' }, { title: 'task b' }, { title: 'task c' }]),
    )
    expect(
      await gql(`
      mutation delete{
        deleteTask(id:2) {
          id
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

    const result = await gql(`
    query Tasks {
      tasks(orderBy: { title: ASC }) {
        items {
          id
          title
          completed
        }
      }
    }`)

    expect(result).toMatchSnapshot()
  })

  it('test basics', async () => {
    // rmv removeComments is very handy for testing!
    const { typeDefs } = remultGraphql(api, {
      removeComments: true,
    })

    expect(typeDefs).toMatchSnapshot()
  })
  beforeEach(async () => {
    // api = remultSveltekit({
    api = remultExpress({
      logApiEndPoints: false, // We don't need this in tests
      dataProvider: new InMemoryDataProvider(),
      entities: [Task, Category],
      controllers: [TasksController],
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
})

remult.authenticated()

