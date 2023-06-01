import { Entity, Field, Fields } from 'remult'

import { Category } from './Category'

export
@Entity('tasks', {
  allowApiCrud: true,
  // We will set this later to see the behavior in GraphQL
  // allowApiInsert: 'admin',
})
class Task {
  // @Fields.cuid()
  @Fields.autoIncrement()
  id = 0
  @Fields.string({
    caption: 'The Title',
    validate: task => {
      if (task.title.length < 3) throw Error('Too short')
    },
  })
  title = ''
  @Fields.boolean({ caption: 'Is it completed?' })
  completed = false
  @Fields.object({ dbName: 'the_priority' })
  thePriority = Priority.Low
  @Field(() => Category, { allowNull: true })
  category?: Category
}

export enum Priority {
  Low,
  High,
  Critical,
}
