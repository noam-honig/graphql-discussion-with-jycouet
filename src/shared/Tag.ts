import { Entity, Field, Fields } from 'remult'

import { Task } from './Task'

export
@Entity('tags', { allowApiCrud: true })
class Tag {
  @Fields.cuid()
  id = ''
  @Fields.string()
  value = ''

  // @Fields.object<Task>((options, remult) => {
  //   options.serverExpression = async task => remult.repo(Task).find({ where: { id: task.id } })
  // })
  // tasks: Task[] = []
}
