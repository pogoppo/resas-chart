<script lang="ts">
	import { prefecturesMap } from '$lib/stores/prefectures-map';
	import { prefectures } from '$lib/stores/population-chart-options';
	import type PopulationChart from '$lib/utils/population-chart-setup';
	import { populationChartProcessing } from '$lib/utils/population-chart-setup';

	export let populationChartObj: PopulationChart;

	// 都道府県コードを東北、関東などでグループ分け
	const prefectureGroup = [
		[1, 2, 3, 4, 5, 6, 7],
		[8, 9, 10, 11, 12, 13, 14],
		[15, 16, 17, 18, 19, 20, 21, 22, 23],
		[24, 25, 26, 27, 28, 29, 30],
		[31, 32, 33, 34, 35],
		[36, 37, 38, 39],
		[40, 41, 42, 43, 44, 45, 46, 47]
	];

	const colorMap: { [prefCode: number]: string } = {};

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

		populationChartObj.update([...$prefectures]);
	};

	const mapColor = (prefCodeList: number[]) => {
		const chartOption = populationChartObj.chart.getOption();
		const themeColors = chartOption.color;

		if (!themeColors) {
			return;
		}

		prefCodeList.forEach((code, index) => {
			if (themeColors.length > index) {
				colorMap[code] = themeColors[index];
			} else {
				colorMap[code] = themeColors[index % themeColors.length];
			}
		});
	};

	$: {
		$populationChartProcessing;
		mapColor([...$prefectures]);
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
					style={`--graph-color: ${colorMap[code] ?? '#AAA'}`}
					on:click={() => switchPrefecture(code)}
					on:keypress={() => switchPrefecture(code)}
				>
					{$prefecturesMap[code]}
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
