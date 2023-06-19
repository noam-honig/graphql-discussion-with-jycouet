<script lang="ts">
  import { page } from '$app/stores'
  import Grid from '$lib/svelte-fields/Grid/Grid.svelte'
  import Link from '$lib/svelte-fields/Link/Link.svelte'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import { getRepo } from '$shared/_entities'
  import type { PageData } from './$types'

  export let data: PageData

  $: repo = getRepo($page.params.entity)
</script>

<div class="flex justify-between items-center">
  <H2>List of {repo.metadata.caption} ({#await repo.count() then rez}{rez}{/await})</H2>
  {#if repo.metadata.apiInsertAllowed()}
    <div>
      <Link href={`/${$page.params.entity}/create`}>Create</Link>
    </div>
  {/if}
</div>

<Grid {repo} initData={data.list} />
