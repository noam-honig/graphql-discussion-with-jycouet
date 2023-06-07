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
  include: FieldMetadata<any, any>[],
  exclude: FieldMetadata<any, any>[],
) => {
  const isExcluded = exclude.map(c => c.key).includes(f.key)
  if (isExcluded) {
    return false
  }
  const isIncluded = include.map(c => c.key).includes(f.key)
  if (isIncluded) {
    return true
  }

  // good defaults?
  let with_readonly = false
  let with_allowNull = false

  if (mode === 'create') {
    with_readonly = false
    with_allowNull = false
  } else if (mode === 'update') {
    with_readonly = false
    with_allowNull = true
  }

  const allowNull = with_allowNull ? true : !f.allowNull
  const readOnly = with_readonly ? true : !f.dbReadOnly && f.options.allowApiUpdate === undefined

  return allowNull && readOnly
}

export type EntitySytle = {
  style?: EntitySytleScreen & {
    tablet?: EntitySytleScreen
    mobile?: EntitySytleScreen
  }
}

export type EntitySytleScreen = {
  cols?:
    | 'grid-cols-1'
    | 'grid-cols-2'
    | 'grid-cols-3'
    | 'grid-cols-4'
    | 'grid-cols-5'
    | 'grid-cols-6'
}

export type FieldSytleScreen = {
  hide?: boolean
  cols?: number
  span?: number
}

export type FieldSytle = {
  style?: FieldSytleScreen & {
    tablet?: FieldSytleScreen
    mobile?: FieldSytleScreen
  }
}

export const entitySytleCols = (s?: EntitySytle) => {
  const classes = []
  const def = 'grid-cols-3'
  // Mobile first
  classes.push(`${s?.style?.mobile?.cols ?? s?.style?.tablet?.cols ?? s?.style?.cols ?? def}`)

  // Then tablet
  classes.push(`sm:${s?.style?.tablet?.cols ?? s?.style?.cols ?? def}`)

  // Then desktop
  classes.push(`lg:${s?.style?.cols ?? def}`)

  // Remove duplicates
  let seenClasses = new Set()
  let uniqueClasses = []
  for (let classVal of classes) {
    let splitVal = classVal.split(':')
    let classValSuffix = splitVal.length > 1 ? splitVal.slice(1).join(':') : splitVal[0] // Get class value after : or the value itself if there's no :
    if (!seenClasses.has(classValSuffix)) {
      seenClasses.add(classValSuffix)
      uniqueClasses.push(classVal)
    }
  }

  // Restore original order & join
  return uniqueClasses.join(' ')
}

export const entitySytleSpan = (s?: EntitySytle) => {
  const str = entitySytleCols(s)
  return str.replace(/grid-cols-/g, 'col-span-')
}
