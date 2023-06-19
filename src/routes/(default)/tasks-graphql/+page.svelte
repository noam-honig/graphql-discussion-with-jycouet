<script lang="ts">
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import type { PageData } from '../../task-list/$houdini'

  export let data: PageData

  $: ({ Tasks } = data)
</script>

<H2>Tasks List ({$Tasks?.data?.tasks?.totalCount})</H2>

{#each $Tasks?.data?.tasks?.items ?? [] as task}
  <a href={`/tasks/${task.id}`}>
    <pre>{JSON.stringify(task, null, 2)}</pre>
  </a>
{/each}
