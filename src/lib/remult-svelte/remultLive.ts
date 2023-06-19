import { browser } from '$app/environment'
import type { FindOptions, Repository } from 'remult'
import { onDestroy } from 'svelte'
import { writable } from 'svelte/store'

/**
 * @param repo remult repository to listen to
 * @param initValues usually the data coming from SSR
 * @returns a store with the initial values and a listen() method to subscribe to changes
 *
 * Example
 * ```ts
 * // get the repo
 * const repo = remult.repo(Task)
 *
 * const list = remultLive(repo, data.list)
 * $: browser && list.listen(data.options)
 * ```
 */
export const remultLive = <T>(repo: Repository<T>, initValues: T[] = []) => {
  const { subscribe, set } = writable<T[]>(initValues)
  let unSub: any = null

  onDestroy(async () => {
    await plzUnSub()
  })

  // if we already have a subscription, unsubscribe (on option update for example)
  const plzUnSub = async () => {
    if (unSub) {
      unSub()
      // console.log(`plzUnSub DONE`)
    } else {
      // console.log(`plzUnSub no need`)
    }
  }

  return {
    subscribe,
    set,
    listen: async (options?: FindOptions<T>) => {
      if (browser) {
        await plzUnSub()

        unSub = repo.liveQuery(options).subscribe(info => {
          set(info.items)
        })
      } else {
        throw new Error(`xxx.listen() Too early!
Check the usage of remultLive() in your code.`)
      }
    },
  }
}
