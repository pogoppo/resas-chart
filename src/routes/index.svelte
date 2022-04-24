<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { prefectures } from '$lib/stores/population-chart-options';
	import PopulationChart from '$lib/utils/population-chart-setup';

	let populationChartRender: HTMLElement;

	onMount(async () => {
		const populationChartObj = new PopulationChart(populationChartRender);
		populationChartObj.update($prefectures);
	});
</script>

<svelte:head>
	<title />
</svelte:head>

<section class="PopulationChart">
	<div class="PopulationChart__render" bind:this={populationChartRender} />
</section>

<style lang="scss">
	.PopulationChart {
		&__render {
			width: 640px;
			height: 480px;
		}
	}
</style>
