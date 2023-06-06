<script lang="ts">
  import Button from '$lib/svelte-fields/Button/Button.svelte'
  import Grid from '$lib/svelte-fields/Grid/Grid.svelte'
  import Link from '$lib/svelte-fields/Link/Link.svelte'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import { getRepo } from '$shared/_entities'

  import type { PageData } from './$types'

  export let data: PageData

  $: repo = getRepo(data.entity)
</script>

<!-- <button
  style="float: right;"
  on:click={() => {
    goto(`/${data.entity}/create`)
  }}>Add</button
> -->
<div class="flex justify-between items-center">
  <H2>List of {repo.metadata.caption} ({#await repo.count() then rez}{rez}{/await})</H2>
  <div>
    <Link href={`/${data.entity}/create`}>Create</Link>
  </div>
</div>

<Grid
  {repo}
  initData={data.list}
  include={[repo.metadata.fields.category]}
  linkOn={{
    field: repo.metadata.fields.title,
    redirect: id => {
      return `/${data.entity}/${id}`
    },
  }}
/>
