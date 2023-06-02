<script lang="ts">
  import { page } from '$app/stores'
  import { cn } from '$lib/utils'

  let className: string | undefined | null = undefined

  const links = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/customers', label: 'Customers' },
    { href: '/tasks', label: 'Tasks' },
  ]

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
