import { describeClass, Entity, Field, Fields, ValueListFieldType } from 'remult'

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
    inputType: 'text', // how to remove? (should be default)
    caption: 'The Title',
    validate: task => {
      if (task.title?.length <= 0) throw Error('Required!')
      if (task.title?.length < 3) throw Error('Too short')
    },
    placeholder: 'Be creative...',
  })
  title = ''

  @Fields.boolean({
    caption: 'Is it completed?',
    hideInCreate: true,
    displayValue: task => (task.completed ? 'Yes' : 'No'),
  })
  completed = false

  @Fields.dateOnly({
    caption: 'Due Date',
    allowNull: false,
  })
  dueDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7)

  @Field(() => TaskPriority, { inputType: 'select' }) // how to bind this to a select from the type directly?
  thePriority = TaskPriority.High

  @Field(() => Category, { allowNull: true })
  category?: Category
}

export class TaskPriority {
  static Low = new TaskPriority('LOW', 'Low ❕')
  static High = new TaskPriority('HIGH', 'High ‼️')
  static Critical = new TaskPriority('CRITICAL', 'Critical 💥')
  constructor(public id: string, public caption: string) {}
}
describeClass(TaskPriority, ValueListFieldType())
