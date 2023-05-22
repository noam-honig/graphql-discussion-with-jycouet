import { RemultServerCore } from "remult/server";

export function remultGraphql(api: RemultServerCore<any>) {
  let server = api["get internal server"]();
  const entities = server.getEntities();
  let types: {
    key: string;
    fields: string;
    moreFields: string;
    resultProcessors: ((item: any) => void)[];
  }[] = [];
  let sortTypes = "";
  let whereTypes = "";
  let query = "";
  let root: Record<string, any> = {};
  let resolversQuery: Record<string, unknown> = {};
  let resolvers = { Query: resolversQuery };

  function getType(key: string) {
    let t = types.find((t) => t.key === key);
    if (!t)
      types.push(
        (t = { fields: "", key, moreFields: "", resultProcessors: [] })
      );
    return t;
  }

  for (const meta of entities) {
    let whereFields = "";
    let sortFields = "";

    let key = meta.key;

    const t = getType(key);
    let q =
      "\n\t" +
      key +
      `(limit: Int, page: Int, ` +
      `orderBy: ${key}OrderBy, ` +
      `where: ${key}Where): ` +
      `[${getTypeName(key)}]`;

    if (key) {
      const whereFieldMap = new Map<string, string>();

      for (const f of meta.fields) {
        {
          let type = "String";
          switch (f.valueType) {
            case Boolean:
              type = "Boolean";
              break;
            case Number:
              {
                if (f.valueConverter?.fieldTypeInDb == "integer") type = "Int";
                else type = "Float";
              }
              break;
          }
          let info = entities.find((i) => i.entityType === f.valueType);
          if (info !== undefined) {
            const refKey = info.key;
            t.fields += "\n\t" + f.key + ":" + getTypeName(refKey);
            t.resultProcessors.push((r) => {
              const val = r[f.key];
              if (val === null || val === undefined) return null;
              r[f.key] = async (args: any, req: any, gqlInfo: any) => {
                const queryResult: any[] = await root[refKey](
                  {
                    ...args.where,
                    filter: { id: val },
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
            refT.moreFields += q;
            refT.resultProcessors.push((r) => {
              const val = r.id;
              r[key] = async (args: any, req: any, gqlInfo: any) => {
                return await root[key](
                  {
                    filter: { ...args.where, [f.key]: val },
                    options: args.options,
                  },
                  req,
                  gqlInfo
                );
              };
            });
          } else t.fields += "\n\t" + f.key + ":" + type;
          const addFilter = (operator: string, theType?: string) => {
            if (!theType) theType = type;
            whereFields += "\n\t" + f.key + operator + ":" + theType;
            whereFieldMap.set(
              f.key + operator.replace("_", "."),
              f.key + operator
            );
          };
          for (const operator of ["", "_ne"]) {
            addFilter(operator);
          }
          if (f.valueType === String || f.valueType === Number)
            for (const operator of ["_gt", "_gte", "_lt", "_lte"]) {
              addFilter(operator);
            }
          if (f.valueType === String)
            for (const operator of ["_st", "_contains"]) {
              addFilter(operator);
            }
          if (f.allowNull) addFilter("_null", "Boolean");
          addFilter("_in", "[" + type + "]");
        }

        // sorting
        sortFields += "\n\t" + f.key + ":OrderBydirection";
      }

      sortTypes += `input ${key}OrderBy {
        ${sortFields}
}\n`;

      whereTypes +=
        "input " +
        key +
        "Where{" +
        whereFields +
        "\n\tOR:[" +
        key +
        "Where]\n}\n";
      query += q;
      root[key] = async (arg1: any, req: any) => {
        const { limit, page, orderBy, filter } = arg1;

        return new Promise(async (res, error) => {
          server.run(req, async () => {
            let dApi = await server.getDataApi(req, meta);
            let result: any;
            let err: any;
            await dApi.getArray(
              {
                success: (x) =>
                  (result = x.map((y: any) => {
                    t.resultProcessors.forEach((z) => z(y));
                    return y;
                  })),
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
                  if (filter) {
                    console.log(`filter`, filter);

                    let f = whereFieldMap.get(key);
                    if (f) return filter[f];
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

  if (query.length > 0) {
    query = `type Query {${query}
}`;
  }

  return {
    resolvers,
    rootValue: root,
    schema: `${types
      .map(
        ({ key, fields, moreFields }) =>
          "type " + getTypeName(key) + "{" + fields + moreFields + "\n}\n"
      )
      .join("")}
${query}
${whereTypes}
${sortTypes}
enum OrderBydirection {
  ASC
  DESC
}
`,
  };
}

function getTypeName(key: string) {
  return key;
}
