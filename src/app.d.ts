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
  export interface FieldOptions<entityType, valueType> extends EntitySytle {
    placeholder?: string
  }
  export type EntityOptions<entityType> = EntitySytle
}

export {}
