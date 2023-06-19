<script lang="ts">
  import NavBar from '$lib/layout/NavBar.svelte'
  import { remult } from 'remult'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  remult.user = data.user
</script>

<NavBar />

<div class="p-4">
  <slot />
</div>
