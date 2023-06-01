import type { EntityMetadata, Field } from 'remult'
import type { RemultServerCore } from 'remult/server'
import type { DataApi, DataApiResponse } from 'remult/src/data-api'

type Enum = { Enum: true }

type Arg = {
  key: string
  value: Enum | string
  comment?: string
}

type Field = Arg & {
  args?: Arg[]
  order?: number
}

type Kind = 'type_impl_node' | 'type' | 'input' | 'enum' | 'interface'

type GraphQLType = {
  kind: Kind
  key: string
  comment?: string
  fields: Field[]
  query: {
    orderBy: string[]
    whereType: string[]
    whereTypeSubFields: string[]
    resultProcessors: ((item: any) => void)[]
  }
  mutation: {
    create: {
      input?: GraphQLType
      payload?: GraphQLType
    }
    update: {
      input?: GraphQLType
      payload?: GraphQLType
    }
    delete: {
      payload?: GraphQLType
    }
  }
  order?: number
}

let _removeComments = false
export function remultGraphql(api: RemultServerCore<any>, options?: { removeComments?: boolean }) {
  const { removeComments } = {
    removeComments: false,
    ...options,
  }

  if (removeComments) {
    _removeComments = true
  }

  const server = api['get internal server']()
  const entities = server.getEntities()

  const types: GraphQLType[] = []

  const root: Record<string, any> = {}
  const resolversQuery: Record<string, unknown> = {}
  const resolversMutation: Record<string, unknown> = {}
  const resolvers = { Query: resolversQuery, Mutation: resolversMutation }

  function upsertTypes(key: string, kind: Kind = 'type', order = 0) {
    let t = types.find(t => t.key === key)
    if (!t) {
      types.push(
        (t = {
          key,
          kind,
          fields: [],
          query: {
            orderBy: [],
            whereType: [],
            whereTypeSubFields: [],
            resultProcessors: [],
          },
          mutation: {
            create: {},
            update: {},
            delete: {},
          },
          order,
        }),
      )
      if (kind === 'type_impl_node') {
        t.fields.push({ ...argNodeId, order: 111 })
      }
    }
    return t
  }

  // Where - GraphQL primitives
  for (const whereType of ['String', 'Int', 'Float', 'Boolean', 'ID']) {
    const currentWhere = upsertTypes(`Where${whereType}`, 'input', 20)
    const currentWhereNullable = upsertTypes(`Where${whereType}Nullable`, 'input', 20)

    // For everyone
    const operatorType = ['eq', 'ne']
    const operatorTypeArray = ['in', 'nin']
    for (const operator of [...operatorType, ...operatorTypeArray]) {
      const field = {
        key: operator,
        value: operatorTypeArray.includes(operator) ? `[${whereType}!]` : whereType,
      }
      currentWhere.fields.push(field)
      currentWhereNullable.fields.push(field)
    }

    // only for specific types
    if (whereType === 'String' || whereType === 'Int' || whereType === 'Float') {
      for (const operator of ['gt', 'gte', 'lt', 'lte']) {
        const field = {
          key: operator,
          value: whereType,
        }
        currentWhere.fields.push(field)
        currentWhereNullable.fields.push(field)
      }
    }

    if (whereType === 'String') {
      for (const operator of ['st']) {
        const field = {
          key: operator,
          value: whereType,
        }
        currentWhere.fields.push(field)
        currentWhereNullable.fields.push(field)
      }
    }

    // add only for nullable
    currentWhereNullable.fields.push({
      key: 'null',
      value: 'Boolean',
    })
  }

  const root_query = upsertTypes('Query', 'type', -10)
  root_query.comment = `Represents all Remult entities.`
  const argId: Arg = { key: `id`, value: `ID!` }
  const argNodeId: Arg = {
    key: 'nodeId',
    value: `ID!`,
    comment: `The globally unique \`ID\` _(_typename:id)_`,
  }
  const argClientMutationId = { key: 'clientMutationId', value: `String` }

  for (const meta of entities) {
    const orderByFields: string[] = []

    const key = meta.key

    const currentType = upsertTypes(getMetaType(meta), 'type_impl_node')

    if (key) {
      const buildIt = (
        work: (
          dataApi: DataApi,
          result: DataApiResponse,
          setResult: (result: any) => void,
          arg1: any,
          req: any,
        ) => Promise<void>,
      ) => {
        return async (arg1: any, req: any) => {
          if (req.req) req = req.req //TODO - yoga sends its own request object - and in it you get the original request (need to test with svelte and next)
          return new Promise((res, error) => {
            server.run(req, async () => {
              const dApi = await server.getDataApi(req, meta)
              let result: any
              let err: any
              const response = {
                success: (x: any) => {
                  err = 'success not handled'
                },
                created: () => {
                  err = 'created not handled'
                },
                deleted: () => {
                  err = 'deleted not handled'
                },
                error: (x: any) => (err = x),
                forbidden: () => (err = 'forbidden'),
                notFound: () => (err = 'not found'),
                progress: () => {},
              }
              await work(dApi, response, x => (result = x), arg1, req)
              if (err) {
                error(err)
                return
              }
              res(result)
            })
          })
        }
      }

      const queryArgsList: Arg[] = [
        { key: 'limit', value: 'Int' },
        { key: 'page', value: 'Int' },
        { key: 'orderBy', value: `${key}OrderBy` },
        { key: 'where', value: `${key}Where` },
      ]
      const queryArgsConnection: Arg[] = [
        {
          key: 'limit',
          value: 'Int',
          comment: `
For *page by page* pagination.
Limit the number of result. 
_Side note: \`Math.ceil(totalCount / limit)\` to determine how many pages there are._`,
        },
        {
          key: 'page',
          value: 'Int',
          comment: `
For *page by page* pagination.
Select a dedicated page.`,
        },
        { key: 'orderBy', value: `${key}OrderBy`, comment: `Remult sorting options` },
        { key: 'where', value: `${key}Where`, comment: `Remult filtering options` },
        {
          key: 'first',
          value: 'Int',
          comment: `
For *forward cursor* pagination
Takes the \`first\`: \`n\` elements from the list.`,
        },
        {
          key: 'after',
          value: 'String',
          comment: `
For *forward cursor* pagination
\`after\` this \`cursor\`.`,
        },
        {
          key: 'last',
          value: 'Int',
          comment: `
For *backward cursor* pagination
Takes the \`last\`: \`n\` elements from the list.`,
        },
        {
          key: 'before',
          value: 'String',
          comment: `
For *backward cursor* pagination
\`before\` this \`cursor\`.`,
        },
      ]

      root_query.fields.push({
        key: toPascalCase(getMetaType(meta)),
        args: [argId],
        value: `${getMetaType(meta)}`,
        comment: `Get \`${getMetaType(meta)}\` entity`,
      })
      // list
      root_query.fields.push({
        key,
        args: queryArgsList,
        value: `[${getMetaType(meta)}!]!`,
        comment: `List all \`${getMetaType(
          meta,
        )}\` entity (with pagination, sorting and filtering)`,
      })

      root[key] = buildIt(async (dApi, response, setResult, arg1: any, req: any) => {
        await dApi.getArray(
          {
            ...response,
            success: (x: any) => {
              setResult(
                x.map((y: any) => {
                  currentType.query.resultProcessors.forEach(z => z(y))
                  return y
                }),
              )
            },
          },
          {
            get: bridgeQueryOptionsToDataApiGet(arg1),
          },
        )
      })

      resolversQuery[key] = (origItem: any, args: any, req: any, gqlInfo: any) =>
        root[key](args, req, gqlInfo)

      // Connection
      const connectionKey = `${key}Connection`
      root_query.fields.push({
        key: connectionKey,
        args: queryArgsConnection,
        value: `${getMetaType(meta)}Connection`,
        comment: `List all \`${getMetaType(
          meta,
        )}\` entity (with pagination, sorting and filtering)`,
      })

      const connection = upsertTypes(`${getMetaType(meta)}Connection`, 'type')
      connection.fields.push({
        key: 'totalCount',
        value: 'Int!',
      })
      connection.fields.push({
        key: 'edges',
        value: `[${getMetaType(meta)}Edge!]!`,
      })
      connection.fields.push({
        key: 'pageInfo',
        value: `PageInfo!`,
      })

      const edge = upsertTypes(`${getMetaType(meta)}Edge`, 'type')
      edge.fields.push({
        key: 'node',
        value: `${getMetaType(meta)}!`,
      })
      edge.fields.push({
        key: 'cursor',
        value: `String!`,
      })

      root[connectionKey] = buildIt(async (dApi, response, setResult, arg1: any, req: any) => {})

      resolversQuery[connectionKey] = (origItem: any, args: any, req: any, gqlInfo: any) =>
        root[key](args, req, gqlInfo)

      // Mutation

      const root_mutation = upsertTypes('Mutation', 'type', -9)

      // create
      const createInput = `Create${getMetaType(meta)}Input`
      const createPayload = `Create${getMetaType(meta)}Payload`
      const createResolverKey = `create${getMetaType(meta)}`
      root_mutation.fields.push({
        key: createResolverKey,
        args: [{ key: 'input', value: `${createInput}!` }, argClientMutationId],
        value: `${createPayload}`,
        comment: `Create a new \`${getMetaType(meta)}\``,
      })

      currentType.mutation.create.input = upsertTypes(createInput, 'input')

      currentType.mutation.create.payload = upsertTypes(createPayload)
      currentType.mutation.create.payload.fields.push(
        {
          key: `${toPascalCase(getMetaType(meta))}`,
          value: `${getMetaType(meta)}`,
        },
        argClientMutationId,
      )
      root[createResolverKey] = buildIt(async (dApi, response, setResult, arg1: any, req: any) => {
        await dApi.post(
          {
            ...response,
            created: y => {
              currentType.query.resultProcessors.forEach(z => z(y))
              setResult({
                [toPascalCase(getMetaType(meta))]: y,
              })
            },
          },
          arg1.input,
        )
      })
      resolversMutation[createResolverKey] = (origItem: any, args: any, req: any, gqlInfo: any) =>
        root[createResolverKey](args, req, gqlInfo)

      // update
      const updateInput = `Update${getMetaType(meta)}Input`
      const updatePayload = `Update${getMetaType(meta)}Payload`
      const updateResolverKey = `update${getMetaType(meta)}`
      root_mutation.fields.push({
        key: updateResolverKey,
        args: [argId, { key: 'patch', value: `${updateInput}!` }, argClientMutationId],
        value: `${updatePayload}`,
        comment: `Update a \`${getMetaType(meta)}\``,
      })

      currentType.mutation.update.input = upsertTypes(updateInput, 'input')

      currentType.mutation.update.payload = upsertTypes(updatePayload)
      currentType.mutation.update.payload.fields.push(
        {
          key: `${toPascalCase(getMetaType(meta))}`,
          value: `${getMetaType(meta)}`,
        },
        argClientMutationId,
      )
      root[updateResolverKey] = buildIt(async (dApi, response, setResult, arg1: any, req: any) => {
        await dApi.put(
          {
            ...response,
            success: y => {
              currentType.query.resultProcessors.forEach(z => z(y))
              setResult({
                [toPascalCase(getMetaType(meta))]: y,
              })
            },
          },
          arg1.id,
          arg1.patch,
        )
      })
      resolversMutation[updateResolverKey] = (origItem: any, args: any, req: any, gqlInfo: any) =>
        root[updateResolverKey](args, req, gqlInfo)

      // delete
      const deletePayload = `Delete${getMetaType(meta)}Payload`
      const deleteResolverKey = `delete${getMetaType(meta)}`
      root_mutation.fields.push({
        key: deleteResolverKey,
        args: [argId, argClientMutationId],
        value: `${deletePayload}`,
        comment: `Delete a \`${getMetaType(meta)}\``,
      })

      currentType.mutation.delete.payload = upsertTypes(deletePayload)
      const deletedResultKey = `id`
      currentType.mutation.delete.payload.fields.push(
        {
          key: deletedResultKey,
          value: 'ID',
        },
        argClientMutationId,
      )
      root[deleteResolverKey] = buildIt(async (dApi, response, setResult, arg1: any, req: any) => {
        await dApi.delete(
          {
            ...response,
            deleted: () => {
              setResult({ [deletedResultKey]: arg1.id })
            },
          },
          arg1.id,
        )
      })
      resolversMutation[deleteResolverKey] = (origItem: any, args: any, req: any, gqlInfo: any) =>
        root[deleteResolverKey](args, req, gqlInfo)

      const whereTypeFields: string[] = []
      for (const f of meta.fields) {
        let type = 'String'
        switch (f.valueType) {
          case Boolean:
            type = 'Boolean'
            break
          case Number:
            {
              if (
                f.valueConverter?.fieldTypeInDb === 'integer' ||
                f.valueConverter?.fieldTypeInDb === 'autoincrement'
              )
                type = 'Int'
              else type = 'Float'
            }
            break
        }
        const ref = entities.find((i: any) => i.entityType === f.valueType)
        if (ref !== undefined) {
          // will do: Task.category
          currentType.fields.push({
            key: f.key,
            value: `${getMetaType(ref)}${f.allowNull ? '' : '!'}`,
            comment: f.caption,
          })
          const refKey = ref.key
          currentType.query.resultProcessors.push(r => {
            const val = r[f.key]
            if (val === null || val === undefined) return null
            r[f.key] = async (args: any, req: any, gqlInfo: any) => {
              const queryResult: any[] = await root[refKey](
                {
                  ...args.where,
                  where: { id: val },
                  options: { limit: 1 },
                },
                req,
                gqlInfo,
              )
              if (queryResult.length > 0) return queryResult[0]
              return null
            }
          })

          // will do: Category.tasks
          const refT = upsertTypes(getMetaType(ref), 'type_impl_node')
          refT.fields.push({
            key,
            args: queryArgsList,
            value: `[${getMetaType(meta)}!]!`,
            order: 10,
            comment: `List all \`${getMetaType(meta)}\` of \`${refKey}\``,
          })

          const connectionKey = `${key}Connection`
          refT.fields.push({
            key: connectionKey,
            args: queryArgsConnection,
            value: `${getMetaType(meta)}Connection`,
            order: 11,
          })

          refT.query.resultProcessors.push(r => {
            const val = r.id
            r[key] = async (args: any, req: any, gqlInfo: any) => {
              return await root[key](
                {
                  where: { ...args.where, [f.key]: val },
                  options: { ...args.limit, ...args.page, ...args.orderBy },
                },
                req,
                gqlInfo,
              )
            }
          })
        } else {
          currentType.fields.push({
            key: f.key,
            value: `${type}${f.allowNull ? '' : '!'}`,
            comment: f.caption,
          })
        }

        // sorting
        orderByFields.push(`${f.key}: OrderByDirection`)

        // helper
        const it_is_not_at_ref = ref === undefined

        // where
        if (it_is_not_at_ref) {
          whereTypeFields.push(`${f.key}: Where${type}${f.allowNull ? 'Nullable' : ''}`)
        }

        // TODO Noam: add a `!` for mandatory fields
        // create
        if (!f.dbReadOnly && it_is_not_at_ref) {
          currentType.mutation.create.input.fields.push({
            key: f.key,
            value: `${type}`,
          })
        }

        // update
        if (!f.dbReadOnly && it_is_not_at_ref) {
          currentType.mutation.update.input.fields.push({
            key: f.key,
            value: `${type}`,
          })
        }
      }

      currentType.query.orderBy.push(
        blockFormat({
          prefix: `input ${key}OrderBy`,
          data: orderByFields,
          comment: `OrderBy options for \`${key}\``,
        }),
      )

      whereTypeFields.push(`OR: [${key}Where!]`)
      whereTypeFields.push(`AND: [${key}Where!]`)
      currentType.query.whereType.push(
        blockFormat({
          prefix: `input ${key}Where`,
          data: whereTypeFields,
          comment: `Where options for \`${key}\``,
        }),
      )
    }
  }

  // Add the node interface at the end
  root_query.fields.push({
    key: 'node',
    args: [argNodeId],
    value: `Node`,
    comment: `Grab any Remult entity given it's globally unique \`ID\``,
  })

  const pageInfo = upsertTypes('PageInfo', 'type', 30)
  pageInfo.fields.push({ key: 'endCursor', value: 'String!' })
  pageInfo.fields.push({ key: 'hasNextPage', value: 'Boolean!' })
  pageInfo.fields.push({ key: 'hasPreviousPage', value: 'Boolean!' })
  pageInfo.fields.push({ key: 'startCursor', value: 'String!' })

  const orderByDirection = upsertTypes('OrderByDirection', 'enum', 30)
  orderByDirection.comment = `Determines the order of returned elements`
  orderByDirection.fields.push({
    key: 'ASC',
    value: { Enum: true },
    comment: 'Sort data in ascending order',
  })
  orderByDirection.fields.push({
    key: 'DESC',
    value: { Enum: true },
    comment: 'Sort data in descending order',
  })

  const nodeInterface = upsertTypes('Node', 'interface', 31)
  nodeInterface.comment = `Node interface of remult entities (eg: nodeId: \`Task:1\` so \`__typename:id\`)`
  nodeInterface.fields.push(argNodeId)

  return {
    resolvers,
    rootValue: root,
    typeDefs: `${types
      .sort((a, b) => (a.order ? a.order : 0) - (b.order ? b.order : 0))
      .map(({ key, kind, fields, query, comment }) => {
        const { orderBy, whereType, whereTypeSubFields } = query

        let prefix = `${kind} ${key}`
        if (kind === 'type_impl_node') {
          prefix = `type ${key} implements Node`
        }

        const type = blockFormat({
          prefix,
          data: fields
            .sort((a, b) => (a.order ? a.order : 0) - (b.order ? b.order : 0))
            .map(field => fieldFormat(field)),
          comment: comment ?? `The ${kind} for \`${key}\``,
        })

        const orderByStr = orderBy.length > 0 ? `\n\n${orderBy.join('\n\n')}` : ``
        const whereTypeStr = whereType.length > 0 ? `\n\n${whereType.join('\n\n')}` : ``
        const whereTypeSubFieldsStr =
          whereTypeSubFields.length > 0 ? `\n\n${whereTypeSubFields.join('\n\n')}` : ``
        return `${type}${orderByStr}${whereTypeStr}${whereTypeSubFieldsStr}`
      })
      .join(`\n\n`)}
