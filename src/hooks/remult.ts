import { DATABASE_URL } from '$env/static/private'
import { SqlDatabase } from 'remult'
import { createPostgresConnection } from 'remult/postgres'
import { remultSveltekit } from 'remult/remult-sveltekit'

import { Category } from '../shared/Category'
import { Tag } from '../shared/Tag'
import { Task } from '../shared/Task'

SqlDatabase.LogToConsole = true

export const remultApi = remultSveltekit({
  logApiEndPoints: false,
  entities: [Task, Category, Tag],
  // dataProvider: await createPostgresConnection({
  //   connectionString: DATABASE_URL,
  // }),
})
