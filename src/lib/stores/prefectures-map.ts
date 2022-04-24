import { writable } from 'svelte/store';

export type PrefecturesMap = {
  [prefCode: number]: string
}

export const prefecturesMap = writable<PrefecturesMap>({});
