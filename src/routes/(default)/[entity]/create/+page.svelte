<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Form from '$lib/svelte-fields/Form.svelte'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import { getRepo } from '$shared/_entities'

  const repo = getRepo($page.params.entity)
</script>

<!-- TODO JYC: entity caption? -->
<H2>Create a {$page.params.entity}</H2>

<Form {repo} mode="create" redirect={`/${$page.params.entity}`} />
