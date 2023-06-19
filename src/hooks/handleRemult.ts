import { entities } from '$shared/_entities'
import { SqlDatabase } from 'remult'
import { remultSveltekit } from 'remult/remult-sveltekit'
import { TasksController } from '../shared/tasksController'

SqlDatabase.LogToConsole = true

export const remultApi = {
  logApiEndPoints: false,
  entities,
  controllers: [TasksController],
  // getUser: async (event: any) => {
  //   let session = (event as any).session
  //   if (!session) session = await event?.locals?.getSession()
  //   return session?.user
  // },
}

export const handleRemult = remultSveltekit(remultApi)
