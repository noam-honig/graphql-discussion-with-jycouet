import { sequence } from '@sveltejs/kit/hooks'
import { handleAuth } from './hooks/handleAuth'
import { handleGraphql } from './hooks/handleGraphql'
import { handleRemult } from './hooks/handleRemult'

export const handle = sequence(
  // Auth
  // handleAuth,

  // init Remult
  handleRemult,

  // let's start with the GraphQL endpoint
  handleGraphql(),
)
