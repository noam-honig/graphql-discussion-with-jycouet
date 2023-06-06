import { getRepo } from '$shared/_entities'
import { redirect } from '@sveltejs/kit'

import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  try {
    // to check if it exists
    const repo = getRepo(params.entity)
    const listPOJO = await repo.find()
    const list = JSON.parse(JSON.stringify(listPOJO))

    return {
      list,
    }
  } catch (error) {}

  // Something was wrong!
  throw redirect(303, '/')
}) satisfies PageLoad
