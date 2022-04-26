<script lang="ts">
	import * as echarts from 'echarts';
	import echartsTheme from '$lib/configs/echarts-theme.json';

	import ResasHub from '$lib/repositories/resas-hub';
	import { prefecturesMap, type PrefecturesMap } from '$lib/stores/prefectures-map';

	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	const init = async () => {
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
