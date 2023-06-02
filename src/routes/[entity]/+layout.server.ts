import { getEntity } from '$shared/_entities'
import { redirect } from '@sveltejs/kit'
import { remult } from 'remult'

import type { LayoutServerLoad } from '../$types'

export const load = (async ({ params }) => {
  try {
    // to check if it exists
    const entity = getEntity(params.entity ?? '')
    const listPOJO = await remult.repo(entity).find()
    const list = [...structuredClone(listPOJO)]

    return {
      list,
      entity: params.entity,
    }
  } catch (error) {}

  // Something was wrong!
  throw redirect(303, '/')
}) satisfies LayoutServerLoad
