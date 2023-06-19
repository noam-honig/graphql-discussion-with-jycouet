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

export const fieldVisibility = (
  f: FieldMetadata<any, any>,
  mode: 'create' | 'update' | 'readonly',
) => {
  // good defaults?
  let with_readonly = false
  let with_allowNull = false

  if (mode === 'create') {
    if (f.options.hideInCreate) {
      return false
    }
    with_readonly = false
    with_allowNull = false
  } else if (mode === 'update') {
    with_readonly = false
    with_allowNull = true
  } else if (mode === 'readonly') {
    with_readonly = false
    with_allowNull = true
  }

  const allowNull = with_allowNull ? true : !f.allowNull
  const readOnly = with_readonly ? true : !f.dbReadOnly && f.options.allowApiUpdate === undefined

  return allowNull && readOnly
}
