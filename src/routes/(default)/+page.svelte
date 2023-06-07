<script>
  import Link from '$lib/svelte-fields/Link/Link.svelte'
  import H2 from '$lib/svelte-fields/Text/H2.svelte'
</script>

<H2>Pages...</H2>
<ul class="ml-4 list-disc">
  <li>
    <Link href="/tasks-graphql">tasks-graphql</Link>
  </li>
  <li>
    <Link href="/Task">Task</Link>
  </li>
  <li>
    <Link href="/Category">Category</Link>
  </li>
  <li>
    <Link href="/Tag">Tag</Link>
  </li>
</ul>

<H2>This demo showcase</H2>

<ul class="ml-4 list-disc">
  <li>
    <Link href="https://remult.dev/" target="_blank">Remult</Link>
  </li>
  <li>
    <Link href="https://kit.svelte.dev/" target="_blank">SvelteKit</Link>
  </li>
  <li>
    <Link href="https://houdinigraphql.com/" target="_blank">Houdini</Link>
  </li>
</ul>
