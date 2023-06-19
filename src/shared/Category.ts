import { Entity, Fields, FieldType } from 'remult'

export
@FieldType({ displayValue: (_, v) => v?.name })
@Entity('categories', { allowApiCrud: true })
class Category {
  @Fields.cuid({
    allowApiUpdate: false,
  })
  id = ''

  @Fields.string({
    withLink: true,
  })
  name = ''
}
