<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	import PopulationChart from '$lib/utils/population-chart-setup';
	import { prefectures } from '$lib/stores/population-chart-options';

	import PopulationChartRender from './_population-chart/PopulationChartRender.svelte';
	import PopulationChartPrefectures from './_population-chart/PopulationChartPrefectures.svelte';

	let populationChartObj: PopulationChart;
	let populationChartRender: HTMLElement;
	const resizeChartEvent = () => {
		populationChartObj.chart.resize();
	};

	onMount(() => {
		populationChartObj = new PopulationChart(populationChartRender);
		populationChartObj.update([...$prefectures]);
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
		href="https://fonts.googleapis.com/css2?family=Murecho:wght@900&display=swap&text=都道府県別人口推移グラフ"
		rel="stylesheet"
	/>
</svelte:head>

<h1 class="PopulationChartTitle">{$_('page.index.title')}</h1>

<section>
	{#if populationChartObj}
		<PopulationChartPrefectures {populationChartObj} />
	{/if}
	<PopulationChartRender bind:populationChartRender />
</section>

<style lang="scss">
	.PopulationChartTitle {
		margin: 16px;
		font-family: 'Murecho', sans-serif;
		font-size: min(32px, 6vw);
		letter-spacing: 2px;
	}
</style>
