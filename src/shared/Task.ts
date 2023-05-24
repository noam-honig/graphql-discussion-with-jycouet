import { Entity, Field, Fields } from 'remult'

import { Category } from './Category'

@Entity('tasks', { allowApiCrud: true })
export class Task {
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
  @Field(() => Category, { allowNull: true })
  category?: Category
}
