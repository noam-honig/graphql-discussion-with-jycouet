<script lang="ts">
  import { browser } from '$app/environment'
  import Button from '$components/ui/button/Button.svelte'
  import Card from '$components/ui/card/Card.svelte'
  import CardContent from '$components/ui/card/CardContent.svelte'
  import CardDescription from '$components/ui/card/CardDescription.svelte'
  import CardHeader from '$components/ui/card/CardHeader.svelte'
  import CardTitle from '$components/ui/card/CardTitle.svelte'
  import { remultStore } from '$lib/stores/remultStore'
  import { Task } from '$shared/Task'
  import { Pencil, PlusCircle } from 'lucide-svelte'
  import { type FieldMetadata, remult } from 'remult'

  import type { PageData } from './$types'

  export let data: PageData

  $: repo = remult.repo(Task)
  $: exclude = [repo.fields.id, repo.fields.category!]

  $: list = remultStore(repo, data.list)
  $: browser && list.listen()
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Tasks</h2>
  <div class="flex items-center space-x-2">
    <!-- JYC Question to Ermin titles move a bit if I don't have the button! -->
    <Button href={`/tasks/create`} size="sm">
      <PlusCircle class="mr-2 h-4 w-4" />
      Add
    </Button>
  </div>
</div>

<Card>
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl">List tasks ({#await repo.count() then rez}{rez}{/await})</CardTitle>
    <CardDescription>Look at your list... You should probably start working on it!</CardDescription>
  </CardHeader>

  <CardContent class="grid gap-4">
    <table>
      <tr>
        {#each repo.fields.toArray().filter(f => !exclude.map(c => c.key).includes(f.key)) as field}
          <th>{field.caption}</th>
        {/each}
        <th>Actions</th>
      </tr>
      {#each $list as row}
        <tr>
          {#each repo.fields
            .toArray()
            .filter(f => !exclude.map(c => c.key).includes(f.key)) as field}
            <td class="text-center">
              {field.displayValue(row)}
            </td>
          {/each}
          <td class="text-center">
            <Button
              data-sveltekit-preload-data="off"
              href={`/tasks/${row['id']}`}
              size="sm"
              variant="ghost"
            >
              <Pencil class="mr-2 h-4 w-4" />
            </Button>
          </td>
        </tr>
      {/each}
    </table>
  </CardContent>
</Card>
