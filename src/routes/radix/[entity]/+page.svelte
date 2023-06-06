<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { displayValue } from '$lib/remult-svelte/helper'
  import { remultLive } from '$lib/remult-svelte/remultLive'
  import { getRepo } from '$shared/_entities'
  import type { FieldMetadata } from 'remult'

  import type { PageData } from './$types'

  export let data: PageData

  $: repo = getRepo(data.entity)

  $: list = remultLive(repo, data.list)
  $: browser && list.listen()
</script>

<button
  style="float: right;"
  on:click={() => {
    goto(`/radix/${data.entity}/create`)
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
            <a href={`/radix/${data.entity}/${row[field.key]}`}>
              {displayValue(field, row)}
            </a>
          {:else}
            {displayValue(field, row)}
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>
