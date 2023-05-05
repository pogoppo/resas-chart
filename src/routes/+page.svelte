<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	import * as echarts from 'echarts';
	import echartsTheme from '$lib/configs/echarts-theme.json';

	import ResasHub from '$lib/repositories/resas-hub';
	import PopulationChart from '$lib/utils/population-chart-setup';
	import { prefectures, type PrefecturesMap } from '$lib/stores/population-chart-options';
	import { populationChartError } from '$lib/stores/display-errors';

	import PopulationChartRender from './_population-chart/PopulationChartRender.svelte';
	import PopulationChartPrefectures from './_population-chart/PopulationChartPrefectures.svelte';

	let populationChartObj: PopulationChart;
	let populationChartRender: HTMLElement;
	const resizeChartEvent = () => {
		populationChartObj.chart.resize();
	};

	onMount(async () => {
		echarts.registerTheme('resas', echartsTheme);

		const resasHubRepo = new ResasHub();
		const prefecturesMap: PrefecturesMap = {};

		try {
			const rawPrefData = await resasHubRepo.getPrefectures();
			rawPrefData.forEach((obj) => {
				prefecturesMap[obj.prefCode] = obj.prefName;
			});
		} catch {
			const error = new Error($_('error.populationChart'));
			populationChartError.set(error);
			return;
		}

		try {
			populationChartObj = new PopulationChart(populationChartRender, resasHubRepo, prefecturesMap);
			await populationChartObj.update([...$prefectures]);
		} catch {
			const error = new Error($_('error.populationChart'));
			populationChartError.set(error);
			return;
		}

		window.addEventListener('resize', resizeChartEvent);
	});

	onDestroy(() => {
		window.removeEventListener('resize', resizeChartEvent);
	});
</script>

<svelte:head>
	<title>{$_('page.index.title')}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Murecho:wght@900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<h1 class="PopulationChartTitle">{$_('page.index.title')}</h1>

{#if $populationChartError}
	<section class="PopulationChartError">
		{$populationChartError.message}
	</section>
{:else}
	<section style:visibility={populationChartObj ? 'visible' : 'hidden'}>
		{#if populationChartObj}
			<PopulationChartPrefectures {populationChartObj} />
		{/if}
		<PopulationChartRender bind:populationChartRender />
	</section>
{/if}

<style lang="scss">
	.PopulationChartTitle {
		margin: 16px;
		font-family: 'Murecho', sans-serif;
		font-size: min(32px, 6vw);
		letter-spacing: 2px;
	}
	.PopulationChartError {
		margin: 32px 16px;
		padding: 32px;
		background-color: var(--theme-color-light);
		border: 2px solid var(--theme-color-softlight);
		font-size: 16px;
		text-align: center;
	}
</style>
