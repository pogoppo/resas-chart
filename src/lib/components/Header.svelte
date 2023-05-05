<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<header class="Header">
	<a href="https://github.com/pogoppo/resas-chart" class="Header__item">
		<i class="Header__github-icon">
			<Fa icon={faGithub} />
		</i>
		GitHub
	</a>
</header>

<style lang="scss">
	.Header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: 8px 16px;
		box-sizing: border-box;
		opacity: 0.5;
	}

	.Header {
		&__item {
			display: flex;
			align-items: center;
			gap: 4px;
			color: inherit;
			font-size: 14px;
			text-decoration: none;
		}
		&__github-icon {
			font-size: 16px;
		}
	}
</style>
