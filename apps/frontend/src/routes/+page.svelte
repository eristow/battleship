<script lang="ts">
  import type { ShipSummary } from '@battleship/types';
  import { onMount } from 'svelte';

  let backend_url = import.meta.env.VITE_BACKEND_URL;
  let ships: ShipSummary[] = [];

  onMount(async () => {
    async function fetchShipTypes(): Promise<ShipSummary[]> {
      const shipsUrl = `${backend_url}/games/ships`;

      console.log('fetching ships from', shipsUrl);
      const response = await fetch(shipsUrl);

      return await response.json();
    }

    ships = await fetchShipTypes();
  });
</script>

<div class="m-2">
  <!-- {#await ships}
    <p>Loading...</p>
  {:then response}
    {#each response as ship}
      <p>{ship.name}: length of {ship.length}</p>
    {/each}
  {:catch error}
    <p>{error}</p>
  {/await} -->
  {#each ships as ship}
    <p>{ship.name}: length of {ship.length}</p>
  {/each}
</div>
