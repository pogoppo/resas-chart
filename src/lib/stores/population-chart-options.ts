import { browser } from '$app/env';
import { writable } from 'svelte/store';

const defaultValue = [13]; // 13 = 東京都の都道府県コード
const initialValue = (() => {
  if (!browser) {
    return defaultValue;
  }

  const storagedValue = window.localStorage.getItem('prefectures');
  if (storagedValue) {
    return JSON.parse(storagedValue);
  } else {
    return defaultValue;
  }
})();

export const prefectures = writable<number[]>(initialValue);
prefectures.subscribe((value) => {
  if (browser) {
    const jsonString = JSON.stringify(value);
    window.localStorage.setItem('prefectures', jsonString);
  }
});
