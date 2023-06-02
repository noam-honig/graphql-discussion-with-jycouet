import type { ClassType } from 'remult/classType'

import { Category } from './Category'
import { Tag } from './Tag'
import { Task } from './Task'

export const entities = [Task, Category, Tag]
// TODO could be inferred from entities?
export type EntityName = 'Task' | 'Category' | 'Tag'

export const getEntitiesNames = () =>
  entities.map(e => {
    return {
      name: e.name,
    }
  })

export const getEntity = (entity: EntityName | string) => {
  const found = entities.find(e => e.name === entity)
  if (!found) {
    throw new Error(`Entity ${entity} not found`)
  }
  return found as ClassType<any>
}
