import { Entity, Fields, FieldType } from 'remult'

export
@FieldType({ displayValue: (_, v) => v?.name })
@Entity('categories', { allowApiCrud: true })
class Category {
  @Fields.string({
    allowApiUpdate: false,
    saving: async (_, ref) => {
      // created a consistent id for testing
      ref.value = (await ref.entityRef.repository.count()).toString()
    },
  })
  id = ''
  @Fields.string({
    withLink: true,
  })
  name = ''
}
