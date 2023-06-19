import type { AuthConfig } from '@auth/core'
import { skipCSRFCheck } from '@auth/core'
import Credentials from '@auth/core/providers/credentials'
import { SvelteKitAuth } from '@auth/sveltekit'
import { AUTH_SECRET } from '$env/static/private'
import type { UserInfo } from 'remult'

const validUsers: UserInfo[] = [
  { id: '1', name: 'JYC', roles: ['admin'] },
  { id: '2', name: 'Ermin' },
]

export const authConfig: AuthConfig = {
  secret: AUTH_SECRET,
  // to rmv when in production
  skipCSRFCheck: skipCSRFCheck,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        name: {
          placeholder: 'Try Ermin or JYC',
        },
      },
      authorize: info => {
        return validUsers.find(user => user.name === info?.name) || null
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: validUsers.find(user => user.id === token?.sub),
      }
    },
  },
}

//Based on article at https://authjs.dev/reference/sveltekit
export const handleAuth = SvelteKitAuth(
  // @ts-ignore issue with types (probably because of kit)
  authConfig,
)
