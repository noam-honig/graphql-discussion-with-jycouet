<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  let className: string | undefined | null = undefined
  export { className as class }
  export let href: HTMLAnchorAttributes['href']

  type Props = {
    class?: string | null
  }

  interface AnchorElement extends Props, HTMLAnchorAttributes {
    href: HTMLAnchorAttributes['href']
  }

  type $$Props = AnchorElement
</script>

<a
  class={`link ${className ?? ''}`}
  {href}
  {...$$restProps}
  on:click
  on:change
  on:keydown
  on:keyup
  on:mouseenter
  on:mouseleave
>
  <slot />
</a>
