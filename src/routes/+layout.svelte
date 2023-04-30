<script lang="ts">
	import { init as i18nInit, addMessages } from 'svelte-i18n';
	import ja from '$lib/configs/i18n-ja.json';

	import * as echarts from 'echarts';
	import echartsTheme from '$lib/configs/echarts-theme.json';

	import ResasHub from '$lib/repositories/resas-hub';
	import { prefecturesMap, type PrefecturesMap } from '$lib/stores/prefectures-map';

	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	const init = async () => {
		i18nInit({
			initialLocale: 'ja',
			fallbackLocale: 'ja'
		});
		addMessages('ja', ja);

		const prefectures: PrefecturesMap = {};
		const resasHubRepo = new ResasHub();
		const rawPrefData = await resasHubRepo.getPrefectures();
		rawPrefData.forEach((obj) => {
			prefectures[obj.prefCode] = obj.prefName;
		});
		prefecturesMap.set(prefectures);

		echarts.registerTheme('resas', echartsTheme);
	};
</script>

<Header />

<main>
	{#await init() then _}
		<slot />
	{/await}
</main>

<style>
	main {
		max-width: 800px;
		margin: 32px auto;
	}
</style>
