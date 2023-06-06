<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { Variant } from '../variants'

  let className: string | undefined | null = undefined
  export { className as class }
  export let type: HTMLButtonAttributes['type'] = undefined

  export let variant: Variant = 'neutral'

  const variants: Record<Variant, string> = {
    default: '',
    //
    neutral: 'btn-neutral',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    link: 'btn-link',
    //
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
  }

  type Props = {
    class?: string | null
    variant?: Variant
  }

  interface ButtonElement extends Props, HTMLButtonAttributes {
    type?: HTMLButtonAttributes['type']
  }

  type $$Props = ButtonElement
</script>

<button
  class={`btn ${variants[variant]} ${className ?? ''}`}
  {type}
  {...$$restProps}
  on:click
  on:change
  on:keydown
  on:keyup
  on:mouseenter
  on:mouseleave
>
  <slot />
</button>
