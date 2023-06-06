import { Entity, Fields, FieldType } from 'remult'

export
@FieldType({ displayValue: (_, v) => v?.name })
@Entity('categories', { allowApiCrud: true })
class Category {
  @Fields.cuid()
  id = ''
  @Fields.string()
  name = ''
}
