import { remultSveltekit } from 'remult/remult-sveltekit'

import { Category } from '../shared/Category'
import { Task } from '../shared/Task'

export const remultApi = remultSveltekit({
  logApiEndPoints: false,
  entities: [Task, Category],
})
