import { describeClass, Entity, Field, Fields, Validators, ValueListFieldType } from 'remult'
import { Category } from './Category'

export
@Entity('tasks', { allowApiCrud: true })
class Task {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
export class TaskPriority {
  static Low = new TaskPriority('LOW', 'Low ❕')
  static High = new TaskPriority('HIGH', 'High ‼️')
  static Critical = new TaskPriority('CRITICAL', 'Critical 💥')
  constructor(public id: string, public caption: string) {}
}
describeClass(TaskPriority, ValueListFieldType())

// export
// @Entity('tasks', {
//   allowApiCrud: true,
//   // allowApiInsert: 'admin',
// })
// class Task {
//   @Fields.cuid()
//   id = ''

//   @Fields.string({
//     caption: 'The Title',
//     withLink: true,
//     validate: [
//       task => {
//         if (task.title?.length <= 0) throw Error('Required!')
//         if (task.title?.length < 3) throw Error('Too short')
//       },
//       Validators.uniqueOnBackend,
//     ],
//     placeholder: 'Be creative...',
//   })
//   title = ''

//   @Fields.boolean({
//     caption: 'Is it completed?',
//     hideInCreate: true,
//     displayValue: task => (task.completed ? 'Yes' : 'No'),
//   })
//   completed = false

//   @Fields.dateOnly({ caption: 'Due Date' })
//   dueDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7)

//   @Field(() => TaskPriority, { inputType: 'select' })
//   thePriority = TaskPriority.High

//   @Field(() => Category, { allowNull: true, disableFltering: true })
//   category?: Category
// }
