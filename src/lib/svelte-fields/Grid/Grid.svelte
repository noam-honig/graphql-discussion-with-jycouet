<script lang="ts">
  import { browser } from '$app/environment'
  import { fieldVisibility } from '$lib/remult-svelte/helper'
  import { remultLive } from '$lib/remult-svelte/remultLive'
  import type { FieldMetadata, Repository } from 'remult'

  import Link from '../Link/Link.svelte'

  export let initData: any[] = []
  export let repo: Repository<any>
  export let include: FieldMetadata[] = []
  export let exclude: FieldMetadata[] = []
  export let linkOn:
    | {
        field: FieldMetadata
        redirect: (id: string) => string
      }
    | undefined = undefined

  $: list = remultLive(repo, initData)
  $: browser && list.listen()
</script>

<table class="table">
  <tr>
    {#each repo.fields
      .toArray()
      .filter(f => fieldVisibility(f, 'readonly', include, exclude)) as field}
      <th>{field.caption}</th>
    {/each}
  </tr>
  {#each $list as row}
    <tr>
      {#each repo.fields
        .toArray()
        .filter(f => fieldVisibility(f, 'readonly', include, exclude)) as field}
        <td>
          {#if field.key === linkOn?.field.key}
            <Link href={linkOn?.redirect(row['id'])}>
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
