<script lang="ts">
  import type { PageData } from './$types.ts';

  let { data }: { data: PageData } = $props();
</script>

<div class="m-2">
  {#if data.ships.length > 0}
    <h2>Ships</h2>
    {#each data.ships as ship}
      <p>{ship.name}: length of {ship.length}</p>
    {/each}
  {:else}
    <p>Loading...</p>
  {/if}
  <!-- TODO: figure out how to not show this on initial page load -->
  {#if data.error}
    <p>{data.error}</p>
  {/if}
</div>
