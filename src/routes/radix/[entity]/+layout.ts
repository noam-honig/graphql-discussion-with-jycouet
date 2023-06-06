import { getRepo } from '$shared/_entities'
import { redirect } from '@sveltejs/kit'

import type { LayoutLoad } from './$types'

export const load = (async ({ params }) => {
  try {
    // to check if it exists
    const repo = getRepo(params.entity)
    const listPOJO = await repo.find()
    const list = JSON.parse(JSON.stringify(listPOJO))

    return {
      list,
      entity: params.entity,
      entity_caption: repo.metadata.caption,
    }
  } catch (error) {}

  // Something was wrong!
  throw redirect(303, '/')
}) satisfies LayoutLoad
