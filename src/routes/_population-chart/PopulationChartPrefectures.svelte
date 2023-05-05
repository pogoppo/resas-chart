<script lang="ts">
	import { _ } from 'svelte-i18n';

	import { populationChartError } from '$lib/stores/display-errors';
	import { prefectures } from '$lib/stores/population-chart-options';
	import type PopulationChart from '$lib/utils/population-chart-setup';
	import { populationChartProcessing } from '$lib/utils/population-chart-setup';
	import chartConfig from '$lib/configs/population-chart-config.json';

	export let populationChartObj: PopulationChart;

	// 都道府県コードを東北、関東などでグループ分け
	const prefectureGroup = chartConfig.prefectureGroup;

	type ColorMap = { [prefCode: number]: string };
	let colorMap: ColorMap = {};

	const switchPrefecture = (prefCode: number) => {
		if ($populationChartProcessing) {
			return;
		}

		if ($prefectures.has(prefCode)) {
			if ($prefectures.size === 1) {
				return;
			}
			$prefectures.delete(prefCode);
		} else {
			if ($prefectures.size > 7) {
				$prefectures.delete([...$prefectures.values()][0]);
			}
			$prefectures.add(prefCode);
		}

		prefectures.set(new Set([...$prefectures]));

		try {
			populationChartObj.update([...$prefectures]);
		} catch {
			const error = new Error($_('error.populationChart'));
			populationChartError.set(error);
			return;
		}
	};

	const mapColor = (prefCodeList: number[]): ColorMap => {
		const colorMap: ColorMap = {};
		const chartOption = populationChartObj.chart.getOption();
		const themeColors = chartOption.color;

		if (!themeColors) {
			return {};
		}

		prefCodeList.forEach((code, index) => {
			colorMap[code] = themeColors[index % themeColors.length];
		});

		return colorMap;
	};

	$: {
		$populationChartProcessing;
		colorMap = mapColor([...$prefectures]);
	}
</script>

<nav
	class="PopulationChartPrefectures"
	class:PopulationChartPrefectures--processing={$populationChartProcessing}
>
	{#each prefectureGroup as list}
		<ol class="PopulationChartPrefectures__list">
			{#each list as code}
				<li
					class="PopulationChartPrefectures__item"
					class:PopulationChartPrefectures__item--active={$prefectures.has(code)}
					style:--graph-color={colorMap[code] ?? '#AAA'}
					on:click={() => switchPrefecture(code)}
					on:keypress={() => switchPrefecture(code)}
				>
					{populationChartObj.prefecturesMap[code]}
				</li>
			{/each}
		</ol>
	{/each}
</nav>

<style lang="scss">
	.PopulationChartPrefectures {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 16px;
		&--processing {
			opacity: 0.5;
		}
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
			&:not(:last-child) {
				padding-bottom: 8px;
				border-bottom: 1px dashed var(--theme-color-softlight);
			}
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
					bottom: 2px;
					left: 0;
					width: 100%;
					height: 33%;
					background-color: var(--graph-color);
					mix-blend-mode: multiply;
					opacity: 0.5;
				}
			}
		}
	}
</style>
