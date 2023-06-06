<script lang="ts">
  import { page } from '$app/stores'

  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<a href={`/radix/${$page.params.entity}`}>
  {data.entity_caption}
</a>
<slot />
