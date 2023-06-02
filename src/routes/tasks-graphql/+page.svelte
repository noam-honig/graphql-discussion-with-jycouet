<script lang="ts">
  import type { PageData } from '../task-list/$houdini'

  export let data: PageData

  $: ({ Tasks } = data)
</script>

<h2>Tasks List ({$Tasks?.data?.tasks?.totalCount})</h2>
{#each $Tasks?.data?.tasks?.items ?? [] as task}
  <a href={`/Task/${task.id}`}>
    <pre>{JSON.stringify(task, null, 2)}</pre>
  </a>
{/each}