`,
  }
}

function blockFormat(obj: { prefix: string; data: string[]; comment: string }) {
  if (obj.data.length === 0) {
    return ``
  }

  const str = `${obj.prefix} {
  ${obj.data.join('\n  ')}
}`

  let commentsStr = `"""
${obj.comment}
"""
`

  if (_removeComments) {
    commentsStr = ``
  }

  return `${commentsStr}${str}`
}

function argsFormat(args?: Arg[]) {
  if (args) {
    return `(${args
      .map(arg => {
        let strComment = `
    """
    ${arg.comment}
    """
`
        if (_removeComments || !arg.comment) {
          strComment = ``
        }

        if (strComment) {
          return `${strComment}    ${arg.key}: ${arg.value}
  `
        }

        return `${arg.key}: ${arg.value}`
      })
      .join(', ')})`
  }
  return ``
}

function fieldFormat(field: Field) {
  // First, the comment
  let strComment = `"""
  ${field.comment}
  """
`
  if (_removeComments || !field.comment) {
    strComment = ``
  }

  let key_value = `${field.key}${field.args ? `${argsFormat(field.args)}` : ``}: ${field.value}`
  // It's an enum
  if (typeof field.value === 'object') {
    key_value = `${field.key}`
  }

  return `${strComment}  ${key_value}`
}

function getMetaType(entityMeta: EntityMetadata) {
  return entityMeta.entityType.name
}

function toPascalCase(str: string) {
  return str
    .split('')
    .map((c, i) => (i === 0 ? c.toLowerCase() : c))
    .join('')
}

function bridgeQueryOptionsToDataApiGet(arg1: any) {
  const { limit, page, orderBy, where } = arg1
  return (key: string) => {
    if (limit && key === '_limit') {
      return limit
    }
    if (page && key === '_page') {
      return page
    }
    if (orderBy) {
      if (key === '_sort') {
        const sort_keys: string[] = []
        Object.keys(orderBy).forEach(sort_key => {
          sort_keys.push(sort_key)
        })
        if (sort_keys.length > 0) {
          return sort_keys.join(',')
        }
      } else if (key === '_order') {
        const sort_directions: string[] = []
        Object.keys(orderBy).forEach(sort_key => {
          const direction = orderBy[sort_key].toLowerCase()
          sort_directions.push(direction)
        })
        if (sort_directions.length > 0) {
          return sort_directions.join(',')
        }
      }
    }
    if (where) {
      // TODO Noam: OR management?
      // TODO Noam: AND management?

      const whereAND: string[] = []
      Object.keys(where).forEach(w => {
        const subWhere = where[w]
        Object.keys(subWhere).forEach(sw => {
          let map = `${w}.${sw}`

          if (map.endsWith('.eq')) {
            map = `${w}`
          }

          if (map === key) {
            whereAND.push(subWhere[sw])
            return subWhere[sw]
          }
        })
      })
      if (whereAND.length > 0) {
        return whereAND.join(',')
      }
    }
  }
}
