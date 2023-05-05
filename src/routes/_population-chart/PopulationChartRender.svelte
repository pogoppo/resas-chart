<script lang="ts">
	import Fa from 'svelte-fa';
	import { faSpinner } from '@fortawesome/free-solid-svg-icons';

	import { populationChartProcessing } from '$lib/utils/population-chart-setup';
	export let populationChartRender: HTMLElement;
</script>

<div class="PopulationChartRender">
	<i
		class="PopulationChartRender__spinner"
		class:PopulationChartRender__spinner--processing={$populationChartProcessing}
	>
		<Fa icon={faSpinner} spin />
	</i>
	<div class="PopulationChartRender__render" bind:this={populationChartRender} />
</div>

<style lang="scss">
	.PopulationChartRender {
		position: relative;

		&__render {
			width: 100%;
			height: 480px;
			background-color: var(--theme-color-light);
		}

		&__spinner {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			z-index: 4;
			width: 100%;
			height: 100%;
			background-color: rgba(255, 255, 255, 0.75);
			color: var(--theme-color-accent);
			font-size: 64px;
			&:not(&--processing) {
				display: none;
			}
		}
	}
</style>
