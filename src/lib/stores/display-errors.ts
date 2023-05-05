import { writable } from 'svelte/store';

export const populationChartError = writable<Error | null>(null);
