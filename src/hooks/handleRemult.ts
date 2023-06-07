// import { DATABASE_URL } from '$env/static/private'
import { remult, SqlDatabase } from 'remult'
import { remultSveltekit } from 'remult/remult-sveltekit'

import { Category } from '../shared/Category'
import { Tag } from '../shared/Tag'
import { Task } from '../shared/Task'
import { TasksController } from '../shared/tasksController'

SqlDatabase.LogToConsole = true

export const handleRemult = remultSveltekit({
  logApiEndPoints: false,
  entities: [Task, Category, Tag],
  controllers: [TasksController],
  getUser: async event => {
    let session = (event as any).session
    if (!session) session = await event?.locals?.getSession()
    return session?.user
  },
  initApi: async () => {},
})
