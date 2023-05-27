import { Entity, Fields } from 'remult'

@Entity('categories', { allowApiCrud: true })
export class Category {
  @Fields.cuid()
  id = ''
  @Fields.string()
  name = ''
}
