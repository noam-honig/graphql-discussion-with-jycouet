import { Entity, Field, Fields, remult } from 'remult'

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
      if (task.title?.length < 3) throw Error('Too short')
    },
    placeholder: 'Be creative...',
  })
  title = ''

  @Fields.boolean({ caption: 'Is it completed?', hideInCreate: true })
  completed = false

  // @Fields.dateOnly({
  //   caption: 'The Due Date',
  //   allowNull: false,
  //   // inputType: 'date', // Should come automatically?!
  //   // valueConverter: {
  //   //   toInput: value => value?.toISOString().split('T')[0],
  //   // },
  // })
  // dueDate?: Date

  @Fields.object({
    dbName: 'the_priority',
    inputType: 'select',
    selectOptions: { Low: 'Low ❕', High: 'High ‼️', Critical: 'Critical 💥' },
    defaultInsert: 'High',
  })
  thePriority = Priority.High

  @Field(() => Category, { allowNull: true })
  category?: Category

  @Fields.string({
    serverExpression: () => {
      return "";
      if (!remult.authenticated()) return 'noOne'
      return JSON.stringify(remult.user)
    },
  })
  userOnServer = ''
}

export enum Priority {
  Low,
  High,
  Critical,
}
