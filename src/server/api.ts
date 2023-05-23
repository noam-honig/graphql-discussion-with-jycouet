import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/task";
import { Category } from "../shared/Category";
// import { createPostgresConnection } from "remult/postgres";

// const connectionString =
//   "postgres://postgres:example@127.0.0.1:5433/remult-demo-1";

export const api = remultExpress({
  entities: [Task, Category],
  // dataProvider: createPostgresConnection({
  //   configuration: {},
  //   connectionString, // default: process.env["DATABASE_URL"]
  // }),
});

// const fn = async () => {
//   const remult = await api.getRemult();
//   remult.repo(Task).find({
//     limit: 2,
//     page: 1,
//     where: {
//       id: {},
//     },
//     orderBy: {
//       category: 'asc', JYC TODO: Should we be able to do this?
//       completed: "asc",
//     },
//   });
// };
