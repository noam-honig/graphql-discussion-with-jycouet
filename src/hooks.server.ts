import { sequence } from '@sveltejs/kit/hooks'

import { handleGraphql } from './hooks/graphql'
import { remultApi } from './hooks/remult'

export const handle = sequence(remultApi, handleGraphql())
