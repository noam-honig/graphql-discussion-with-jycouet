<script lang="ts">
	import type { PageData } from './$houdini'

	export let data: PageData

	$: ({ Tasks } = data)
</script>

<h2>Tasks List</h2>
{#each $Tasks?.data?.tasks ?? [] as task}
	<pre>{JSON.stringify(task, null, 2)}</pre>
{/each}
