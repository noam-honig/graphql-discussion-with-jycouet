<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$components/forms/Form.svelte'
  import Button from '$components/ui/button/Button.svelte'
  import { CardContent, CardDescription, CardHeader, CardTitle } from '$components/ui/card'
  import Card from '$components/ui/card/Card.svelte'
  import { getRepo } from '$shared/_entities'
  import { ArrowUpCircle } from 'lucide-svelte'

  $: repo = getRepo($page.params.entity)
  // const exclude = [repo.fields.completed, repo.fields.category!]
  const exclude: any[] = []
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">{repo.metadata.caption}</h2>
  <div class="flex items-center space-x-2">
    <!-- JYC Question to Ermin titles move a bit if I don't have the button! -->
    <Button href="/app/{$page.params.entity}" size="sm">
      <ArrowUpCircle class="mr-2 h-4 w-4" />
      Back to the list
    </Button>
  </div>
</div>

<Card>
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl">Create</CardTitle>
    <CardDescription>Enter great info for the {$page.params.entity}!</CardDescription>
  </CardHeader>

  <CardContent class="grid gap-4">
    <Form
      {repo}
      {exclude}
      mode="create"
      on:create={() => {
        goto(`/app/${$page.params.entity}`)
      }}
    />
  </CardContent>
</Card>
