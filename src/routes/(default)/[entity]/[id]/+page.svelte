<script lang="ts">
  import { page } from '$app/stores'
  import Form from '$lib/svelte-fields/Form.svelte'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import { getRepo } from '$shared/_entities'

  let mode: 'update' | 'readonly' = 'readonly'
  const repo = getRepo($page.params.entity)
</script>

<H2>Update {$page.params.entity}</H2>

<Form {repo} {mode} id={$page.params.id} redirect={`/${$page.params.entity}`} />
