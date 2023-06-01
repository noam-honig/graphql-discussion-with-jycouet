// import { DATABASE_URL } from '$env/static/private'
import { SqlDatabase } from 'remult'
import { remultSveltekit } from 'remult/remult-sveltekit'

import { Category } from '../shared/Category'
import { Tag } from '../shared/Tag'
import { Task } from '../shared/Task'

SqlDatabase.LogToConsole = true

export const handleRemult = remultSveltekit({
  logApiEndPoints: false,
  entities: [Task, Category, Tag],
  getUser: async event => {
    const session = await event?.locals?.getSession()
    return session?.user
  },
  // dataProvider: await createPostgresConnection({
  //   connectionString: DATABASE_URL,
  // }),
})
