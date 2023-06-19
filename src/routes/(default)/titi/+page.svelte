<script lang="ts">
  import { Task } from '$shared/Task'
  import { remult } from 'remult'
  import { writable } from 'svelte/store'

  const taskRepo = remult.repo(Task)

  const tasks = writable<Task[]>([])

  let unsub: any
  async function test() {
    if (unsub) {
      tasks.set([])
      await unsub()
    }
    unsub = taskRepo.liveQuery().subscribe(info => tasks.set(info.items))
  }
</script>

<button class="btn btn-primary" on:click={() => test()}>testing</button>

{$tasks.length}
