<script lang="ts">
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings, saveSettings } from "../Storage";
	import Settings from "./Settings.svelte";

	let settingsPromise: Promise<ShlinkSettings> = loadSettings().then(
		(settings) => {
			console.log("Settings loaded!", settings);
			return settings;
		}
	);

	const handleSave = async (settings: ShlinkSettings): Promise<void> => {
		await saveSettings(settings);
		console.log("Settings saved!", settings);
	};
</script>

{#await settingsPromise}
	<h1>loading...</h1>
{:then settings}
	<Settings {settings} {handleSave} />
{/await}
