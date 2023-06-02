<script lang="ts">
  import { getEntitiesNames } from '$shared/_entities'
  import { signOut } from '@auth/sveltekit/client'
  import { remult } from 'remult'

  import type { LayoutData } from './$types'

  export let data: LayoutData

  // set this globaly
  remult.user = data.user

  const entitiesNames = getEntitiesNames().map(c => c.name)
</script>

<svelte:head>
  <title>Remult & SvelteKit</title>
</svelte:head>

<h1>Welcome to Remult & SvelteKit</h1>

<hr />

<nav>
  <a href="/">Home</a>
  {#each entitiesNames as entityName}
    |
    <a href="/{entityName}">{entityName}</a>&nbsp;
  {/each}

  <div style="float: right;">
    <a href="/api/graphql" target="_blank">Graph<i>i</i>GL</a>
    | Hello {remult.user?.name}
    | <a href="/" on:click={signOut}>Logout</a>
  </div>
</nav>

<hr />

<slot />
