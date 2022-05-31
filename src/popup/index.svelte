<script lang="ts">
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings } from "../Storage";
	import Popup from "./Popup.svelte";

	let settingsPromise: Promise<ShlinkSettings> = loadSettings().then(
		(settings) => {
			console.log("Settings loaded!", settings);
			return settings;
		}
	);
</script>

{#await settingsPromise}
	<h1>loading...</h1>
{:then settings}
	<Popup {settings} />
{/await}
