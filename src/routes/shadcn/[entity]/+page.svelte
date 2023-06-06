<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import PageTitle from '$components/layouts/PageTitle.svelte'
  import Button from '$components/ui/button/Button.svelte'
  import Card from '$components/ui/card/Card.svelte'
  import CardContent from '$components/ui/card/CardContent.svelte'
  import CardDescription from '$components/ui/card/CardDescription.svelte'
  import CardHeader from '$components/ui/card/CardHeader.svelte'
  import CardTitle from '$components/ui/card/CardTitle.svelte'
  import { remultLive } from '$lib/stores/remultLive'
  import { getRepo } from '$shared/_entities'
  import { Pencil, PlusCircle } from 'lucide-svelte'
  import type { FieldMetadata } from 'remult'

  import type { PageData } from './$types'

  export let data: PageData

  $: repo = getRepo($page.params.entity)
  // $: exclude = [repo.fields.id, repo.fields.category]
  $: exclude = [repo.fields.id]

  // bring it back for SSR. (issue when changing from Task to Category)
  $: list = remultLive(repo, data.list)
  // $: list = remultLive(repo, [])
  $: browser && list.listen()

  const display = (field: FieldMetadata, row: any) => {
    try {
      const toRet = field.displayValue(row)
      // console.log(`all good`)

      return toRet
    } catch (error) {
      // TODO: Why do we have error "sometimes"?
      // return this.remult.repo(this.entityDefs.entityType).getEntityRef(item).fields.find(this.key).displayValue;
      // console.log(`repo.getEntityRef(row).fields.find(field.key)`, repo.getEntityRef(row).fields)
      // console.log(`error field`, field, error)
    }
  }
</script>

<PageTitle text={repo.metadata.caption}>
  <Button href={`/shadcn/${$page.params.entity}/create`} size="sm">
    <PlusCircle class="mr-2 h-4 w-4" />
    Add
  </Button>
</PageTitle>

<Card>
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl">List ({#await repo.count() then rez}{rez}{/await})</CardTitle>
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
              {display(field, row)}
              <!-- {field.displayValue(row)} -->
            </td>
          {/each}
          <td class="text-center">
            <Button
              data-sveltekit-preload-data="off"
              href={`/shadcn/${$page.params.entity}/${row['id']}`}
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
