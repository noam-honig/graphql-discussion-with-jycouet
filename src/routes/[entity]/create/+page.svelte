<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$lib/Form.svelte'
  import { getEntity } from '$shared/_entities'

  const entity = getEntity($page.params.entity)
</script>

<!-- TODO JYC: entity caption? -->
<h2>Create a {entity.name}</h2>

<Form
  {entity}
  mode="create"
  on:create={() => {
    goto(`/${entity.name}`)
  }}
/>
