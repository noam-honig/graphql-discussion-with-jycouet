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
    placeholder?: string
    hideInCreate?: boolean
    selectOptions?: Record<string, string>
    defaultInsert?: string
  }
}

export {}
