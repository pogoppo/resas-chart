<script lang="ts">
	import { init as i18nInit, addMessages } from 'svelte-i18n';
	import ja from '$lib/configs/i18n-ja.json';

	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	const init = async () => {
		await i18nInit({
			initialLocale: 'ja',
			fallbackLocale: 'ja'
		});
		addMessages('ja', ja);
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
