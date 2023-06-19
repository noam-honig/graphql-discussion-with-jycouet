<script>
  import Link from '$lib/svelte-fields/Link/Link.svelte'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
  import { entitiesName } from '$shared/_entities'
</script>

<H2>First page</H2>
<ul class="ml-4 list-disc">
  <li>
    <Link href="/demo">Demo</Link>
  </li>
</ul>

<br />
<H2>Automatic Pages...</H2>
<ul class="ml-4 list-disc">
  {#each entitiesName as entityName}
    <li>
      <Link href="/{entityName}">{entityName}</Link>
    </li>
  {/each}
</ul>

<br />
<H2>Special Pages...</H2>
<ul class="ml-4 list-disc">
  <li>
    <Link href="/api/graphql" target="_blank">GraphiQL</Link>
  </li>
  <li>
    <Link href="/tasks-graphql">tasks</Link>
  </li>
</ul>

<br />
<H2>This demo showcase ⭐</H2>
<ul class="ml-4 list-disc">
  <li>
    <Link href="https://github.com/remult/remult" target="_blank">Remult</Link>
  </li>
  <li>
    <Link href="https://github.com/sveltejs/kit" target="_blank">SvelteKit</Link>
  </li>
  <li>
    <Link href="https://github.com/HoudiniGraphql/houdini" target="_blank">Houdini</Link>
  </li>
</ul>
