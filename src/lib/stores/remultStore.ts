import { browser } from '$app/environment'
import type { FindOptions, Repository } from 'remult'
import { writable } from 'svelte/store'

// TODO: move in remult repo
/**
Usage:
```ts
export let data: PageData

// get the repo
const taskRepo = remult.repo(Task)

// Start with SSR tasks then subscribe to changes
let tasks = remultStore(taskRepo, data.tasks)
$: browser && tasks.listen()
```
 */
export const remultStore = <T>(repo: Repository<T>, initValues: T[] = []) => {
  const { subscribe, set } = writable<T[]>(initValues)

  return {
    subscribe,

    listen: (options?: FindOptions<T>) => {
      if (browser) {
        repo.liveQuery(options).subscribe(info => {
          set(info.items)
        })
      } else {
        throw new Error(`xxx.listen() Too early!

You should do like: 
  let tasks = tasksStore<Task>(taskRepo, data.tasks)
  $: browser && tasks.listen()
				`)
      }
    },
  }
}
