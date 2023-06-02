import { Entity, Fields, IdEntity } from 'remult'

export
@Entity('tags_in_tasks', {
  allowApiCrud: true,
})
class TagsInTasks extends IdEntity {
  @Fields.integer()
  taskId = 0

  @Fields.string()
  tagsId = ''
}
