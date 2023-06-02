import { sequence } from '@sveltejs/kit/hooks'

import { handleAuth } from './hooks/handleAuth'
import { handleGraphql } from './hooks/handleGraphql'
import { handleRemult } from './hooks/handleRemult'

export const handle = sequence(
  // let's start with the GraphQL endpoint
  handleGraphql(),

  // then the "normal" app
  // Auth
  handleAuth,

  // init Remult
  handleRemult,
)
