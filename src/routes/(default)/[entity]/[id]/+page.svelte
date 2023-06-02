<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$lib/Form.svelte'
  import { getRepo } from '$shared/_entities'

  let mode: 'update' | 'readonly' = 'readonly'
  const repo = getRepo($page.params.entity)
</script>

<h2>Update {$page.params.entity}</h2>

<button
  on:click={() => {
    mode = mode === 'update' ? 'readonly' : 'update'
  }}>{mode === 'update' ? 'Go to readonly' : 'Go to update'}</button
>

<Form
  {repo}
  {mode}
  id={$page.params.id}
  on:update={() => {
    goto(`/${$page.params.entity}`)
  }}
/>
