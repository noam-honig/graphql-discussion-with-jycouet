<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { remultLive } from '$lib/stores/remultLive'
  import { getRepo } from '$shared/_entities'

  import type { PageData } from './$types'

  export let data: PageData

  $: repo = getRepo(data.entity)

  $: list = remultLive(repo, data.list)
  $: browser && list.listen()
</script>

<button
  style="float: right;"
  on:click={() => {
    goto(`/${data.entity}/create`)
  }}>Add</button
>
<h2>List of {repo.metadata.caption} ({#await repo.count() then rez}{rez}{/await})</h2>

<table>
  <tr>
    {#each repo.fields.toArray() as field}
      <th>{field.caption}</th>
    {/each}
  </tr>
  {#each $list as row}
    <tr>
      {#each repo.fields.toArray() as field}
        <td>
          {#if field.key === 'id'}
            <a href={`/${data.entity}/${row[field.key]}`}>
              {field.displayValue(row)}
            </a>
          {:else}
            {field.displayValue(row)}
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>
