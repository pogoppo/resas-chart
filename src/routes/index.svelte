<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { prefecturesMap } from '$lib/stores/prefectures-map';
	import { prefectures } from '$lib/stores/population-chart-options';
	import PopulationChart from '$lib/utils/population-chart-setup';

	let populationChartRender: HTMLElement;
	let populationChartObj: PopulationChart;

	const updateChart = async () => {
		const updatePromise = populationChartObj.update([...$prefectures]);
		// Proxyしてくれないので無理やり伝達
		populationChartObj.processing = populationChartObj.processing;
		await updatePromise;
		populationChartObj.processing = populationChartObj.processing;
	};

	const switchPrefecture = (prefCode: number) => {
		if (populationChartObj.processing) {
			return;
		}

		if ($prefectures.has(prefCode)) {
			if ($prefectures.size === 1) {
				return;
			}
			$prefectures.delete(prefCode);
		} else {
			$prefectures.add(prefCode);
		}
		prefectures.set(new Set([...$prefectures]));

		updateChart();
	};

	onMount(() => {
		populationChartObj = new PopulationChart(populationChartRender);
		updateChart();
	});
</script>

<svelte:head>
	<title>都道府県別人口推移グラフ</title>
</svelte:head>

<h1 class="PopulationChartTitle">都道府県別人口推移グラフ</h1>

<section class="PopulationChart">
	<nav class="PopulationChartPrefectures">
		<ol class="PopulationChartPrefectures__list">
			{#each Object.entries($prefecturesMap) as [code, name]}
				<li
					class="PopulationChartPrefectures__item"
					class:PopulationChartPrefectures__item--active={$prefectures.has(Number(code))}
					on:click={() => switchPrefecture(Number(code))}
				>
					{name}
				</li>
			{/each}
		</ol>
	</nav>

	<div
		class="PopulationChart__render-overray"
		class:PopulationChart__render-overray--processing={populationChartObj?.processing}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			class="PopulationChart__render-overray-spinner"
			class:PopulationChart__render-overray-spinner--processing={populationChartObj?.processing}
		>
			<!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
			<path
				d="M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z"
			/>
		</svg>
		<div class="PopulationChart__render" bind:this={populationChartRender} />
	</div>
</section>

<style lang="scss">
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.PopulationChartTitle {
		margin: 0;
		margin-bottom: 16px;
		font-size: min(32px, 6vw);
	}

	.PopulationChart {
		&__render {
			width: 100%;
			height: 320px;
			background-color: var(--theme-color-light);
		}
		&__render-overray-spinner {
			display: none;
			position: absolute;
			top: calc(50% - 32px);
			left: calc(50% - 32px);
			z-index: 4;
			width: 64px;
			height: 64px;
			fill: var(--theme-color-accent);
			animation-name: spin;
			animation-duration: 1s;
			animation-iteration-count: infinite;
			&--processing {
				display: block;
			}
		}
		&__render-overray {
			position: relative;
			&--processing::before {
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 3;
				width: 100%;
				height: 100%;
				background-color: #fff;
				opacity: 0.75;
			}
		}
	}
	.PopulationChartPrefectures {
		margin-bottom: 16px;
	}
	.PopulationChartPrefectures {
		&__list {
			list-style: none;
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			width: 100%;
			margin: 0;
			padding: 0;
		}
		&__item {
			position: relative;
			font-size: 0.8rem;
			cursor: pointer;
			opacity: 0.75;
			&--active {
				opacity: 1;
				&::after {
					content: '';
					display: block;
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 50%;
					background-color: var(--theme-color-accent-reverse);
					mix-blend-mode: multiply;
				}
			}
		}
	}
</style>
