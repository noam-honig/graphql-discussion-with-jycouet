<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { remultStore } from '$lib/stores/remultStore'
  import { getEntity } from '$shared/_entities'
  import { remult } from 'remult'

  import type { PageData } from './$types'

  export let data: PageData

  const entity = getEntity(data.entity)
  const repo = remult.repo(entity)

  const list = remultStore(repo, data.list)
  $: browser && list.listen()
</script>

<button
  style="float: right;"
  on:click={() => {
    goto(`/${entity.name}/create`)
  }}>Add</button
>
<h2>List of {repo.metadata.caption} ({#await repo.count() then rez}{rez}{/await})</h2>

<table>
  <tr>
    {#each repo.fields.toArray() as cell}
      <th>{cell.caption}</th>
    {/each}
  </tr>
  {#each $list as row}
    <tr>
      {#each repo.fields.toArray() as cell}
        <td>
          {#if cell.key === 'id'}
            <a href={`/${data.entity}/${row[cell.key]}`}>
              {row[cell.key]}
            </a>
          {:else}
            {cell.displayValue(row)}
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>
