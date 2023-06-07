// import { DATABASE_URL } from '$env/static/private'
import { entities } from '$shared/_entities'
import { SqlDatabase } from 'remult'
import { remultSveltekit } from 'remult/remult-sveltekit'

import { TasksController } from '../shared/tasksController'

SqlDatabase.LogToConsole = true

export const handleRemult = remultSveltekit({
  logApiEndPoints: false,
  entities,
  controllers: [TasksController],
  getUser: async event => {
    let session = (event as any).session
    if (!session) session = await event?.locals?.getSession()
    return session?.user
  },
  initApi: async () => {},
})
