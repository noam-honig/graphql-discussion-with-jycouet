<script lang="ts">
  export let text: string
</script>

<div class="flex items-center justify-between space-y-2 h-4">
  <h2 class="text-3xl font-bold tracking-tight">{text}</h2>
  {#if $$slots.right}
    <div class="flex items-center space-x-2">
      <slot name="right" />
    </div>
  {/if}
</div>
