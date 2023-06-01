<script lang="ts">
  import { goto } from '$app/navigation'
  import Form from '$lib/Form.svelte'
  import { Task } from '$shared/Task'
</script>

<h2>Create Task</h2>

<Form
  entity={Task}
  mode="create"
  on:create={() => {
    goto('/tasks/list')
  }}
/>
