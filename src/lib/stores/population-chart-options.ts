import { browser } from '$app/environment';
import { writable } from 'svelte/store';

import chartConfig from '$lib/configs/population-chart-config.json';

const defaultValue = new Set(chartConfig.defaultPrefCodeSet); // 北海道、東京都、大阪府、沖縄県の都道府県コード
const initialValue = (() => {
  if (!browser) {
    return defaultValue;
  }

  const storagedValue = window.localStorage.getItem('prefectures');
  if (storagedValue) {
    let value = JSON.parse(storagedValue) as number[];
    if (value.length === 0) {
      value = [...defaultValue];
    }
    return new Set(value);
  } else {
    return defaultValue;
  }
})();

export type PrefecturesMap = {
  [prefCode: number]: string
}

export const prefectures = writable<Set<number>>(initialValue);
prefectures.subscribe((value) => {
  if (browser) {
    const jsonString = JSON.stringify([...value]);
    window.localStorage.setItem('prefectures', jsonString);
  }
});
