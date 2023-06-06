<script>
  import { entitiesName } from '$shared/_entities'
</script>

<h2>This demo showcase</h2>
<ul>
  <li>
    <a href="https://remult.dev/" target="_blank">Remult</a>
  </li>
  <li>
    <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a>
  </li>
  <li>
    <a href="https://houdinigraphql.com/" target="_blank">Houdini</a>
  </li>
</ul>

<h2>Radix</h2>

<ul>
  {#each entitiesName as entityName}
    <li>
      <a href="/radix/{entityName}">{entityName}</a>
    </li>
  {/each}
</ul>
