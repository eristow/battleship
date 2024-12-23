import type { ShipSummary } from '@battleship/types';
import type { PageLoad } from './$types.js';
import type { PageServerLoad } from './signup/$types.js';

export const load: PageLoad = (async () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const shipsUrl = `${backend_url}/games/ships`;

  try {
    console.log('fetching ships from', shipsUrl);
    const response = await fetch(shipsUrl);

    return {
      ships: (await response.json()) as ShipSummary[],
    };
  } catch (error) {
    console.error('Error fetching ships:', error);
    return {
      ships: [],
      error: 'Error fetching ships',
    };
  }
}) satisfies PageServerLoad;
