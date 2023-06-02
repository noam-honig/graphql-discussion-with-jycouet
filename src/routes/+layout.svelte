<script lang="ts">
  import { signOut } from '@auth/sveltekit/client'
  import { remult } from 'remult'

  import type { LayoutData } from './$types'

  export let data: LayoutData

  // set this globaly
  remult.user = data.user
</script>

<svelte:head>
  <title>Remult & Houdini</title>
</svelte:head>

<h1>Welcome to Remult & SvelteKit & GraphQL</h1>

<hr />

<nav>
  <a href="/">Home</a>
  |
  <a href="/tasks/list">List</a>
  |
  <a href="/tasks/create">Create</a>

  <div style="float: right;">
    <a href="/api/graphql" target="_blank">Graph<i>i</i>GL</a>
    | Hello {remult.user?.name}
    | <a href="/" on:click={signOut}>Logout</a>
  </div>
</nav>

<hr />

<slot />
