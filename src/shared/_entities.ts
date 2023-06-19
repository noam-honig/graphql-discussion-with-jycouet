import { remult, type Repository } from 'remult'
import { Category } from './Category'
import { Task } from './Task'

export const entitiesObj = {
  tasks: Task,
  categories: Category,
}

export const entitiesName = Object.keys(entitiesObj)
export const entities = Object.values(entitiesObj)

export const getRepo = (entity?: 'tasks' | 'categories' | string): Repository<Task | Category> => {
  if (!entity) {
    throw new Error(`Need an entity!`)
  }

  try {
    // 100% sure it can be better!
    // @ts-ignore
    return remult.repo(entitiesObj[entity])
  } catch (error) {
    // console.error(error)
  }

  throw new Error(`Entity ${entity} not found`)
}
