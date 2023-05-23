import { EntityMetadata, Field } from "remult";
import { RemultServerCore } from "remult/server";

type Field = {
  key: string;
  args?: string;
  value: string;
  comment?: string;
  order?: number;
};

type GraphQLType = {
  key: string;
  kind: "type" | "input";
  fields: Field[];
  query: {
    orderBy: string[];
    whereType: string[];
    whereTypeSubFields: string[];
    resultProcessors: ((item: any) => void)[];
  };
  mutation: {
    create: {
      input?: GraphQLType;
      payload?: GraphQLType;
    };
    update: {
      input?: GraphQLType;
      payload?: GraphQLType;
    };
    delete: {
      payload?: GraphQLType;
    };
  };
  order?: number;
};

let _removeComments = false;
export function remultGraphql(
  api: RemultServerCore<any>,
  options?: { removeComments?: Boolean }
) {
  const { removeComments } = { removeComments: false, ...options };

  if (removeComments) {
    _removeComments = true;
  }

  let server = api["get internal server"]();
  const entities = server.getEntities();

  let types: GraphQLType[] = [];

  let root: Record<string, any> = {};
  let resolversQuery: Record<string, unknown> = {};
  let resolvers = { Query: resolversQuery };

  function upsertTypes(
    key: string,
    kind: "type" | "input" = "type",
    order: number = 0
  ) {
    let t = types.find((t) => t.key === key);
    if (!t)
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
        })
      );
    return t;
  }

  for (const meta of entities) {
    const orderByFields: string[] = [];

    let key = meta.key;

    const currentType = upsertTypes(getMetaType(meta));

    if (key) {
      const root_query = upsertTypes("Query", "type", -10);
      const queryArgsList =
        `limit: Int, page: Int, ` +
        `orderBy: ${key}OrderBy, ` +
        `where: ${key}Where`;

      root_query.fields.push({
        key,
        args: queryArgsList,
        value: `[${getMetaType(meta)}!]!`,
        comment: `List all \`${getMetaType(
          meta
        )}\` entity (with pagination, sorting and filtering)`,
      });

      const root_mutation = upsertTypes("Mutation", "type", -9);

      // create
      const createInput = `${getMetaType(meta)}CreateInput`;
      const createPayload = `${getMetaType(meta)}CreatePayload`;
      root_mutation.fields.push({
        key: `create${getMetaType(meta)}`,
        args: `input: ${createInput}!`,
        value: `${createPayload}`,
        comment: `Create a new \`${getMetaType(meta)}\``,
      });
      currentType.mutation.create.input = upsertTypes(createInput, "input");

      currentType.mutation.create.payload = upsertTypes(createPayload);
      currentType.mutation.create.payload.fields.push({
        key: `${toPascalCase(getMetaType(meta))}`,
        value: `${getMetaType(meta)}`,
      });

      // update
      const updateInput = `${getMetaType(meta)}UpdateInput`;
      const updatePayload = `${getMetaType(meta)}UpdatePayload`;
      root_mutation.fields.push({
        key: `update${getMetaType(meta)}`,
        args: `id: ID!, patch: ${updateInput}!`,
        value: `${updatePayload}`,
        comment: `Update a \`${getMetaType(meta)}\``,
      });

      currentType.mutation.update.input = upsertTypes(updateInput, "input");

      currentType.mutation.update.payload = upsertTypes(updatePayload);
      currentType.mutation.update.payload.fields.push({
        key: `${toPascalCase(getMetaType(meta))}`,
        value: `${getMetaType(meta)}`,
      });

      // delete
      const deletePayload = `${getMetaType(meta)}DeletePayload`;
      root_mutation.fields.push({
        key: `delete${getMetaType(meta)}`,
        args: `id: ID!`,
        value: `${deletePayload}`,
        comment: `Delete a \`${getMetaType(meta)}\``,
      });

      currentType.mutation.delete.payload = upsertTypes(deletePayload);
      currentType.mutation.delete.payload.fields.push({
        key: `deleted${getMetaType(meta)}Id`,
        value: "ID",
      });

      const whereTypeFields: string[] = [];
      for (const f of meta.fields) {
        let whereFields: string[] = [];
        let type = "String";
        switch (f.valueType) {
          case Boolean:
            type = "Boolean";
            break;
          case Number:
            {
              if (
                f.valueConverter?.fieldTypeInDb === "integer" ||
                f.valueConverter?.fieldTypeInDb === "autoincrement"
              )
                type = "Int";
              else type = "Float";
            }
            break;
        }
        let ref = entities.find((i) => i.entityType === f.valueType);
        if (ref !== undefined) {
          // will do: Task.category
          currentType.fields.push({
            key: f.key,
            value: `${getMetaType(ref)}${f.allowNull ? "" : "!"}`,
            comment: f.caption,
          });
          const refKey = ref.key;
          currentType.query.resultProcessors.push((r) => {
            const val = r[f.key];
            if (val === null || val === undefined) return null;
            r[f.key] = async (args: any, req: any, gqlInfo: any) => {
              const queryResult: any[] = await root[refKey](
                {
                  ...args.where,
                  where: { id: val },
                  options: { limit: 1 },
                },
                req,
                gqlInfo
              );
              if (queryResult.length > 0) return queryResult[0];
              return null;
            };
          });

          // will do: Category.tasks
          let refT = upsertTypes(getMetaType(ref));
          refT.fields.push({
            key,
            args: queryArgsList,
            value: `[${getMetaType(meta)}!]!`,
            order: 10,
            comment: `List all \`${getMetaType(meta)}\` of \`${refKey}\``,
          });
          refT.query.resultProcessors.push((r) => {
            const val = r.id;
            r[key] = async (args: any, req: any, gqlInfo: any) => {
              return await root[key](
                {
                  where: { ...args.where, [f.key]: val },
                  options: { ...args.limit, ...args.page, ...args.orderBy },
                },
                req,
                gqlInfo
              );
            };
          });
        } else {
          currentType.fields.push({
            key: f.key,
            value: `${type}${f.allowNull ? "" : "!"}`,
            comment: f.caption,
          });
        }
        const addFilter = (operator: string, theType?: string) => {
          if (!theType) theType = type;
          whereFields.push(operator + ": " + theType);
        };
        for (const operator of ["eq", "ne"]) {
          addFilter(operator);
        }
        if (f.valueType === String || f.valueType === Number)
          for (const operator of ["gt", "gte", "lt", "lte"]) {
            addFilter(operator);
          }
        if (f.valueType === String)
          for (const operator of ["st", "contains"]) {
            addFilter(operator);
          }
        if (f.allowNull) addFilter("null", "Boolean");
        addFilter("in", "[" + type + "!]");

        // sorting
        orderByFields.push(`${f.key}: OrderBydirection`);

        // where
        whereTypeFields.push(`${f.key}: ${key}Where${f.key}`);
        currentType.query.whereTypeSubFields.push(
          blockFormat({
            prefix: `input ${key}Where${f.key}`,
            data: whereFields,
            comment: `Where options for \`${key}.${f.key}\``,
          })
        );

        // create
        // JYC TODO rmv id
        currentType.mutation.create.input.fields.push({
          key: f.key,
          value: `${type}${f.allowNull ? "" : "!"}`,
        });

        // create
        // JYC TODO rmv id
        currentType.mutation.update.input.fields.push({
          key: f.key,
          value: `${type}${f.allowNull ? "" : "!"}`,
        });
      }

      currentType.query.orderBy.push(
        blockFormat({
          prefix: `input ${key}OrderBy`,
          data: orderByFields,
          comment: `OrderBy options for \`${key}\``,
        })
      );

      whereTypeFields.push(`OR: [${key}Where!]`);
      currentType.query.whereType.push(
        blockFormat({
          prefix: `input ${key}Where`,
          data: whereTypeFields,
          comment: `Where options for \`${key}\``,
        })
      );

      root[key] = async (arg1: any, req: any) => {
        const { limit, page, orderBy, where } = arg1;

        return new Promise(async (res, error) => {
          server.run(req, async () => {
            let dApi = await server.getDataApi(req, meta);
            let result: any;
            let err: any;
            await dApi.getArray(
              {
                success: (x) => {
                  return (result = x.map((y: any) => {
                    currentType.query.resultProcessors.forEach((z) => z(y));
                    return y;
                  }));
                },
                created: () => {},
                deleted: () => {},
                error: (x) => (err = x),
                forbidden: () => (err = "forbidden"),
                notFound: () => (err = "not found"),
                progress: () => {},
              },
              {
                get: (key) => {
                  if (limit && key === "_limit") {
                    return limit;
                  }
                  if (page && key === "_page") {
                    return page;
                  }
                  if (orderBy) {
                    if (key === "_sort") {
                      const sort_keys: string[] = [];
                      Object.keys(orderBy).forEach((sort_key) => {
                        sort_keys.push(sort_key);
                      });
                      if (sort_keys.length > 0) {
                        return sort_keys.join(",");
                      }
                    } else if (key === "_order") {
                      const sort_directions: string[] = [];
                      Object.keys(orderBy).forEach((sort_key) => {
                        const direction = orderBy[sort_key].toLowerCase();
                        sort_directions.push(direction);
                      });
                      if (sort_directions.length > 0) {
                        return sort_directions.join(",");
                      }
                    }
                  }
                  if (where) {
                    // TODO: OR management?

                    const whereAND: string[] = [];
                    Object.keys(where).forEach((w) => {
                      const subWhere = where[w];
                      Object.keys(subWhere).forEach((sw) => {
                        let map = `${w}.${sw}`;

                        if (map.endsWith(".eq")) {
                          map = `${w}`;
                        }

                        if (map === key) {
                          whereAND.push(subWhere[sw]);
                          return subWhere[sw];
                        }
                      });
                    });
                    if (whereAND.length > 0) {
                      return whereAND.join(",");
                    }
                  }
                },
              }
            );
            if (err) {
              error(err);
              return;
            }
            res(result);
          });
        });
      };

      resolversQuery[key] = (
        origItem: any,
        args: any,
        req: any,
        gqlInfo: any
      ) => root[key](args, req, gqlInfo);
    }
  }

  return {
    resolvers,
    rootValue: root,
    schema: `${types
      .sort((a, b) => (a.order ? a.order : 0) - (b.order ? b.order : 0))
      .map(({ key, kind, fields, query }) => {
        const { orderBy, whereType, whereTypeSubFields } = query;
        const type = blockFormat({
          prefix: `${kind} ${key}`,
          data: fields
            .sort((a, b) => (a.order ? a.order : 0) - (b.order ? b.order : 0))
            .map((field) => fieldFormat(field)),
          comment:
            key === "Query"
              ? `Represents all Remult entities.`
              : key === "Mutation"
              ? `Represents all Remult Mutations available on Remult.`
              : `Represents \`${key}\` entity.`,
        });

        const orderByStr =
          orderBy.length > 0 ? `\n\n${orderBy.join("\n\n")}` : ``;
        const whereTypeStr =
          whereType.length > 0 ? `\n\n${whereType.join("\n\n")}` : ``;
        const whereTypeSubFieldsStr =
          whereTypeSubFields.length > 0
            ? `\n\n${whereTypeSubFields.join("\n\n")}`
            : ``;
        return `${type}${orderByStr}${whereTypeStr}${whereTypeSubFieldsStr}`;
      })
      .join(`\n\n`)}

${schemaGlobal}
`,
  };
}

const schemaGlobal = `"""
Determines the order of items returned
"""
enum OrderBydirection {
  """
  Sort data in ascending order
  """
  ASC
  """
  Sort data in descending order
  """
  DESC
}`;

function blockFormat(obj: { prefix: string; data: string[]; comment: string }) {
  if (obj.data.length === 0) {
    return ``;
  }

  const str = `${obj.prefix} {
  ${obj.data.join("\n  ")}
}`;

  let commentsStr = `"""
${obj.comment}
"""
`;

  if (_removeComments) {
    commentsStr = ``;
  }

  return `${commentsStr}${str}`;
}

function fieldFormat(field: Field) {
  const key_value = `${field.key}${field.args ? ` (${field.args})` : ``}: ${
    field.value
  }`;

  if (!_removeComments && field.comment) {
    return `"""
  ${field.comment}
  """
  ${key_value}`;
  }

  return key_value;
}

function getMetaType(entityMeta: EntityMetadata) {
  return entityMeta.entityType.name;
}

function toPascalCase(str: string) {
  return str
    .split("")
    .map((c, i) => (i === 0 ? c.toLowerCase() : c))
    .join("");
}
