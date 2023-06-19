// See https://kit.svelte.dev/docs/types#app
import type { EntitySytle, FieldSytle } from '$lib/remult-svelte/helper'

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
    interface Session {
      user: UserInfo
      expires: string
    }
  }
}

declare module 'remult' {
  export interface FieldOptions<entityType, valueType> {
    placeholder?: string
    withLink?: boolean
    hideInCreate?: boolean
    class?: string
  }
  export interface EntityOptions<entityType> {
    class?: string
    classActions?: string
  }
}

export {}
