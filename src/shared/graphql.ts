import { RemultServerCore } from "remult/server";

type Field = {
  key: string;
  args?: string;
  value: string;
  comment?: string;
  isRelation?: boolean;
};

export function remultGraphql(api: RemultServerCore<any>) {
  let server = api["get internal server"]();
  const entities = server.getEntities();

  let types: {
    key: string;
    fields: Field[];
    resultProcessors: ((item: any) => void)[];
  }[] = [];

  let orderByTypes: string[] = [];
  let whereType: string[] = [];
  let whereTypeSubFields: string[] = [];
  let typeQuery: Field[] = [];
  let root: Record<string, any> = {};
  let resolversQuery: Record<string, unknown> = {};
  let resolvers = { Query: resolversQuery };

  function getType(key: string) {
    let t = types.find((t) => t.key === key);
    if (!t) types.push((t = { fields: [], key, resultProcessors: [] }));
    return t;
  }

  for (const meta of entities) {
    const orderByFields: string[] = [];

    let key = meta.key;

    const currentType = getType(key);

    if (key) {
      const argsList =
        `limit: Int, page: Int, ` +
        `orderBy: ${key}OrderBy, ` +
        `where: ${key}Where`;
      typeQuery.push({
        key,
        args: argsList,
        value: `[${key}!]!`,
        comment: `List all \`${key}\``,
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
        let info = entities.find((i) => i.entityType === f.valueType);
        if (info !== undefined) {
          const refKey = info.key;

          currentType.fields.push({
            key: f.key,
            value: `${refKey}${f.allowNull ? "" : "!"}`,
            comment: f.caption,
          });
          currentType.resultProcessors.push((r) => {
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

          let refT = getType(refKey);
          refT.fields.push({
            key,
            args: argsList,
            value: `[${key}!]!`,
            isRelation: true,
            comment: `List all \`${key}\` of \`${refKey}\``,
          });

          refT.resultProcessors.push((r) => {
            const val = r.id;
            r[key] = async (args: any, req: any, gqlInfo: any) => {
              return await root[key](
                {
                  where: { ...args.where, [f.key]: val },
                  options: args.options,
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

        whereTypeSubFields.push(
          blockFormat({
            prefix: `input ${key}Where${f.key}`,
            data: whereFields,
            comment: `Where options for \`${key}.${f.key}\``,
          })
        );
      }

      orderByTypes.push(
        blockFormat({
          prefix: `input ${key}OrderBy`,
          data: orderByFields,
          comment: `OrderBy options for \`${key}\``,
        })
      );

      whereTypeFields.push(`OR: [${key}Where!]`);
      whereType.push(
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
                    currentType.resultProcessors.forEach((z) => z(y));
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
    schema: `${blockFormat({
      prefix: `type Query`,
      data: typeQuery.map((field) => fieldFormat(field)),
      comment: "Represents all Remult entities.",
    })}

${types
  // .sort((a, b) => a.key.localeCompare(b.key))
  .map(({ key, fields }) => {
    return blockFormat({
      prefix: `type ${key}`,
      data: fields
        .sort((a, b) => (a.isRelation ? 1 : 0) - (b.isRelation ? 1 : 0)) // isRelation last
        .map((field) => fieldFormat(field)),
      comment: `Represents \`${key}\` entity.`,
    });
  })
  .join(`\n\n`)}

${orderByTypes.map((x) => x).join("\n\n")}

${whereType.map((x) => x).join("\n\n")}
${whereTypeSubFields.map((x) => x).join("\n\n")}

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
  return `"""
${obj.comment}
"""
${obj.prefix} {
  ${obj.data.join("\n  ")}
}`;
}

function fieldFormat(field: Field) {
  const key_value = `${field.key}${field.args ? ` (${field.args})` : ``}: ${
    field.value
  }`;

  if (field.comment) {
    return `"""
  ${field.comment}
  """
  ${key_value}`;
  }

  return key_value;
}
