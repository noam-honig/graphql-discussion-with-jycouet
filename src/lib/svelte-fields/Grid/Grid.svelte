<script lang="ts">
  import { browser } from '$app/environment'
  import { fieldVisibility } from '$lib/remult-svelte/helper'
  import { remultLive } from '$lib/remult-svelte/remultLive'
  import type { EntityOrderBy, Repository } from 'remult'
  import Link from '../Link/Link.svelte'

  export let initData: any[] = []
  export let repo: Repository<any>
  export let orderBy: EntityOrderBy<any> = {}
  export function sortOn(key: string) {
    const current = orderBy[key]
    orderBy = { [key]: current == 'asc' ? 'desc' : 'asc' }
  }
  const list = remultLive(repo, initData)
  $: browser &&
    list.listen({
      orderBy,
    })
</script>

<table class="table">
  <tr>
    {#each repo.fields.toArray().filter(f => fieldVisibility(f, 'readonly')) as field}
      <th
        class={field.options.disableFltering ? '' : 'cursor-pointer'}
        on:click={() => sortOn(field.key)}
      >
        {field.caption}

        {#if field.options.disableFltering}
          <!-- nothing to display -->
        {:else if orderBy[field.key] === 'asc'}
          🔼
        {:else if orderBy[field.key] === 'desc'}
          🔽
        {:else}
          🌪️
        {/if}
      </th>
    {/each}
  </tr>
  {#each $list as row}
    <tr>
      {#each repo.fields.toArray().filter(f => fieldVisibility(f, 'readonly')) as field}
        <td>
          {#if field.options.withLink}
            <Link href="{repo.metadata.key}/{row['id']}">
              {field.displayValue(row)}
            </Link>
          {:else}
            {field.displayValue(row)}
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>
