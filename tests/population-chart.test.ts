import { expect, test } from '@playwright/test';
import i18n from '../src/lib/configs/i18n-ja.json' assert { type: "json" };
import chartConfig from '../src/lib/configs/population-chart-config.json' assert { type: "json" };

test('ページタイトルおよびi18n', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.PopulationChartRender');
  expect(await page.title()).toBe(i18n.page.index.title);
  await expect(page.locator('.PopulationChartTitle')).toHaveText(i18n.page.index.title);
});

test('47都道府県のナビゲーション', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.PopulationChartPrefectures');
  expect((await page.locator('.PopulationChartPrefectures__item').all()).length).toBe(47);

  const storageState = await page.context().storageState();
  const storagedPrefectures = storageState.origins[0].localStorage.find((item) => item.name === 'prefectures');
  expect(storagedPrefectures?.value).toBe(`[${chartConfig.defaultPrefCodeSet.toString()}]`);

  const notActivePItem = page.locator('.PopulationChartPrefectures__item:not(.PopulationChartPrefectures__item--active)').first();
  const prefName = await notActivePItem.innerText();
  await page.waitForSelector('.PopulationChartPrefectures:not(.PopulationChartPrefectures--processing)');
  await notActivePItem.click();
  await page.waitForSelector('.PopulationChartPrefectures--processing');
  const activeItem = page.getByText(prefName);
  await expect(activeItem).toHaveClass(/PopulationChartPrefectures__item--active/);
});

test('EChartのレンダリング', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.PopulationChartRender__render canvas');
});

test('APIリクエストのエラーハンドリング', async ({ page }) => {
  await page.route('/api/v1/prefectures', route => route.fulfill({
    status: 500,
  }));
  await page.goto('/');
  await page.waitForSelector('.PopulationChartError');
  await expect(page.locator('.PopulationChartError')).toHaveText(i18n.error.populationChart);
});
