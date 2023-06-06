<script lang="ts">
  import { page } from '$app/stores'
  import { cn } from '$lib/utils'
  import { entitiesName } from '$shared/_entities'

  let className: string | undefined | null = undefined

  const links = [
    { href: '/shadcn/dashboard', label: 'Overview' },
    { href: '/shadcn/customers', label: 'Customers' },
  ].concat(entitiesName.map(entity => ({ href: `/shadcn/${entity}`, label: entity })))

  export { className as class }
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
  {#each links as { href, label }}
    <a
      {href}
      class="text-sm font-medium {$page.url.pathname.startsWith(href)
        ? ''
        : 'text-muted-foreground'} transition-colors hover:text-primary"
    >
      {label}
    </a>
  {/each}
</nav>
