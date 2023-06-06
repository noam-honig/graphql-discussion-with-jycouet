<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$components/forms/Form.svelte'
  import PageTitle from '$components/layouts/PageTitle.svelte'
  import Button from '$components/ui/button/Button.svelte'
  import { CardContent, CardDescription, CardHeader, CardTitle } from '$components/ui/card'
  import Card from '$components/ui/card/Card.svelte'
  import { getRepo } from '$shared/_entities'
  import { ArrowUpCircle } from 'lucide-svelte'

  $: repo = getRepo($page.params.entity)
  // $: exclude = [repo.fields.category!]
</script>

<PageTitle text={repo.metadata.caption}>
  <Button href="/tasks" size="sm">
    <ArrowUpCircle class="mr-2 h-4 w-4" />
    Back to the list
  </Button>
</PageTitle>

<Card>
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl">Update a task</CardTitle>
    <CardDescription>Edit all info</CardDescription>
  </CardHeader>

  <CardContent class="grid gap-4">
    <Form
      {repo}
      mode="update"
      id={$page.params.id}
      on:update={() => {
        goto(`/shadcn/${$page.params.entity}`)
      }}
    />
  </CardContent>
</Card>
