import { browser } from '$app/env';
import { writable } from 'svelte/store';

const defaultValue = new Set([1, 13, 27]); // 北海道、東京都、大阪府の都道府県コード
const initialValue = (() => {
  if (!browser) {
    return defaultValue;
  }

  const storagedValue = window.localStorage.getItem('prefectures');
  if (storagedValue) {
    return new Set(JSON.parse(storagedValue) as number[]);
  } else {
    return defaultValue;
  }
})();

export const prefectures = writable<Set<number>>(initialValue);
prefectures.subscribe((value) => {
  if (browser) {
    const jsonString = JSON.stringify([...value]);
    window.localStorage.setItem('prefectures', jsonString);
  }
});
