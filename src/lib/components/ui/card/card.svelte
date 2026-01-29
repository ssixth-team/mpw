<script lang="ts">
  import { type VariantProps, tv } from 'tailwind-variants';
  import type { Snippet } from 'svelte';

  const cardVariants = tv({
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm'
  });

  type Props = {
    class?: string;
    children?: Snippet;
  } & VariantProps<typeof cardVariants>;

  let { class: className, children, ...restProps }: Props = $props();
</script>

<div class={cardVariants({ class: className })} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</div>
