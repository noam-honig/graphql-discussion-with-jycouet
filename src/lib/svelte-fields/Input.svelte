<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  export let value: HTMLInputAttributes['value'] = undefined

  let className: string | undefined | null = undefined
  export { className as class }
</script>

<input
  class={`input ${className ?? ''}`}
  bind:value
  on:blur
  on:change
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
  {...$$restProps}
/>
