import { getRepo } from '$shared/_entities'
import { redirect } from '@sveltejs/kit'

import type { LayoutServerLoad } from '../$types'

export const load = (async ({ params }) => {
  try {
    // to check if it exists
    const repo = getRepo(params.entity)
    const listPOJO = await repo.find()
    const list = [...structuredClone(listPOJO)]

    return {
      list,
      entity: params.entity,
    }
  } catch (error) {}

  // Something was wrong!
  throw redirect(303, '/')
}) satisfies LayoutServerLoad
