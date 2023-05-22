import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/task";

export const api = remultExpress({
  entities: [Task],
});

// const fn = async () => {
//   const remult = await api.getRemult();
//   remult.repo(Task).find({
//     limit: 2,
//     page: 1,
//     where: {
// id: {

// }
//     },
//     orderBy: {
//       completed: "asc",
//     },
//   });
// };
