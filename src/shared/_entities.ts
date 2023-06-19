import { remult, type Repository } from 'remult'
import { Category } from './Category'
import { Tag } from './Tag'
import { Task } from './Task'

export const entitiesObj = {
  tasks: Task,
  categories: Category,
  tags: Tag,
}

export const entitiesName = Object.keys(entitiesObj)
export const entities = Object.values(entitiesObj)

export const getRepo = (
  entity?: 'tasks' | 'categories' | 'tags' | string,
): Repository<Task | Category | Tag> => {
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
