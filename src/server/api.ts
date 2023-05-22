import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/task";
import { Category } from "../shared/Category";

export const api = remultExpress({
  entities: [Task, Category],
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
