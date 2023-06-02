<script lang="ts">
  import { goto } from '$app/navigation'
  import Form from '$components/forms/Form.svelte'
  import Button from '$components/ui/button/Button.svelte'
  import { CardContent, CardDescription, CardHeader, CardTitle } from '$components/ui/card'
  import Card from '$components/ui/card/Card.svelte'
  import { Task } from '$shared/Task'
  import { ArrowUpCircle } from 'lucide-svelte'
  import { remult } from 'remult'

  let repo = remult.repo(Task)
  const exclude = [repo.fields.completed, repo.fields.category!]
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Tasks</h2>
  <div class="flex items-center space-x-2">
    <!-- JYC Question to Ermin titles move a bit if I don't have the button! -->
    <Button href="/tasks" size="sm">
      <ArrowUpCircle class="mr-2 h-4 w-4" />
      Back to the list
    </Button>
  </div>
</div>

<Card>
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl">Create a task</CardTitle>
    <CardDescription>Enter great info for the task!</CardDescription>
  </CardHeader>

  <CardContent class="grid gap-4">
    <Form
      {repo}
      {exclude}
      mode="create"
      on:create={() => {
        goto('/tasks')
      }}
    />
  </CardContent>
</Card>
