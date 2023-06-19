<script lang="ts">
  import { browser } from '$app/environment'
  import { remultLive } from '$lib/remult-svelte/remultLive'
  import { Task } from '$shared/Task'
  import { remult } from 'remult'

  const repo = remult.repo(Task)

  const list = remultLive(repo)
  $: browser && list.listen({ limit: 3 })
</script>

{#each $list as task}
  <div>{task.title}</div>
{/each}
