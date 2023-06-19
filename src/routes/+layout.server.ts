import { redirect } from '@sveltejs/kit'
import { remult, type UserInfo } from 'remult'
import type { LayoutServerLoad } from './$types'

// will protect every route in the app
export const load = (async () => {
  // if (!remult.authenticated()) {
  //   throw redirect(303, '/auth/signin')
  // }
  // return {
  //   user: remult.user,
  // }
}) satisfies LayoutServerLoad
