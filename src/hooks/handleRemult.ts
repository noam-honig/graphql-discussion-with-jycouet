import { DATABASE_URL } from '$env/static/private'
import { controllers } from '$shared/_controllers'
import { entities } from '$shared/_entities'
import { createPostgresConnection } from 'remult/postgres'
import { remultSveltekit } from 'remult/remult-sveltekit'

export const handleRemult = remultSveltekit({
  entities,
  controllers,

  logApiEndPoints: false,

  getUser: async (event: any) => {
    let session = (event as any).session
    if (!session) session = await event?.locals?.getSession()
    return session?.user
  },

  dataProvider: await createPostgresConnection({
    connectionString: DATABASE_URL,
  }),
})
