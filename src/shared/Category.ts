import { Entity, Fields } from 'remult'

export
@Entity('categories', { allowApiCrud: true })
class Category {
  @Fields.cuid()
  id = ''
  @Fields.string()
  name = ''
}
