<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$lib/Form.svelte'
  import { getEntity } from '$shared/_entities'
  import { Task } from '$shared/Task'

  let mode: 'update' | 'readonly' = 'readonly'
  const entity = getEntity($page.params.entity)
</script>

<h2>Update {entity.name}</h2>

<button
  on:click={() => {
    mode = mode === 'update' ? 'readonly' : 'update'
  }}>{mode === 'update' ? 'Go to readonly' : 'Go to update'}</button
>

<Form
  {entity}
  {mode}
  id={$page.params.id}
  on:update={() => {
    goto(`/${entity.name}`)
  }}
/>
