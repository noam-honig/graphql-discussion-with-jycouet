<script lang="ts">
  import type { PageData } from './$houdini'

  export let data: PageData

  $: ({ Tasks } = data)
</script>

<h2>Tasks List ({$Tasks?.data?.tasksConnection?.totalCount})</h2>
{#each $Tasks?.data?.tasks ?? [] as task}
  <a href={`/tasks/${task.id}`}>
    <pre>{JSON.stringify(task, null, 2)}</pre>
  </a>
{/each}
