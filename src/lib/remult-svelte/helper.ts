import type { FieldMetadata } from 'remult'

export const displayValue = (field: FieldMetadata, row: any) => {
  try {
    const toRet = field.displayValue(row)

    return toRet
  } catch (error) {
    // TODO: Why do we have error "sometimes"?
    // return this.remult.repo(this.entityDefs.entityType).getEntityRef(item).fields.find(this.key).displayValue;
    // console.log(`repo.getEntityRef(row).fields.find(field.key)`, repo.getEntityRef(row).fields)
    // console.log(`error field`, field, error)
  }
}
