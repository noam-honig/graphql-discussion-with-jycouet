<script lang="ts">
  import { browser } from '$app/environment'
  import { remultLive } from '$lib/remult-svelte/remultLive'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import { Task } from '$shared/Task'
  import { remult } from 'remult'

  const repo = remult.repo(Task)

  const list = remultLive(repo)
  $: browser && list.listen({ limit: 3 })
</script>

<H2>limit to 3 elements</H2>

{#each $list as task}
  <div>{task.title}</div>
{/each}
