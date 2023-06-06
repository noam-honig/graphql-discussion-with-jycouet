<script lang="ts">
  import NavBar from '$lib/layout/NavBar.svelte'
  import { entitiesName } from '$shared/_entities'
  import { signOut } from '@auth/sveltekit/client'
  import { remult } from 'remult'

  import type { LayoutData } from '../$types'

  export let data: LayoutData

  remult.user = data.user
</script>

<!-- <h1>Welcome to Remult &amp; SvelteKit</h1>

<hr />

<nav>
  <a href="/">Home</a>
  {#each entitiesName as entityName}
    |
    <a href="/{entityName}">{entityName}</a>&#xa0;
  {/each}

  <div style="float: right;">
    <a href="/tasks-graphql">tasks-graphql</a> |
    <a href="/api/graphql" target="_blank">Graph<i>i</i>GL</a>
    | Hello {remult.user?.name}
    | <a href="/" on:click={signOut}>Logout</a>
  </div>
</nav>

<hr /> -->

<NavBar />

<div class="p-4">
  <slot />
</div>
