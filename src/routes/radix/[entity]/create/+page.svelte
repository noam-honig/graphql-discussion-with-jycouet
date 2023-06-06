<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$lib/svelte-fields/Form.svelte'
  import { getRepo } from '$shared/_entities'

  const repo = getRepo($page.params.entity)
</script>

<!-- TODO JYC: entity caption? -->
<h2>Create a {$page.params.entity}</h2>

<Form
  {repo}
  mode="create"
  on:create={() => {
    goto(`/radix/${$page.params.entity}`)
  }}
/>
