<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$lib/Form.svelte'
  import { Task } from '$shared/Task'

  let mode: 'update' | 'readonly' = 'readonly'
</script>

<h2>Updatet Task</h2>

<button
  on:click={() => {
    mode = mode === 'update' ? 'readonly' : 'update'
  }}>{mode === 'update' ? 'Go to readonly' : 'Go to update'}</button
>

<Form
  entity={Task}
  {mode}
  id={$page.params.id}
  on:update={() => {
    goto('/tasks/list')
  }}
/>
