// See https://kit.svelte.dev/docs/types#app

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
    class?: string
    placeholder?: string
    withLink?: boolean
    hideInCreate?: boolean
    disableFltering?: boolean
  }
  export interface EntityOptions<entityType> {
    class?: string
    classActions?: string
  }
}

export {}
