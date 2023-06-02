import { remult, type Repository } from 'remult'

import { Category } from './Category'
import { Tag } from './Tag'
import { Task } from './Task'

export const entitiesObj = { Task: Task, Category: Category, Tag: Tag } as const

export const entitiesName = Object.keys(entitiesObj)
export const entities = Object.values(entitiesObj)

export const getRepo = (entity?: string) => {
  if (!entity) {
    throw new Error(`Need an entity!`)
  }

  // @ts-ignore
  const found = entitiesObj[entity]
  if (!found) {
    throw new Error(`Entity ${entity} not found`)
  }
  return remult.repo(found) as Repository<any>
}
